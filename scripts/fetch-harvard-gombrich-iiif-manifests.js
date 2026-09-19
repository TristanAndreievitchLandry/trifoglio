#!/usr/bin/env node
/**
 * Harvest Harvard Art Museums IIIF manifests that match broad Gombrich-style
 * art-history periods.
 *
 * Harvard's public website should not be scraped for this. Their documented API
 * exposes object metadata, requires an API key, and provides stable IIIF
 * manifests at https://iiif.harvardartmuseums.org/manifests/object/{objectid}.
 *
 * Usage:
 *   $env:HARVARD_ART_MUSEUMS_API_KEY="YOUR-KEY"
 *   node scripts/fetch-harvard-gombrich-iiif-manifests.js
 *
 * You can also create a local .env.local file containing:
 *   HARVARD_ART_MUSEUMS_API_KEY=YOUR-KEY
 *
 * Options:
 *   --apikey=...                 Alternative to HARVARD_ART_MUSEUMS_API_KEY
 *   --out=data/harvard-gombrich-iiif-manifests.json
 *   --limit-per-period=25        Max records kept per period
 *   --pages-per-query=2          Max API pages per individual query
 *   --size=50                    API page size, max 100
 */

const fs = require('fs');
const path = require('path');

const API_BASE_URL = 'https://api.harvardartmuseums.org/object';
const IIIF_MANIFEST_BASE_URL = 'https://iiif.harvardartmuseums.org/manifests/object/';
const USER_AGENT =
  'Trifoglio-Harvard-Gombrich-Harvester/1.0 (https://github.com/TristanAndreievitchLandry/trifoglio)';

const FIELDS = [
  'objectid',
  'objectnumber',
  'title',
  'dated',
  'datebegin',
  'dateend',
  'classification',
  'culture',
  'period',
  'century',
  'division',
  'url',
  'primaryimageurl',
  'imagecount',
  'imagepermissionlevel',
  'verificationlevel',
  'people',
].join(',');

const GOMBRICH_PERIODS = [
  {
    period: '1. Mystérieux débuts : préhistoire, premiers arts',
    queries: [
      { keyword: 'prehistoric' },
      { culture: 'Ancient American' },
      { keyword: 'Maya' },
      { keyword: 'Olmec' },
      { keyword: 'Nazca' },
    ],
  },
  {
    period: "2. Un art pour l'éternité : Égypte, Mésopotamie, Crète",
    queries: [
      { culture: 'Egyptian' },
      { keyword: 'Egyptian' },
      { keyword: 'Mesopotamian' },
      { keyword: 'Sumerian' },
      { keyword: 'Assyrian' },
      { keyword: 'Minoan' },
    ],
  },
  {
    period:
      '3-4. Le Grand Éveil / La Terre de la beauté : Grèce archaïque, classique et hellénistique',
    queries: [
      { culture: 'Greek' },
      { period: 'Archaic period' },
      { period: 'Classical period' },
      { period: 'Hellenistic period' },
      { keyword: 'Greek vase' },
    ],
  },
  {
    period: "5. Conquérants d'empires : Rome, premiers chrétiens, juifs",
    queries: [
      { culture: 'Roman' },
      { keyword: 'Roman' },
      { keyword: 'Early Christian' },
      { keyword: 'Byzantine' },
      { keyword: 'Jewish' },
    ],
  },
  {
    period: '6. Bifurcation : Rome et Byzance',
    queries: [{ culture: 'Byzantine' }, { keyword: 'Byzantine' }, { keyword: 'icon' }],
  },
  {
    period: "7. Regard vers l'est : Islam et Chine",
    queries: [
      { culture: 'Chinese' },
      { culture: 'Islamic' },
      { keyword: 'Quran' },
      { keyword: 'Persian' },
      { keyword: 'Mughal' },
      { keyword: 'Ottoman' },
    ],
  },
  {
    period: '8-11. Le creuset occidental / art roman / art gothique / XIVe siècle',
    queries: [
      { keyword: 'medieval' },
      { keyword: 'Romanesque' },
      { keyword: 'Gothic' },
      { keyword: 'manuscript' },
      { keyword: 'book of hours' },
      { yearmade: '600-1400' },
    ],
  },
  {
    period: '12-17. Renaissance : réalité, Italie, Nord des Alpes',
    queries: [
      { keyword: 'Renaissance' },
      { keyword: 'Italian Renaissance' },
      { keyword: 'Northern Renaissance' },
      { keyword: 'Dürer' },
      { keyword: 'Cranach' },
      { yearmade: '1400-1550' },
    ],
  },
  {
    period: '18. Maniérisme / fin du XVIe siècle',
    queries: [{ keyword: 'Mannerist' }, { keyword: 'Parmigianino' }, { yearmade: '1520-1600' }],
  },
  {
    period: '19-20. Baroque : Europe catholique et Hollande',
    queries: [
      { keyword: 'Baroque' },
      { keyword: 'Caravaggio' },
      { keyword: 'Rubens' },
      { keyword: 'Rembrandt' },
      { keyword: 'Dutch' },
      { yearmade: '1600-1700' },
    ],
  },
  {
    period: '21-23. XVIIe-XVIIIe : puissance, gloire, rococo, Lumières',
    queries: [
      { keyword: 'Rococo' },
      { keyword: 'Boucher' },
      { keyword: 'Fragonard' },
      { keyword: 'Neoclassical' },
      { yearmade: '1700-1800' },
    ],
  },
  {
    period: '24-25. Rupture et XIXe siècle : néoclassicisme, romantisme, réalisme',
    queries: [
      { keyword: 'Romantic' },
      { keyword: 'Realist' },
      { keyword: 'Ingres' },
      { keyword: 'Delacroix' },
      { keyword: 'Courbet' },
      { yearmade: '1800-1870' },
    ],
  },
  {
    period: '25-26. Impressionnisme et postimpressionnisme',
    queries: [
      { keyword: 'Impressionist' },
      { keyword: 'Post-Impressionist' },
      { keyword: 'Monet' },
      { keyword: 'Renoir' },
      { keyword: 'Cézanne' },
      { keyword: 'Van Gogh' },
      { yearmade: '1870-1905' },
    ],
  },
  {
    period: '27-28. Expérimentation moderne / modernisme',
    queries: [
      { keyword: 'Modern' },
      { keyword: 'Matisse' },
      { keyword: 'Picasso' },
      { keyword: 'Braque' },
      { keyword: 'Bauhaus' },
      { yearmade: '1900-1950' },
    ],
  },
];

function parseArgs(argv) {
  const args = {};
  for (const raw of argv) {
    const match = /^--([^=]+)(?:=(.*))?$/.exec(raw);
    if (!match) {
      continue;
    }
    args[match[1]] = match[2] === undefined ? true : match[2];
  }
  return args;
}

function readEnvFileValue(filePath, key) {
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const lines = fs.readFileSync(filePath, 'utf8').split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      continue;
    }

    const separatorIndex = trimmed.indexOf('=');
    if (separatorIndex < 0) {
      continue;
    }

    const name = trimmed.slice(0, separatorIndex).trim();
    if (name !== key) {
      continue;
    }

    return trimmed
      .slice(separatorIndex + 1)
      .trim()
      .replace(/^['"]|['"]$/g, '');
  }

  return null;
}

function getHarvardApiKey(args) {
  return (
    args.apikey ||
    process.env.HARVARD_ART_MUSEUMS_API_KEY ||
    readEnvFileValue(path.join(process.cwd(), '.env.local'), 'HARVARD_ART_MUSEUMS_API_KEY') ||
    readEnvFileValue(path.join(process.cwd(), '.env'), 'HARVARD_ART_MUSEUMS_API_KEY')
  );
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function compact(value) {
  return String(value || '').replace(/\s+/g, ' ').trim();
}

function getArtist(record) {
  const people = Array.isArray(record.people) ? record.people : [];
  const person = people.find((entry) => entry && entry.displayname) || people[0];
  return person && person.displayname ? person.displayname : null;
}

function buildApiUrl(apikey, params, page, size) {
  const query = new URLSearchParams({
    apikey,
    hasimage: '1',
    size: String(size),
    page: String(page),
    sort: 'rank',
    sortorder: 'asc',
    fields: FIELDS,
    ...params,
  });

  return API_BASE_URL + '?' + query.toString();
}

async function fetchHarvardPage(apikey, params, page, size) {
  const response = await fetch(buildApiUrl(apikey, params, page, size), {
    headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Harvard API HTTP ' + response.status);
  }

  return response.json();
}

async function validateApiKey(apikey) {
  await fetchHarvardPage(apikey, { hasimage: '1' }, 1, 1);
}

function toManifestEntry(record, matchedBy) {
  const objectId = record.objectid || record.id;
  return {
    title: compact(record.title) || 'Harvard Art Museums object ' + objectId,
    manifestUrl: IIIF_MANIFEST_BASE_URL + objectId,
    articleUrl: record.url || 'https://harvardartmuseums.org/collections/object/' + objectId,
    institution: 'Harvard Art Museums',
    objectId,
    objectNumber: record.objectnumber || null,
    artist: getArtist(record),
    dated: record.dated || null,
    dateBegin: Number.isFinite(record.datebegin) ? record.datebegin : null,
    dateEnd: Number.isFinite(record.dateend) ? record.dateend : null,
    classification: record.classification || null,
    culture: record.culture || null,
    period: record.period || null,
    century: record.century || null,
    division: record.division || null,
    imageCount: record.imagecount || 0,
    imagePermissionLevel: record.imagepermissionlevel,
    verificationLevel: record.verificationlevel,
    matchedBy,
  };
}

async function harvestPeriod(periodConfig, options, globalSeen) {
  const entries = [];
  const localSeen = new Set();

  for (const params of periodConfig.queries) {
    if (entries.length >= options.limitPerPeriod) {
      break;
    }

    for (let page = 1; page <= options.pagesPerQuery; page += 1) {
      if (entries.length >= options.limitPerPeriod) {
        break;
      }

      const data = await fetchHarvardPage(options.apikey, params, page, options.size);
      const records = Array.isArray(data.records) ? data.records : [];
      if (records.length === 0) {
        break;
      }

      for (const record of records) {
        const objectId = record.objectid || record.id;
        if (!objectId || localSeen.has(objectId) || globalSeen.has(objectId)) {
          continue;
        }

        localSeen.add(objectId);
        globalSeen.add(objectId);
        entries.push(toManifestEntry(record, params));
        if (entries.length >= options.limitPerPeriod) {
          break;
        }
      }

      await sleep(options.delayMs);
    }
  }

  return {
    period: periodConfig.period,
    queries: periodConfig.queries,
    manifests: entries,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const apikey = getHarvardApiKey(args);
  if (!apikey) {
    console.error(
      'Missing Harvard Art Museums API key. Set HARVARD_ART_MUSEUMS_API_KEY, create .env.local, or pass --apikey=YOUR_KEY.',
    );
    process.exitCode = 1;
    return;
  }

  const options = {
    apikey,
    limitPerPeriod: Number(args['limit-per-period']) || 25,
    pagesPerQuery: Number(args['pages-per-query']) || 2,
    size: Math.min(Number(args.size) || 50, 100),
    delayMs: Number(args.delay) || 250,
  };
  const outPath = path.join(
    process.cwd(),
    args.out || 'data/harvard-gombrich-iiif-manifests.json',
  );

  try {
    await validateApiKey(apikey);
  } catch (error) {
    console.error('Harvard API key validation failed: ' + error.message);
    console.error('No output file was written. Check that the key is present and copied correctly.');
    process.exitCode = 1;
    return;
  }

  const globalSeen = new Set();
  const periods = [];
  for (const periodConfig of GOMBRICH_PERIODS) {
    console.log('Harvesting ' + periodConfig.period + '...');
    try {
      const period = await harvestPeriod(periodConfig, options, globalSeen);
      periods.push(period);
      console.log('  -> ' + period.manifests.length + ' manifest(s)');
    } catch (error) {
      periods.push({ period: periodConfig.period, queries: periodConfig.queries, error: error.message, manifests: [] });
      console.error('  ! ' + error.message);
    }
  }

  const result = {
    source: {
      basis: 'Harvard Art Museums API object metadata filtered by broad Gombrich-style art-history categories.',
      api: API_BASE_URL,
      iiifManifestPattern: IIIF_MANIFEST_BASE_URL + '{objectid}',
      generatedAt: new Date().toISOString(),
      termsNote:
        'Harvard Art Museums API terms ask users not to cache/store API content for more than two weeks without permission.',
    },
    periods,
  };

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2) + '\n', 'utf8');

  const total = periods.reduce((sum, period) => sum + period.manifests.length, 0);
  console.log('Wrote ' + total + ' manifest(s) to ' + outPath);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

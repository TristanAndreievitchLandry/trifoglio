#!/usr/bin/env node
/**
 * Discover IIIF manifest URLs for works that also have a Wikipedia article,
 * using Wikidata as the bridge between the two (property P6108 "IIIF
 * manifest URL", inspired by manifests such as
 * https://libraryimage.nga.gov/manifest/ic/99831103804896.json).
 *
 * Wikipedia itself rarely links raw manifest.json files directly, but many
 * GLAM-related Wikidata items record their IIIF manifest via P6108 and are
 * also the subject of a Wikipedia article (schema:about / schema:isPartOf).
 * This script queries the Wikidata Query Service for that intersection.
 *
 * Requires Node.js 18+ (for the built-in `fetch`).
 *
 * Usage:
 *   node scripts/fetch-wikipedia-iiif-manifests.js [options]
 *
 * Options:
 *   --wikis=en.wikipedia.org,fr.wikipedia.org   Wikipedia editions to require an article on
 *   --limit=2000                                Max Wikidata rows to fetch
 *   --verify                                    Fetch each manifest URL and confirm it is IIIF
 *   --out=data/wikipedia-iiif-manifests.json
 */

const fs = require('fs');
const path = require('path');

const USER_AGENT =
  'Trifoglio-IIIF-ManifestScout/1.0 (https://github.com/TristanAndreievitchLandry/trifoglio)';
const SPARQL_ENDPOINT = 'https://query.wikidata.org/sparql';

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

function splitList(value, fallback) {
  if (!value || typeof value !== 'string') {
    return fallback;
  }
  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

async function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function buildSparqlQuery(wikis, limit) {
  const wikiUris = wikis.map((host) => `<https://${host}/>`).join(', ');

  return `SELECT ?item ?itemLabel ?url ?article WHERE {
  ?item wdt:P6108 ?url .
  ?article schema:about ?item ;
           schema:isPartOf ?wiki .
  FILTER(?wiki IN (${wikiUris}))
  SERVICE wikibase:label { bd:serviceParam wikibase:language "en,fr". }
}
LIMIT ${limit}`;
}

async function queryWikidata(query) {
  const url =
    SPARQL_ENDPOINT + '?format=json&query=' + encodeURIComponent(query);
  const response = await fetch(url, {
    headers: {
      Accept: 'application/sparql-results+json',
      'User-Agent': USER_AGENT,
    },
  });
  if (!response.ok) {
    throw new Error('SPARQL query failed with HTTP ' + response.status);
  }
  const data = await response.json();
  return data.results.bindings;
}

// Fetch a candidate URL and check whether it looks like a IIIF manifest.
async function verifyIiifManifest(url) {
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT, Accept: 'application/json' },
    });
    if (!response.ok) {
      return { verified: false };
    }

    const text = await response.text();
    if (text.trim().startsWith('<')) {
      return { verified: false };
    }

    const data = JSON.parse(text);
    const context = Array.isArray(data['@context'])
      ? data['@context'].join(' ')
      : String(data['@context'] || '');
    const looksLikeIiif =
      context.indexOf('iiif.io/api/presentation') !== -1 ||
      data.type === 'Manifest' ||
      data['@type'] === 'sc:Manifest';

    if (!looksLikeIiif) {
      return { verified: false };
    }

    const label = data.label;
    const title =
      typeof label === 'string'
        ? label
        : label && label.en && label.en[0]
          ? label.en[0]
          : label && Object.values(label)[0] && Object.values(label)[0][0]
            ? Object.values(label)[0][0]
            : null;

    const provider =
      Array.isArray(data.provider) && data.provider[0] && data.provider[0].label
        ? data.provider[0].label.en
          ? data.provider[0].label.en[0]
          : Object.values(data.provider[0].label)[0][0]
        : null;

    return {
      verified: true,
      title: title || null,
      institution: provider || null,
    };
  } catch (_error) {
    return { verified: false };
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const wikis = splitList(args.wikis, ['en.wikipedia.org', 'fr.wikipedia.org']);
  const limit = Number(args.limit) || 2000;
  const shouldVerify = Boolean(args.verify);
  const outPath = path.join(
    process.cwd(),
    args.out || 'data/wikipedia-iiif-manifests.json',
  );

  console.log(
    `Querying Wikidata for items with a P6108 IIIF manifest URL and an article on: ${wikis.join(', ')}...`,
  );
  const query = buildSparqlQuery(wikis, limit);
  const bindings = await queryWikidata(query);
  console.log(`Wikidata returned ${bindings.length} row(s).`);

  // De-duplicate by manifest URL (an item can have an article on several wikis).
  const byUrl = new Map();
  for (const row of bindings) {
    const url = row.url && row.url.value;
    if (!url || byUrl.has(url)) {
      continue;
    }
    byUrl.set(url, {
      wikidataItem: row.item && row.item.value,
      label: row.itemLabel && row.itemLabel.value,
      manifestUrl: url,
      articleUrl: row.article && row.article.value,
    });
  }
  const unique = Array.from(byUrl.values());
  console.log(`${unique.length} unique manifest URL(s) after de-duplication.`);

  const results = [];
  if (shouldVerify) {
    console.log('Verifying candidates (this may take a while)...');
    for (const [index, entry] of unique.entries()) {
      const verification = await verifyIiifManifest(entry.manifestUrl);
      results.push({ ...entry, ...verification });
      process.stdout.write(
        `  [${index + 1}/${unique.length}] ${verification.verified ? 'OK' : 'skip'}: ${entry.manifestUrl}\n`,
      );
      await sleep(300);
    }
  } else {
    for (const entry of unique) {
      results.push({ ...entry, verified: null });
    }
  }

  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(results, null, 2) + '\n', 'utf8');
  console.log(`Wrote ${results.length} entries to ${outPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

const fs = require('fs');
const path = require('path');
const { minify } = require('terser');
const JavaScriptObfuscator = require('javascript-obfuscator');

const projectRoot = process.cwd();
const distDir = path.join(projectRoot, 'dist');

async function copyPath(relativePath) {
  const source = path.join(projectRoot, relativePath);
  const target = path.join(distDir, relativePath);
  fs.cpSync(source, target, { recursive: true });
}

async function ensureDist() {
  fs.rmSync(distDir, { recursive: true, force: true });
  fs.mkdirSync(distDir, { recursive: true });
}

async function minifyAndObfuscate(relativePath, options = {}) {
  const sourcePath = path.join(projectRoot, relativePath);
  const sourceCode = fs.readFileSync(sourcePath, 'utf8');

  const minified = await minify(sourceCode, {
    compress: true,
    mangle: true,
    format: {
      comments: false,
    },
  });

  if (!minified || !minified.code) {
    throw new Error('Minification failed for ' + relativePath);
  }

  const obfuscated = JavaScriptObfuscator.obfuscate(minified.code, {
    compact: true,
    controlFlowFlattening: options.strict === true,
    controlFlowFlatteningThreshold: options.strict === true ? 0.4 : 0,
    deadCodeInjection: options.strict === true,
    deadCodeInjectionThreshold: options.strict === true ? 0.2 : 0,
    disableConsoleOutput: false,
    identifierNamesGenerator: 'hexadecimal',
    renameGlobals: false,
    rotateStringArray: true,
    selfDefending: options.strict === true,
    simplify: true,
    splitStrings: options.strict === true,
    splitStringsChunkLength: 8,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    stringArrayThreshold: 0.75,
    transformObjectKeys: false,
    unicodeEscapeSequence: false,
  });

  const baseName = path.basename(relativePath, '.js');
  const targetRelativePath = baseName + '.min.js';
  fs.writeFileSync(
    path.join(distDir, targetRelativePath),
    obfuscated.getObfuscatedCode(),
    'utf8',
  );

  return { source: relativePath, target: targetRelativePath };
}

function buildIndex(scriptMap) {
  const sourceIndexPath = path.join(projectRoot, 'index.html');
  let html = fs.readFileSync(sourceIndexPath, 'utf8');

  const runtimePaths = {
    styles: [
      'src/app/styles/app.css',
      'https://unpkg.com/leaflet@1.0.2/dist/leaflet.css',
      'src/lib/vendors/leaflet-draw/leaflet.draw.css',
    ],
    scripts: [
      'https://unpkg.com/leaflet@1.0.2/dist/leaflet.js',
      'src/lib/vendors/leaflet-draw/leaflet.draw.js',
      'https://ajax.googleapis.com/ajax/libs/jquery/1.8/jquery.min.js',
      'src/lib/vendors/leaflet/plugins/leaflet-iiif.js',
      'src/lib/vendors/leaflet/plugins/leaflet-hash.js',
      scriptMap['src/app/data/catalogs.js'],
      scriptMap['src/app/entry/i18n-runtime.js'] + '?v=20260807-fr-default',
      'src/lib/vendors/gsap/gsap.min.js',
      scriptMap['src/app/entry/main.js'] + '?v=20260807-fr-default',
    ],
  };

  const runtimeConfigTag =
    '<script>window.__TRF_RUNTIME_PATHS__=' +
    JSON.stringify(runtimePaths) +
    ';</script>';

  html = html.replace(
    '<script src="src/app/entry/bootstrap.js"></script>',
    runtimeConfigTag + '<script src="src/app/entry/bootstrap.js"></script>',
  );

  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
}

async function run() {
  const strict = process.argv.includes('--strict');

  await ensureDist();

  const copyList = [
    'src/app/assets',
    'src/lib/vendors',
    'src/lib/i18n',
    'src/app/styles/app.css',
    'src/app/entry/bootstrap.js',
    'LICENSE',
  ];

  copyList.forEach((relativePath) => {
    if (fs.existsSync(path.join(projectRoot, relativePath))) {
      copyPath(relativePath);
    }
  });

  const output = await Promise.all([
    minifyAndObfuscate('src/app/entry/main.js', { strict }),
    minifyAndObfuscate('src/app/entry/i18n-runtime.js', { strict }),
    minifyAndObfuscate('src/app/data/catalogs.js', { strict: false }),
  ]);

  const scriptMap = output.reduce((acc, item) => {
    acc[item.source] = item.target;
    return acc;
  }, {});

  buildIndex(scriptMap);

  console.log('Protected build generated in dist/');
  console.log('Mode:', strict ? 'strict' : 'standard');
}

run().catch((error) => {
  console.error(error);
  process.exit(1);
});

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

  html = html
    .replace(/\bi18n-runtime\.js\b/g, scriptMap['i18n-runtime.js'])
    .replace(/\bdata\.js\b/g, scriptMap['data.js'])
    .replace(/main\.js\?v=[^"']+/g, scriptMap['main.js'])
    .replace(/\bmain\.js\b/g, scriptMap['main.js']);

  fs.writeFileSync(path.join(distDir, 'index.html'), html, 'utf8');
}

async function run() {
  const strict = process.argv.includes('--strict');

  await ensureDist();

  const copyList = [
    'assets',
    'vendor',
    'src/lib/i18n',
    'styles.css',
    'leaflet-hash.js',
    'leaflet-iiif.js',
    'clover_300.png',
    'clover_icon.png',
    'LICENSE',
  ];

  copyList.forEach((relativePath) => {
    if (fs.existsSync(path.join(projectRoot, relativePath))) {
      copyPath(relativePath);
    }
  });

  const output = await Promise.all([
    minifyAndObfuscate('main.js', { strict }),
    minifyAndObfuscate('i18n-runtime.js', { strict }),
    minifyAndObfuscate('data.js', { strict: false }),
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

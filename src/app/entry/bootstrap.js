(function () {
  // Runtime manifest for app-owned and vendor resources.
  const runtimeStamp = '20260815-top-info-modal';

  const defaultRuntime = {
    styles: [
      'src/app/styles/app.css?v=' + runtimeStamp,
      'https://unpkg.com/leaflet@1.0.2/dist/leaflet.css?v=' + runtimeStamp,
      'src/lib/vendors/leaflet-draw/leaflet.draw.css?v=' + runtimeStamp,
    ],
    scripts: [
      'https://unpkg.com/leaflet@1.0.2/dist/leaflet.js?v=' + runtimeStamp,
      'src/lib/vendors/leaflet-draw/leaflet.draw.js?v=' + runtimeStamp,
      'src/lib/vendors/leaflet/plugins/leaflet-iiif.js?v=' + runtimeStamp,
      'src/lib/vendors/leaflet/plugins/leaflet-hash.js?v=' + runtimeStamp,
      'src/app/data/catalogs.js?v=' + runtimeStamp,
      'src/app/entry/i18n-runtime.js?v=20260807-fr-default&cache=' +
        runtimeStamp,
      'src/lib/vendors/gsap/gsap.min.js?v=' + runtimeStamp,
      'src/app/entry/main.js?v=20260807-fr-default&cache=' + runtimeStamp,
    ],
  };

  const runtime = window.__TRF_RUNTIME_PATHS__ || defaultRuntime;

  function getScriptFallback(src) {
    if (!src) {
      return null;
    }

    const queryIndex = src.indexOf('?');
    const query = queryIndex >= 0 ? src.slice(queryIndex) : '';
    const cleanSrc = queryIndex >= 0 ? src.slice(0, queryIndex) : src;

    if (cleanSrc === 'src/app/data/catalogs.js') {
      return 'catalogs.min.js' + query;
    }

    if (cleanSrc === 'src/app/entry/i18n-runtime.js') {
      return 'i18n-runtime.min.js' + query;
    }

    if (cleanSrc === 'src/app/entry/main.js') {
      return 'main.min.js' + query;
    }

    return null;
  }

  function ensureStyle(href) {
    if (!href) {
      return;
    }

    const existing = document.querySelector(
      'link[data-trf-style="' + href + '"]',
    );
    if (existing) {
      return;
    }

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute('data-trf-style', href);
    document.head.appendChild(link);
  }

  function loadScriptSequentially(src) {
    return new Promise(function (resolve, reject) {
      if (!src) {
        resolve();
        return;
      }

      const fallbackSrc = getScriptFallback(src);

      const existing = document.querySelector(
        'script[data-trf-script="' + src + '"]',
      );
      if (existing) {
        if (existing.getAttribute('data-trf-loaded') === 'true') {
          resolve();
          return;
        }

        existing.addEventListener('load', function () {
          resolve();
        });
        existing.addEventListener('error', function () {
          reject(new Error('Failed to load script: ' + src));
        });
        return;
      }

      const script = document.createElement('script');
      script.src = src;
      script.async = false;
      script.setAttribute('data-trf-script', src);
      script.addEventListener('load', function () {
        script.setAttribute('data-trf-loaded', 'true');
        resolve();
      });
      script.addEventListener('error', function () {
        if (fallbackSrc && fallbackSrc !== src) {
          loadScriptSequentially(fallbackSrc)
            .then(resolve)
            .catch(function () {
              reject(new Error('Failed to load script: ' + src));
            });
          return;
        }

        reject(new Error('Failed to load script: ' + src));
      });
      document.body.appendChild(script);
    });
  }

  async function boot() {
    (runtime.styles || []).forEach(ensureStyle);

    const scripts = runtime.scripts || [];
    for (let index = 0; index < scripts.length; index += 1) {
      await loadScriptSequentially(scripts[index]);
    }
  }

  boot().catch(function (error) {
    console.error('[Trifoglio Bootstrap]', error);
  });
})();

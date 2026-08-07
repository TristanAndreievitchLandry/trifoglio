(function () {
  const DEFAULT_LOCALE = 'fr';
  const FALLBACK_LOCALE = 'en';
  const SUPPORTED_LOCALES = ['de', 'en', 'es', 'fr', 'it'];
  const STORAGE_KEY = 'appLocale';

  let activeLocale = DEFAULT_LOCALE;
  let dictionary = {};

  function normalizeLocale(inputLocale) {
    if (!inputLocale || typeof inputLocale !== 'string') {
      return DEFAULT_LOCALE;
    }

    const shortLocale = inputLocale.toLowerCase().split('-')[0];
    return SUPPORTED_LOCALES.includes(shortLocale)
      ? shortLocale
      : FALLBACK_LOCALE;
  }

  function getNestedValue(object, path) {
    return path.split('.').reduce(function (acc, part) {
      if (!acc || typeof acc !== 'object') {
        return undefined;
      }
      return acc[part];
    }, object);
  }

  function interpolate(template, params) {
    if (!params || typeof template !== 'string') {
      return template;
    }

    return template.replace(
      /\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g,
      function (_, key) {
        return Object.prototype.hasOwnProperty.call(params, key)
          ? String(params[key])
          : '';
      },
    );
  }

  function deepMerge(baseValue, overrideValue) {
    if (Array.isArray(baseValue) || Array.isArray(overrideValue)) {
      return Array.isArray(overrideValue) ? overrideValue.slice() : baseValue;
    }

    if (
      baseValue &&
      typeof baseValue === 'object' &&
      overrideValue &&
      typeof overrideValue === 'object'
    ) {
      const merged = Object.assign({}, baseValue);
      Object.keys(overrideValue).forEach(function (key) {
        merged[key] = deepMerge(baseValue[key], overrideValue[key]);
      });
      return merged;
    }

    if (typeof overrideValue === 'undefined') {
      return baseValue;
    }

    return overrideValue;
  }

  async function loadLocale(localeName) {
    const normalized = normalizeLocale(localeName);
    const fallbackResponse = await fetch(
      'src/lib/i18n/' + FALLBACK_LOCALE + '.json',
      {
        cache: 'no-cache',
      },
    );
    const fallbackDictionary = fallbackResponse.ok
      ? await fallbackResponse.json()
      : {};

    let localeDictionary = {};
    if (normalized !== FALLBACK_LOCALE) {
      try {
        const localeResponse = await fetch(
          'src/lib/i18n/' + normalized + '.json',
          {
            cache: 'no-cache',
          },
        );
        localeDictionary = localeResponse.ok ? await localeResponse.json() : {};
      } catch (_) {
        localeDictionary = {};
      }
    } else {
      localeDictionary = fallbackDictionary;
    }

    dictionary = deepMerge(fallbackDictionary, localeDictionary);
    activeLocale = normalized;
    localStorage.setItem(STORAGE_KEY, normalized);

    applyTranslations();
    window.dispatchEvent(
      new CustomEvent('i18n:ready', { detail: { locale: activeLocale } }),
    );
    return activeLocale;
  }

  function translate(key, params) {
    const value = getNestedValue(dictionary, key);
    if (typeof value === 'string') {
      return interpolate(value, params);
    }
    return key;
  }

  function applyTranslations() {
    const textNodes = document.querySelectorAll('[data-i18n-key]');
    textNodes.forEach(function (element) {
      const key = element.getAttribute('data-i18n-key');
      if (!key) {
        return;
      }
      element.textContent = translate(key);
    });

    const attrNodes = document.querySelectorAll('[data-i18n-attr]');
    attrNodes.forEach(function (element) {
      const attrConfig = element.getAttribute('data-i18n-attr');
      if (!attrConfig) {
        return;
      }

      attrConfig.split(';').forEach(function (pair) {
        const parts = pair.split(':');
        if (parts.length !== 2) {
          return;
        }
        const attrName = parts[0].trim();
        const key = parts[1].trim();
        if (!attrName || !key) {
          return;
        }
        element.setAttribute(attrName, translate(key));
      });
    });

    if (document.title && document.title === 'app.title') {
      document.title = translate('app.title');
    } else if (!document.title) {
      document.title = translate('app.title');
    }
  }

  function detectInitialLocale() {
    try {
      localStorage.setItem(STORAGE_KEY, DEFAULT_LOCALE);
    } catch (_) {
      // Ignore storage access errors.
    }

    return DEFAULT_LOCALE;
  }

  window.$t = translate;
  window.setAppLocale = loadLocale;
  window.getAppLocale = function () {
    return activeLocale;
  };
  window.applyI18nToDom = applyTranslations;

  loadLocale(detectInitialLocale());
})();

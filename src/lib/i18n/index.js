import { init, locale, register, waitLocale } from 'svelte-i18n';

export const DEFAULT_LOCALE = 'fr';
export const FALLBACK_LOCALE = 'en';

const SUPPORTED_LOCALES = ['de', 'en', 'es', 'fr', 'it'];

let isInitialized = false;

function normalizeLocale(inputLocale) {
  if (!inputLocale || typeof inputLocale !== 'string') {
    return DEFAULT_LOCALE;
  }

  const shortLocale = inputLocale.toLowerCase().split('-')[0];
  return SUPPORTED_LOCALES.includes(shortLocale)
    ? shortLocale
    : FALLBACK_LOCALE;
}

function registerLocales() {
  register('de', () => import('./de.json'));
  register('en', () => import('./en.json'));
  register('es', () => import('./es.json'));
  register('fr', () => import('./fr.json'));
  register('it', () => import('./it.json'));
}

export function setupI18n(selectedLocale = DEFAULT_LOCALE) {
  if (!isInitialized) {
    registerLocales();

    init({
      initialLocale: DEFAULT_LOCALE,
      fallbackLocale: FALLBACK_LOCALE,
    });

    isInitialized = true;
  }

  return loadLocale(selectedLocale);
}

export async function loadLocale(selectedLocale) {
  const nextLocale = normalizeLocale(selectedLocale);
  locale.set(nextLocale);
  await waitLocale();
  return nextLocale;
}

export function getSupportedLocales() {
  return [...SUPPORTED_LOCALES];
}

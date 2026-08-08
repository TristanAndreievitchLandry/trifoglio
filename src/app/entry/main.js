// Remove the global declaration of drawnLayers

const map = L.map('map', {
  center: [0, 0],
  crs: L.CRS.Simple,
  zoom: 0,
});

const IIIF_GUIDE_BUTTON_HTML =
  '<button id="iiif-guide-button" title="" data-i18n-attr="title:buttons.iiifGuide">' +
  '<svg class="iiif-mini-logo-svg" viewBox="0 0 120 110" aria-hidden="true" focusable="false">' +
  '<ellipse class="iiif-mini-logo-svg__blue" cx="20" cy="20" rx="12" ry="16" transform="rotate(-28 20 20)" />' +
  '<ellipse class="iiif-mini-logo-svg__red" cx="50" cy="18" rx="12" ry="16" transform="rotate(32 50 18)" />' +
  '<ellipse class="iiif-mini-logo-svg__blue" cx="80" cy="20" rx="12" ry="16" transform="rotate(-28 80 20)" />' +
  '<polygon class="iiif-mini-logo-svg__blue" points="8,34 32,42 32,90 8,82" />' +
  '<polygon class="iiif-mini-logo-svg__red" points="38,42 62,34 62,82 38,90" />' +
  '<polygon class="iiif-mini-logo-svg__blue" points="68,34 92,42 92,90 68,82" />' +
  '<path class="iiif-mini-logo-svg__red" d="M96 36 C96 20 106 12 118 10 L118 30 C111 31 109 34 109 40 L118 40 L118 54 L109 54 L109 93 L96 98 Z" />' +
  '</svg>' +
  '</button>';

const ANNOTATION_TOUR_BUTTON_HTML =
  '<button id="annotation-tour-button" title="" data-i18n-attr="title:buttons.annotationTour">' +
  '<i class="fa-solid fa-list-ol"></i>' +
  '<span id="annotation-tour-counter" class="annotation-tour-counter">0/0</span>' +
  '</button>';

function ensureAppShellElements() {
  if (!document.getElementById('language-switcher')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="language-switcher" class="language-switcher" aria-label="" data-i18n-attr="aria-label:accessibility.languageSwitcher">' +
        '<button type="button" class="language-switcher__item" data-locale="de">DE</button>' +
        '<span class="language-switcher__sep" aria-hidden="true">|</span>' +
        '<button type="button" class="language-switcher__item" data-locale="en">EN</button>' +
        '<span class="language-switcher__sep" aria-hidden="true">|</span>' +
        '<button type="button" class="language-switcher__item" data-locale="es">ES</button>' +
        '<span class="language-switcher__sep" aria-hidden="true">|</span>' +
        '<button type="button" class="language-switcher__item" data-locale="fr">FR</button>' +
        '<span class="language-switcher__sep" aria-hidden="true">|</span>' +
        '<button type="button" class="language-switcher__item" data-locale="it">IT</button>' +
        '</div>',
    );
  }

  if (!document.getElementById('manifestPanel')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="manifestPanel" class="manifest-panel is-hidden">' +
        '<div class="manifest-header">' +
        '<label for="manifest-input" data-i18n-key="manifest.label"></label>' +
        '<button id="manifest-close-button" type="button" title="" data-i18n-attr="title:buttons.close" aria-label="Close manifest modal">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '</div>' +
        '<div class="manifest-row">' +
        '<div class="manifest-input-wrap">' +
        '<input id="manifest-input" type="url" placeholder="" data-i18n-attr="placeholder:inputs.manifestPlaceholder" spellcheck="false" />' +
        '<button id="manifest-clear-button" type="button" title="Clear" aria-label="Clear manifest URL" class="is-hidden">' +
        '<i class="fa-solid fa-xmark"></i>' +
        '</button>' +
        '</div>' +
        '<button id="load-manifest-button" title="" data-i18n-key="buttons.load" data-i18n-attr="title:buttons.load"></button>' +
        '</div>' +
        '</div>',
    );
  }

  if (!document.getElementById('infoBox')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="infoBox" class="info-box"><div id="infoContent" class="info-content"></div></div>',
    );
  }

  if (!document.querySelector('.button-container')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div class="button-container">' +
        '<button id="info-button" title="" data-i18n-attr="title:buttons.info"><i class="fa-solid fa-info"></i></button>' +
        '<button id="ask-button" style="font-size: 20px" title="" data-i18n-attr="title:buttons.manifest"><i class="fa-solid fa-image"></i></button>' +
        IIIF_GUIDE_BUTTON_HTML +
        '<button id="save-button" onclick="downloadDrawnLayers()" title="" data-i18n-attr="title:buttons.save"><i class="fa-solid fa-download"></i></button>' +
        '<button id="add-button" title="" data-i18n-attr="title:buttons.importJson"><i class="fa-solid fa-plus"></i></button>' +
        '<button id="canvas-prev" title="" data-i18n-attr="title:buttons.previousPage"><i class="fa-solid fa-arrow-left"></i></button>' +
        '<button id="canvas-next" title="" data-i18n-attr="title:buttons.nextPage"><i class="fa-solid fa-arrow-right"></i></button>' +
        '<button id="page-counter-button" title="" data-i18n-attr="title:buttons.currentPage" disabled><span id="page-counter-value">0/0</span></button>' +
        '<button id="osm-button" title="" data-i18n-attr="title:buttons.osm"><i class="fa-solid fa-map"></i></button>' +
        ANNOTATION_TOUR_BUTTON_HTML +
        '<div id="osm-style-menu" class="osm-style-menu is-hidden">' +
        '<select id="osm-style-select" title="" data-i18n-attr="title:settings.osmMapStyle">' +
        '<option value="dark" selected data-i18n-key="menus.osm.dark"></option>' +
        '<option value="standard" data-i18n-key="menus.osm.standard"></option>' +
        '<option value="hot" data-i18n-key="menus.osm.humanitarian"></option>' +
        '<option value="topo" data-i18n-key="menus.osm.topo"></option>' +
        '<option value="cyclosm" data-i18n-key="menus.osm.cyclosm"></option>' +
        '<option value="voyager" data-i18n-key="menus.osm.voyager"></option>' +
        '</select>' +
        '</div>' +
        '</div>',
    );
  }

  const buttonContainer = document.querySelector('.button-container');
  const askButton = document.getElementById('ask-button');
  if (
    buttonContainer &&
    askButton &&
    !document.getElementById('iiif-guide-button')
  ) {
    askButton.insertAdjacentHTML('afterend', IIIF_GUIDE_BUTTON_HTML);
  }

  const osmButton = document.getElementById('osm-button');
  if (
    buttonContainer &&
    osmButton &&
    !document.getElementById('annotation-tour-button')
  ) {
    osmButton.insertAdjacentHTML('afterend', ANNOTATION_TOUR_BUTTON_HTML);
  }

  const annotationTourButton = document.getElementById(
    'annotation-tour-button',
  );
  if (
    annotationTourButton &&
    !document.getElementById('annotation-tour-counter')
  ) {
    annotationTourButton.insertAdjacentHTML(
      'beforeend',
      '<span id="annotation-tour-counter" class="annotation-tour-counter">0/0</span>',
    );
  }

  if (!document.getElementById('trf-alert-modal')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="trf-alert-modal" class="trf-alert-modal is-hidden" aria-hidden="true">' +
        '<div class="trf-alert-modal__panel" role="dialog" aria-modal="true" aria-labelledby="trf-alert-modal-title">' +
        '<img src="src/app/assets/branding/clover_300.png" class="trf-alert-modal__icon" alt="" aria-hidden="true">' +
        '<h3 id="trf-alert-modal-title" class="trf-alert-modal__title" data-i18n-key="app.title"></h3>' +
        '<p id="trf-alert-modal-message" class="trf-alert-modal__message"></p>' +
        '<label id="trf-alert-modal-input-wrap" class="trf-alert-modal__input-wrap is-hidden">' +
        '<input id="trf-alert-modal-input" class="trf-alert-modal__input" type="text" maxlength="120">' +
        '</label>' +
        '<div class="trf-alert-modal__actions">' +
        '<button id="trf-alert-modal-cancel" type="button" class="is-hidden"></button>' +
        '<button id="trf-alert-modal-close" type="button"></button>' +
        '</div>' +
        '</div>' +
        '</div>',
    );
  }

  if (!document.getElementById('trf-intro-screen')) {
    document.body.insertAdjacentHTML(
      'beforeend',
      '<div id="trf-intro-screen" class="trf-intro-screen is-hidden" aria-hidden="true">' +
        '<div class="trf-intro-screen__inner">' +
        '<span class="trf-intro-screen__aura" aria-hidden="true"></span>' +
        '<img src="src/app/assets/branding/clover_300.png" class="trf-intro-screen__logo" alt="Trifoglio clover logo">' +
        '<h1 class="trf-intro-screen__title">Trifoglio</h1>' +
        '</div>' +
        '</div>',
    );
  }
}

ensureAppShellElements();

function shouldPlayIntro() {
  const introScreen = document.getElementById('trf-intro-screen');
  if (!introScreen) {
    return false;
  }

  let searchParams = null;
  try {
    searchParams = new URLSearchParams(window.location.search || '');
  } catch (_) {
    searchParams = null;
  }

  const introMode = searchParams ? searchParams.get('intro') : null;
  if (introMode === '1' || introMode === 'true' || introMode === 'force') {
    return true;
  }

  if (introMode === 'reset') {
    try {
      localStorage.removeItem('trifoglioIntroSeen');
    } catch (_) {
      // Ignore storage access errors.
    }
    return true;
  }

  return true;
}

function playIntroWithGsap() {
  const introScreen = document.getElementById('trf-intro-screen');
  if (!introScreen || !shouldPlayIntro()) {
    return;
  }

  const introInner = introScreen.querySelector('.trf-intro-screen__inner');
  const introAura = introScreen.querySelector('.trf-intro-screen__aura');
  const introLogo = introScreen.querySelector('.trf-intro-screen__logo');
  const introTitle = introScreen.querySelector('.trf-intro-screen__title');
  if (!introInner || !introAura || !introLogo || !introTitle) {
    introScreen.remove();
    return;
  }

  introScreen.classList.remove('is-hidden');
  introScreen.setAttribute('aria-hidden', 'false');

  if (!window.gsap || typeof window.gsap.timeline !== 'function') {
    setTimeout(function () {
      introScreen.remove();
    }, 1700);
    return;
  }

  window.gsap.set(introScreen, { autoAlpha: 1 });
  window.gsap.set(introInner, {
    transformOrigin: '50% 50%',
    scale: 1,
    force3D: true,
  });
  window.gsap.set(introAura, {
    autoAlpha: 0,
    scale: 0.5,
    transformOrigin: '50% 50%',
    force3D: true,
  });
  window.gsap.set(introLogo, { autoAlpha: 1 });
  window.gsap.set(introTitle, { autoAlpha: 1 });

  const timeline = window.gsap.timeline({
    defaults: { overwrite: 'auto' },
    onComplete: function () {
      introScreen.remove();
    },
  });

  timeline
    .to({}, { duration: 1.5 })
    .to(introAura, {
      autoAlpha: 0.7,
      scale: 2.4,
      duration: 0.6,
      ease: 'power1.out',
    })
    .to(
      [introAura, introScreen],
      { autoAlpha: 0, duration: 0.6, ease: 'power2.inOut' },
      '-=0.1',
    );
}

playIntroWithGsap();

function t(key, params) {
  if (typeof window.$t === 'function') {
    return window.$t(key, params);
  }

  return key;
}

let currentIIIFAttribution = null;

function updateAttributionPrefix() {
  if (!map.attributionControl) {
    return;
  }

  const sourcePart = currentIIIFAttribution
    ? ' | <span class="iiif-source-attribution">' +
      currentIIIFAttribution +
      '</span>'
    : '';

  map.attributionControl.setPrefix(
    '<a href="https://leafletjs.com/">' +
      t('viewer.leaflet') +
      '</a>' +
      sourcePart,
  );
}

if (map.attributionControl) {
  updateAttributionPrefix();
}

map.on('popupopen', function (event) {
  if (!event || !event.popup) {
    return;
  }

  enhancePopupMediaControls(event.popup);
});

let osmLayer = null;

let manifestCanvasKeys = [];
let manifestCanvasLabels = {};
let currentCanvasIndex = -1;
let currentManifestId = null;
let currentCanvasKey = null;
const OSM_DEFAULT_CENTER = [-50, 50];
const OSM_DEFAULT_ZOOM = 1;
const MAP_CRS_SIMPLE = L.CRS.Simple;
const MAP_CRS_OSM = L.CRS.EPSG3857;
let pendingImportedGeoJson = null;
let pendingImportedManifestUrl = null;
let pendingImportedCanvasKey = null;
let currentOsmStyle = 'dark';
const DRAWINGS_STORAGE_KEY = 'drawingsByCanvas';
let drawingsByCanvas = {};
let drawControl = null;
let drawEventsBound = false;
let annotationTourCursor = -1;

const manifestInput = document.getElementById('manifest-input');
const manifestStatus = document.getElementById('manifest-status');
const manifestPanel = document.getElementById('manifestPanel');
const alertModal = document.getElementById('trf-alert-modal');
const alertModalMessage = document.getElementById('trf-alert-modal-message');
const alertModalInputWrap = document.getElementById(
  'trf-alert-modal-input-wrap',
);
const alertModalInput = document.getElementById('trf-alert-modal-input');
const alertModalAcceptWrap = document.getElementById(
  'trf-alert-modal-accept-wrap',
);
const alertModalAcceptInput = document.getElementById('trf-alert-modal-accept');
const alertModalAcceptLabel = document.getElementById(
  'trf-alert-modal-accept-label',
);
const alertModalCancelButton = document.getElementById(
  'trf-alert-modal-cancel',
);
const alertModalCloseButton = document.getElementById('trf-alert-modal-close');
const languageSwitcher = document.getElementById('language-switcher');
const manifestCloseButton = document.getElementById('manifest-close-button');
const manifestClearButton = document.getElementById('manifest-clear-button');
const loadManifestButton = document.getElementById('load-manifest-button');
const canvasPrevButton = document.getElementById('canvas-prev');
const canvasNextButton = document.getElementById('canvas-next');
const canvasPosition = document.getElementById('canvas-position');
const pageCounterValue = document.getElementById('page-counter-value');
const osmStyleMenu = document.getElementById('osm-style-menu');
const osmStyleSelect = document.getElementById('osm-style-select');
let modalResolver = null;

function closeAppAlert(result) {
  if (!alertModal) {
    return;
  }

  alertModal.classList.add('is-hidden');
  alertModal.setAttribute('aria-hidden', 'true');
  if (alertModalInputWrap) {
    alertModalInputWrap.classList.add('is-hidden');
  }
  if (alertModalAcceptWrap) {
    alertModalAcceptWrap.classList.add('is-hidden');
  }
  if (alertModalInput) {
    alertModalInput.value = '';
  }

  if (typeof modalResolver === 'function') {
    const resolve = modalResolver;
    modalResolver = null;
    resolve(result);
  }
}

function showAppAlert(message) {
  if (!alertModal || !alertModalMessage || !alertModalCloseButton) {
    return;
  }

  modalResolver = null;
  alertModalMessage.textContent = String(message || '');
  alertModalCloseButton.textContent = t('buttons.ok');
  if (alertModalCancelButton) {
    alertModalCancelButton.classList.add('is-hidden');
  }
  if (alertModalInputWrap) {
    alertModalInputWrap.classList.add('is-hidden');
  }
  alertModal.classList.remove('is-hidden');
  alertModal.setAttribute('aria-hidden', 'false');
  alertModalCloseButton.focus();
}

function showAppConfirm(message, confirmLabel, cancelLabel) {
  if (
    !alertModal ||
    !alertModalMessage ||
    !alertModalCloseButton ||
    !alertModalCancelButton
  ) {
    return Promise.resolve(false);
  }

  alertModalMessage.textContent = String(message || '');
  alertModalCloseButton.textContent = String(confirmLabel || t('buttons.ok'));
  alertModalCancelButton.textContent = String(
    cancelLabel || t('buttons.cancel'),
  );
  alertModalCancelButton.classList.remove('is-hidden');
  if (alertModalInputWrap) {
    alertModalInputWrap.classList.add('is-hidden');
  }
  if (alertModalCloseButton) {
    alertModalCloseButton.disabled = false;
  }
  alertModal.classList.remove('is-hidden');
  alertModal.setAttribute('aria-hidden', 'false');
  alertModalCloseButton.focus();

  return new Promise(function (resolve) {
    modalResolver = resolve;
  });
}

function showAppPrompt(message, defaultValue, confirmLabel, cancelLabel) {
  if (
    !alertModal ||
    !alertModalMessage ||
    !alertModalCloseButton ||
    !alertModalCancelButton ||
    !alertModalInputWrap ||
    !alertModalInput
  ) {
    return Promise.resolve(null);
  }

  alertModalMessage.textContent = String(message || '');
  alertModalCloseButton.textContent = String(confirmLabel || t('buttons.ok'));
  alertModalCancelButton.textContent = String(
    cancelLabel || t('buttons.cancel'),
  );
  alertModalCancelButton.classList.remove('is-hidden');
  alertModalInputWrap.classList.remove('is-hidden');
  if (alertModalCloseButton) {
    alertModalCloseButton.disabled = false;
  }
  alertModalInput.value = String(defaultValue || '');
  alertModal.classList.remove('is-hidden');
  alertModal.setAttribute('aria-hidden', 'false');
  alertModalInput.focus();
  alertModalInput.select();

  return new Promise(function (resolve) {
    modalResolver = resolve;
  });
}

if (alertModalCloseButton) {
  alertModalCloseButton.addEventListener('click', function () {
    if (
      alertModalInputWrap &&
      alertModalInput &&
      !alertModalInputWrap.classList.contains('is-hidden')
    ) {
      closeAppAlert(String(alertModalInput.value || ''));
      return;
    }

    closeAppAlert(true);
  });
}

if (alertModalCancelButton) {
  alertModalCancelButton.addEventListener('click', function () {
    closeAppAlert(false);
  });
}

if (alertModal) {
  alertModal.addEventListener('click', function (event) {
    if (event.target === alertModal) {
      closeAppAlert(false);
    }
  });

  document.addEventListener('keydown', function (event) {
    if (event.key === 'Escape' && !alertModal.classList.contains('is-hidden')) {
      closeAppAlert(false);
    }
  });
}

if (alertModalInput) {
  alertModalInput.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
      event.preventDefault();
      closeAppAlert(String(alertModalInput.value || ''));
    }
  });
}

const OSM_STYLE_DEFINITIONS = {
  dark: {
    url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
    options: {
      attribution: t('attribution.osmCarto'),
      subdomains: 'abcd',
      maxZoom: 19,
    },
  },
  standard: {
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    options: {
      attribution: t('attribution.osmStandard'),
      maxZoom: 19,
    },
  },
  hot: {
    url: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
    options: {
      attribution: t('attribution.osmHot'),
      maxZoom: 20,
    },
  },
  topo: {
    url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
    options: {
      attribution: t('attribution.osmTopo'),
      maxZoom: 17,
    },
  },
  cyclosm: {
    url: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
    options: {
      attribution: t('attribution.osmCyclosm'),
      maxZoom: 20,
    },
  },
  voyager: {
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    options: {
      attribution: t('attribution.osmCarto'),
      subdomains: 'abcd',
      maxZoom: 20,
    },
  },
};

function applyLeafletDrawTranslations() {
  if (!L.drawLocal) {
    return;
  }

  L.drawLocal = {
    draw: {
      toolbar: {
        actions: {
          title: t('toolbar.draw.cancelDrawing'),
          text: t('buttons.cancel'),
        },
        finish: {
          title: t('toolbar.draw.finishDrawing'),
          text: t('buttons.finish'),
        },
        undo: {
          title: t('toolbar.draw.deleteLastPointDrawn'),
          text: t('buttons.deleteLastPoint'),
        },
        buttons: {
          polyline: t('draw.buttons.polyline'),
          polygon: t('draw.buttons.polygon'),
          rectangle: t('draw.buttons.rectangle'),
          circle: t('draw.buttons.circle'),
          marker: t('draw.buttons.marker'),
          circlemarker: t('draw.buttons.circlemarker'),
        },
      },
      handlers: {
        circle: {
          tooltip: {
            start: t('draw.tooltip.circleStart'),
          },
          radius: t('draw.radius'),
        },
        circlemarker: {
          tooltip: {
            start: t('draw.tooltip.circleMarkerStart'),
          },
        },
        marker: {
          tooltip: {
            start: t('draw.tooltip.markerStart'),
          },
        },
        polygon: {
          tooltip: {
            start: t('draw.tooltip.polygonStart'),
            cont: t('draw.tooltip.polygonContinue'),
            end: t('draw.tooltip.polygonEnd'),
          },
        },
        polyline: {
          error: t('draw.errors.shapeEdgesCannotCross'),
          tooltip: {
            start: t('draw.tooltip.polylineStart'),
            cont: t('draw.tooltip.polylineContinue'),
            end: t('draw.tooltip.polylineEnd'),
          },
        },
        rectangle: {
          tooltip: {
            start: t('draw.tooltip.rectangleStart'),
          },
        },
        simpleshape: {
          tooltip: {
            end: t('draw.tooltip.simpleShapeEnd'),
          },
        },
      },
    },
    edit: {
      toolbar: {
        actions: {
          save: {
            title: t('toolbar.edit.saveChanges'),
            text: t('buttons.save'),
          },
          cancel: {
            title: t('toolbar.edit.cancelEditing'),
            text: t('buttons.cancel'),
          },
          clearAll: {
            title: t('toolbar.edit.clearAllLayers'),
            text: t('buttons.clearAll'),
          },
        },
        buttons: {
          edit: t('buttons.editLayers'),
          editDisabled: t('toolbar.edit.noLayersToEdit'),
          remove: t('buttons.deleteLayers'),
          removeDisabled: t('toolbar.edit.noLayersToDelete'),
        },
      },
      handlers: {
        edit: {
          tooltip: {
            text: t('draw.tooltip.editText'),
            subtext: t('draw.tooltip.editSubtext'),
          },
        },
        remove: {
          tooltip: {
            text: t('draw.tooltip.removeText'),
          },
        },
      },
    },
  };
}

function updateLanguageSwitcherState(locale) {
  if (!languageSwitcher) {
    return;
  }

  const activeLocale = String(locale || '').toLowerCase();
  const items = languageSwitcher.querySelectorAll('[data-locale]');
  items.forEach((item) => {
    const isActive = item.getAttribute('data-locale') === activeLocale;
    item.classList.toggle('is-active', isActive);
    item.setAttribute('aria-current', isActive ? 'true' : 'false');
  });
}

function bindLanguageSwitcher() {
  if (!languageSwitcher) {
    return;
  }

  languageSwitcher.addEventListener('click', function (event) {
    const target = event.target;
    if (!target || !target.getAttribute) {
      return;
    }

    const locale = target.getAttribute('data-locale');
    if (!locale || typeof window.setAppLocale !== 'function') {
      return;
    }

    window.setAppLocale(locale);
  });

  if (typeof window.getAppLocale === 'function') {
    updateLanguageSwitcherState(window.getAppLocale());
  }
}

function syncRightToolButtonTooltips() {
  const buttons = document.querySelectorAll('.button-container button');
  buttons.forEach(function (button) {
    const title = button.getAttribute('title');
    const tooltipText = String(title || '').trim();

    if (!tooltipText) {
      button.removeAttribute('data-tooltip');
      return;
    }

    button.setAttribute('data-tooltip', tooltipText);
    button.setAttribute('aria-label', tooltipText);

    // Remove native browser tooltip to avoid clipping at viewport edge.
    button.removeAttribute('title');
  });
}

function debugLog(message, details) {
  console.log('[Trifoglio Debug]', message, details || '');
}

function clearIIIFAttribution() {
  currentIIIFAttribution = null;
  updateAttributionPrefix();
}

function setIIIFAttribution(attributionHtml) {
  currentIIIFAttribution = attributionHtml || null;
  updateAttributionPrefix();
}

function setManifestStatus(_message, _variant) {
  // status bar removed
}

function updateCanvasNavigation() {
  const total = manifestCanvasKeys.length;
  const current = currentCanvasIndex >= 0 ? currentCanvasIndex + 1 : 0;

  if (canvasPosition) {
    canvasPosition.textContent = current + ' / ' + total;
  }
  if (pageCounterValue) {
    pageCounterValue.textContent = current + '/' + total;
  }
  canvasPrevButton.disabled = total <= 1 || currentCanvasIndex <= 0;
  canvasNextButton.disabled = total <= 1 || currentCanvasIndex >= total - 1;
}

function getCanvasStorageKey(canvasKey) {
  if (!currentManifestId || !canvasKey) {
    return null;
  }

  return currentManifestId + '::' + canvasKey;
}

function saveDrawingsState() {
  localStorage.setItem(DRAWINGS_STORAGE_KEY, JSON.stringify(drawingsByCanvas));
}

function getManifestUrlFromGeoJson(geoJson) {
  if (!geoJson || typeof geoJson !== 'object') {
    return null;
  }

  const topLevelCandidates = [
    geoJson.iiifManifestUrl,
    geoJson.manifestUrl,
    geoJson.manifest,
    geoJson.sourceManifest,
    geoJson.trifoglio && geoJson.trifoglio.iiifManifestUrl,
    geoJson.properties && geoJson.properties.iiifManifestUrl,
    geoJson.properties && geoJson.properties.manifestUrl,
  ];

  const topLevel = topLevelCandidates.find(function (value) {
    return typeof value === 'string' && value.trim() !== '';
  });

  if (topLevel) {
    return topLevel;
  }

  if (!Array.isArray(geoJson.features)) {
    return null;
  }

  for (const feature of geoJson.features) {
    const properties =
      feature && feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : null;
    if (!properties) {
      continue;
    }

    const candidate =
      properties.iiifManifestUrl ||
      properties.manifestUrl ||
      properties.manifest ||
      properties.sourceManifest;
    if (typeof candidate === 'string' && candidate.trim() !== '') {
      return candidate;
    }
  }

  return null;
}

function getCanvasKeyFromGeoJson(geoJson) {
  if (!geoJson || typeof geoJson !== 'object') {
    return null;
  }

  const topLevelCandidates = [
    geoJson.canvasKey,
    geoJson.trifoglio && geoJson.trifoglio.canvasKey,
    geoJson.properties && geoJson.properties.canvasKey,
  ];

  const topLevel = topLevelCandidates.find(function (value) {
    return typeof value === 'string' && value.trim() !== '';
  });

  if (topLevel) {
    return topLevel;
  }

  if (!Array.isArray(geoJson.features)) {
    return null;
  }

  for (const feature of geoJson.features) {
    const properties =
      feature && feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : null;
    if (!properties) {
      continue;
    }

    if (typeof properties.canvasKey === 'string' && properties.canvasKey) {
      return properties.canvasKey;
    }
  }

  return null;
}

function getSourceModeFromGeoJson(geoJson) {
  if (!geoJson || typeof geoJson !== 'object') {
    return null;
  }

  const topLevelCandidates = [
    geoJson.sourceMode,
    geoJson.trifoglio && geoJson.trifoglio.sourceMode,
    geoJson.properties && geoJson.properties.sourceMode,
  ];

  const topLevel = topLevelCandidates.find(function (value) {
    return typeof value === 'string' && value.trim() !== '';
  });

  if (topLevel) {
    return String(topLevel).toLowerCase();
  }

  if (!Array.isArray(geoJson.features)) {
    return null;
  }

  for (const feature of geoJson.features) {
    const properties =
      feature && feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : null;
    if (!properties) {
      continue;
    }

    if (typeof properties.sourceMode === 'string' && properties.sourceMode) {
      return String(properties.sourceMode).toLowerCase();
    }
  }

  return null;
}

function getOsmStyleFromGeoJson(geoJson) {
  if (!geoJson || typeof geoJson !== 'object') {
    return null;
  }

  const topLevelCandidates = [
    geoJson.osmStyle,
    geoJson.trifoglio && geoJson.trifoglio.osmStyle,
    geoJson.properties && geoJson.properties.osmStyle,
  ];

  const topLevel = topLevelCandidates.find(function (value) {
    return typeof value === 'string' && value.trim() !== '';
  });

  if (topLevel) {
    return topLevel;
  }

  if (!Array.isArray(geoJson.features)) {
    return null;
  }

  for (const feature of geoJson.features) {
    const properties =
      feature && feature.properties && typeof feature.properties === 'object'
        ? feature.properties
        : null;
    if (!properties) {
      continue;
    }

    if (typeof properties.osmStyle === 'string' && properties.osmStyle) {
      return properties.osmStyle;
    }
  }

  return null;
}

function injectImportedGeoJsonFeatures(geoJson, options = {}) {
  if (!geoJson || typeof geoJson !== 'object') {
    return;
  }

  const shouldClear = options.clearExisting !== false;
  if (shouldClear) {
    drawnLayers.clearLayers();
  }

  const normalizedManifestUrl = normalizeManifestUrl(
    getManifestUrlFromGeoJson(geoJson),
  );
  const canvasKey =
    getCanvasKeyFromGeoJson(geoJson) || currentCanvasKey || null;

  L.geoJSON(geoJson, {
    onEachFeature: function (feature, layer) {
      const existing =
        feature && feature.properties && typeof feature.properties === 'object'
          ? feature.properties
          : {};

      const mergedProperties = {
        ...existing,
      };

      if (normalizedManifestUrl && !mergedProperties.iiifManifestUrl) {
        mergedProperties.iiifManifestUrl = normalizedManifestUrl;
      }
      if (canvasKey && !mergedProperties.canvasKey) {
        mergedProperties.canvasKey = canvasKey;
      }

      if (Object.keys(mergedProperties).length > 0) {
        applyPropertiesToLayer(layer, mergedProperties);
      } else {
        initializeLayerAnnotation(layer);
      }

      attachAnnotationLayerBehavior(layer);
      drawnLayers.addLayer(layer);
    },
  });

  if (normalizedManifestUrl && canvasKey) {
    const storageKey = normalizedManifestUrl + '::' + canvasKey;
    drawingsByCanvas[storageKey] = drawnLayers.toGeoJSON();
    saveDrawingsState();
  } else {
    saveToLocalStorage();
  }

  updateAnnotationTourCounterDisplay();
}

function saveCurrentCanvasDrawings() {
  const storageKey = getCanvasStorageKey(currentCanvasKey);
  if (!storageKey) {
    return;
  }

  drawingsByCanvas[storageKey] = drawnLayers.toGeoJSON();
  saveDrawingsState();
}

function loadDrawingsForCanvas(canvasKey) {
  drawnLayers.clearLayers();

  const storageKey = getCanvasStorageKey(canvasKey);
  if (!storageKey) {
    return;
  }

  const saved = drawingsByCanvas[storageKey];
  if (saved) {
    // Add each feature directly so Leaflet.draw edit/delete can target them.
    L.geoJSON(saved, {
      onEachFeature: function (feature, layer) {
        if (feature && feature.properties) {
          applyPropertiesToLayer(layer, feature.properties);
        } else {
          initializeLayerAnnotation(layer);
        }
        attachAnnotationLayerBehavior(layer);
        drawnLayers.addLayer(layer);
      },
    });
  }

  updateAnnotationTourCounterDisplay();
}

function showCanvasByIndex(index) {
  if (index < 0 || index >= manifestCanvasKeys.length) {
    return;
  }

  if (currentCanvasIndex >= 0 && manifestCanvasKeys[currentCanvasIndex]) {
    saveCurrentCanvasDrawings();

    const previousLayer = iiifLayers[manifestCanvasKeys[currentCanvasIndex]];
    if (previousLayer && map.hasLayer(previousLayer)) {
      map.removeLayer(previousLayer);
    }
  }

  const layerKey = manifestCanvasKeys[index];
  const layer = iiifLayers[layerKey];
  const layerLabel = manifestCanvasLabels[layerKey] || layerKey;
  if (!layer) {
    setManifestStatus(t('notifications.canvasNotFound'), 'error');
    return;
  }

  layer.addTo(map);
  currentCanvasKey = layerKey;
  loadDrawingsForCanvas(layerKey);
  currentCanvasIndex = index;
  updateCanvasNavigation();
  setManifestStatus(
    t('notifications.canvasLoaded', { index: index + 1, label: layerLabel }),
    'success',
  );
}

const JSON_PROXY_BASE_URL = 'https://api.allorigins.win/raw?url=';

function buildProxyUrl(url) {
  return JSON_PROXY_BASE_URL + encodeURIComponent(url);
}

function fetchJsonWithProxyFallback(url) {
  function fetchJson(targetUrl) {
    return fetch(targetUrl, { cache: 'no-cache' }).then(function (response) {
      if (!response.ok) {
        const error = new Error('HTTP ' + response.status);
        error.status = response.status;
        throw error;
      }

      return response.json();
    });
  }

  return fetchJson(url)
    .then(function (data) {
      return { data: data, usedProxy: false };
    })
    .catch(function () {
      const proxyUrl = buildProxyUrl(url);
      debugLog('Direct JSON blocked, retry proxy', url);

      return fetchJson(proxyUrl).then(function (data) {
        return { data: data, usedProxy: true };
      });
    });
}

function switchMapCrs(nextCrs, center, zoom) {
  if (!nextCrs) {
    return;
  }

  const targetCenter = center || map.getCenter();
  const targetZoom = typeof zoom === 'number' ? zoom : map.getZoom();

  // Stop any in-flight movement/zoom before changing CRS to avoid stale zoom state.
  if (typeof map.stop === 'function') {
    map.stop();
  }

  map.setMaxBounds(null);

  if (map.options.crs !== nextCrs) {
    map.options.crs = nextCrs;
    map.invalidateSize({ pan: false, animate: false });

    map.eachLayer(function (layer) {
      if (layer && typeof layer.redraw === 'function') {
        layer.redraw();
      }
    });
  }

  map.setView(targetCenter, targetZoom, { animate: false, reset: true });
}
////////////////
//LEAFLET DRAW//
////////////////

let drawnLayers;

if (!drawnLayers) {
  drawnLayers = new L.FeatureGroup();
}

const annotationEditorState = {
  overlay: null,
  form: null,
  customFields: null,
  currentLayer: null,
};

function getTotalAnnotationCount() {
  if (!drawnLayers || typeof drawnLayers.getLayers !== 'function') {
    return 1;
  }

  return Math.max(1, drawnLayers.getLayers().length);
}

function getLayerOrderPosition(layer) {
  if (!drawnLayers || typeof drawnLayers.getLayers !== 'function') {
    return 1;
  }

  const layers = drawnLayers.getLayers();
  const index = layers.indexOf(layer);
  return index >= 0 ? index + 1 : 1;
}

function populateOrderSelect(selectElement, selectedOrder, totalCount) {
  if (!selectElement) {
    return;
  }

  const total = Math.max(1, Number.parseInt(totalCount, 10) || 1);
  const normalizedSelected = Number.parseInt(selectedOrder, 10);
  const safeSelected =
    Number.isInteger(normalizedSelected) &&
    normalizedSelected >= 1 &&
    normalizedSelected <= total
      ? normalizedSelected
      : 1;

  selectElement.innerHTML = '';

  for (let index = 1; index <= total; index += 1) {
    const option = document.createElement('option');
    option.value = String(index);
    option.textContent = String(index);
    if (index === safeSelected) {
      option.selected = true;
    }
    selectElement.appendChild(option);
  }
}

function escapeAnnotationHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function getMediaTypeFromUrl(value) {
  const candidate = String(value || '').trim();
  if (!candidate) {
    return null;
  }

  let pathname = candidate;
  try {
    pathname = new URL(candidate).pathname || candidate;
  } catch (_) {
    pathname = candidate.split('?')[0].split('#')[0];
  }

  const normalizedPath = pathname.toLowerCase();
  if (/\.(mp4|webm|ogv|mov|m4v)$/i.test(normalizedPath)) {
    return 'video';
  }
  if (/\.(mp3|wav|ogg|m4a|aac|flac)$/i.test(normalizedPath)) {
    return 'audio';
  }
  if (/\.(png|jpe?g|gif|webp|svg|avif)$/i.test(normalizedPath)) {
    return 'image';
  }

  return null;
}

function enhancePopupMediaControls(popup) {
  if (!popup || typeof popup.getElement !== 'function') {
    return;
  }

  const popupElement = popup.getElement();
  if (!popupElement || popupElement.__trfAudioControlsBound) {
    return;
  }

  popupElement.__trfAudioControlsBound = true;

  function syncAudioPlaybackUi(audioButton, isPlaying) {
    if (!audioButton) {
      return;
    }

    const icon = audioButton.querySelector('i');
    audioButton.classList.toggle('is-playing', Boolean(isPlaying));
    audioButton.setAttribute('aria-pressed', isPlaying ? 'true' : 'false');
    audioButton.setAttribute(
      'aria-label',
      isPlaying ? 'Pause audio' : 'Lire audio',
    );
    if (icon) {
      icon.className = isPlaying ? 'fa-solid fa-pause' : 'fa-solid fa-play';
    }
  }

  function syncAudioVolumeUi(audioWrapper, audioElement) {
    if (!audioWrapper || !audioElement) {
      return;
    }

    const volumeButton = audioWrapper.querySelector('.trf-popup__audio-volume');
    const volumeIcon = volumeButton ? volumeButton.querySelector('i') : null;
    const volumeInput = audioWrapper.querySelector(
      '.trf-popup__audio-volume-range',
    );
    const currentVolume = audioElement.muted ? 0 : audioElement.volume;

    if (volumeInput) {
      volumeInput.value = String(Math.round(currentVolume * 100));
    }

    if (!volumeButton || !volumeIcon) {
      return;
    }

    volumeButton.classList.toggle('is-muted', currentVolume === 0);
    volumeButton.setAttribute(
      'aria-pressed',
      currentVolume === 0 ? 'true' : 'false',
    );
    volumeIcon.className =
      currentVolume === 0
        ? 'fa-solid fa-volume-xmark'
        : currentVolume < 0.5
          ? 'fa-solid fa-volume-low'
          : 'fa-solid fa-volume-high';
  }

  popupElement.addEventListener('click', function (event) {
    const audioButton = event.target.closest('.trf-popup__audio-button');
    const volumeButton = event.target.closest('.trf-popup__audio-volume');
    if (!audioButton && !volumeButton) {
      return;
    }

    event.preventDefault();

    const controlButton = audioButton || volumeButton;
    const audioWrapper = controlButton.closest('.trf-popup__audio');
    const audioElement = audioWrapper
      ? audioWrapper.querySelector('.trf-popup__audio-element')
      : null;
    if (!audioElement) {
      return;
    }

    if (volumeButton) {
      audioElement.muted = !audioElement.muted;
      if (!audioElement.muted && audioElement.volume === 0) {
        audioElement.volume = 0.7;
      }
      syncAudioVolumeUi(audioWrapper, audioElement);
      return;
    }

    const shouldPlay = audioElement.paused;
    document
      .querySelectorAll('.trf-popup__audio-element')
      .forEach(function (media) {
        if (media !== audioElement) {
          media.pause();
          media.currentTime = 0;
          const mediaWrapper = media.closest('.trf-popup__audio');
          const mediaButton = mediaWrapper
            ? mediaWrapper.querySelector('.trf-popup__audio-button')
            : null;
          syncAudioPlaybackUi(mediaButton, false);
          syncAudioVolumeUi(mediaWrapper, media);
        }
      });

    if (!shouldPlay) {
      audioElement.pause();
      audioElement.currentTime = 0;
      syncAudioPlaybackUi(audioButton, false);
      return;
    }

    audioElement.play().then(
      function () {
        syncAudioPlaybackUi(audioButton, true);
      },
      function () {
        syncAudioPlaybackUi(audioButton, false);
      },
    );
  });

  popupElement.addEventListener('input', function (event) {
    const volumeInput = event.target.closest('.trf-popup__audio-volume-range');
    if (!volumeInput) {
      return;
    }

    const audioWrapper = volumeInput.closest('.trf-popup__audio');
    const audioElement = audioWrapper
      ? audioWrapper.querySelector('.trf-popup__audio-element')
      : null;
    if (!audioElement) {
      return;
    }

    const nextVolume = Number(volumeInput.value) / 100;
    audioElement.volume = Math.max(0, Math.min(1, nextVolume));
    audioElement.muted = audioElement.volume === 0;
    syncAudioVolumeUi(audioWrapper, audioElement);
  });

  popupElement
    .querySelectorAll('.trf-popup__audio-element')
    .forEach(function (audioElement) {
      const audioWrapper = audioElement.closest('.trf-popup__audio');
      const playButton = audioWrapper
        ? audioWrapper.querySelector('.trf-popup__audio-button')
        : null;
      syncAudioPlaybackUi(playButton, false);
      if (audioWrapper) {
        syncAudioVolumeUi(audioWrapper, audioElement);
      }

      audioElement.addEventListener('ended', function () {
        const audioWrapper = audioElement.closest('.trf-popup__audio');
        const audioButton = audioWrapper
          ? audioWrapper.querySelector('.trf-popup__audio-button')
          : null;
        syncAudioPlaybackUi(audioButton, false);
        audioElement.currentTime = 0;
      });
    });
}

function normalizeLayerProperties(layer) {
  const feature = layer && layer.feature ? layer.feature : null;
  const properties =
    feature && feature.properties && typeof feature.properties === 'object'
      ? feature.properties
      : {};

  const annotation =
    properties.annotation && typeof properties.annotation === 'object'
      ? properties.annotation
      : {};

  const title = annotation.title || properties.title || '';
  const description = annotation.text || properties.description || '';
  const author = annotation.creator || properties.author || '';
  const date = annotation.created || properties.date || '';
  const tags = Array.isArray(annotation.tags)
    ? annotation.tags
    : typeof properties.keywords === 'string'
      ? properties.keywords
          .split(',')
          .map((entry) => entry.trim())
          .filter(Boolean)
      : [];

  const customFields = [];
  if (annotation.customFields && Array.isArray(annotation.customFields)) {
    annotation.customFields.forEach(function (field) {
      if (!field || typeof field !== 'object') {
        return;
      }
      const key = String(field.key || '').trim();
      const value = String(field.value || '').trim();
      if (!key || !value) {
        return;
      }
      customFields.push({ key: key, value: value });
    });
  } else if (properties.metadata && typeof properties.metadata === 'object') {
    Object.keys(properties.metadata).forEach(function (key) {
      const normalizedKey = String(key).trim();
      const normalizedValue = String(properties.metadata[key] || '').trim();
      if (!normalizedKey || !normalizedValue) {
        return;
      }
      customFields.push({ key: normalizedKey, value: normalizedValue });
    });
  }

  const fillOpacity = Number.parseFloat(properties.fillOpacity);
  const propertyOrder = Number.parseInt(
    annotation.order || properties.order,
    10,
  );
  const fallbackOrder = getLayerOrderPosition(layer);
  const resolvedOrder =
    Number.isInteger(propertyOrder) && propertyOrder >= 1
      ? propertyOrder
      : fallbackOrder;

  return {
    title: title,
    description: description,
    author: author,
    date: date,
    keywords: tags.join(', '),
    url: annotation.url || properties.url || '',
    image: annotation.image || properties.image || '',
    audio: annotation.audio || properties.audio || '',
    video: annotation.video || properties.video || '',
    lineColor: properties.color || properties.strokeColor || '#d32f2f',
    markerColor: properties.markerColor || properties.color || '#d32f2f',
    fillColor: properties.fillColor || properties.color || '#d32f2f',
    fillOpacity:
      Number.isFinite(fillOpacity) && fillOpacity >= 0 && fillOpacity <= 1
        ? String(fillOpacity)
        : '0.35',
    order: String(resolvedOrder),
    customFields: customFields,
  };
}

function buildAnnotationProperties(values) {
  const tags = String(values.keywords || '')
    .split(',')
    .map((entry) => entry.trim())
    .filter(Boolean);

  const metadata = {};
  const customFields = [];
  (values.customFields || []).forEach(function (field) {
    const key = String(field.key || '').trim();
    const value = String(field.value || '').trim();
    if (!key || !value) {
      return;
    }
    metadata[key] = value;
    customFields.push({ key: key, value: value });
  });

  const fillOpacity = Number.parseFloat(values.fillOpacity);
  const normalizedFillOpacity =
    Number.isFinite(fillOpacity) && fillOpacity >= 0 && fillOpacity <= 1
      ? fillOpacity
      : 0.35;
  const parsedOrder = Number.parseInt(values.order, 10);
  const normalizedOrder =
    Number.isInteger(parsedOrder) && parsedOrder >= 1 ? parsedOrder : 1;

  return {
    title: values.title || '',
    description: values.description || '',
    author: values.author || '',
    date: values.date || '',
    keywords: tags.join(', '),
    url: values.url || '',
    image: values.image || '',
    audio: values.audio || '',
    video: values.video || '',
    color: values.lineColor || '#d32f2f',
    markerColor: values.markerColor || values.lineColor || '#d32f2f',
    strokeColor: values.lineColor || '#d32f2f',
    fillColor: values.fillColor || values.lineColor || '#d32f2f',
    fillOpacity: normalizedFillOpacity,
    order: normalizedOrder,
    popup: true,
    metadata: metadata,
    annotation: {
      title: values.title || '',
      text: values.description || '',
      image: values.image || null,
      audio: values.audio || null,
      video: values.video || null,
      url: values.url || null,
      tags: tags,
      creator: values.author || '',
      created: values.date || '',
      order: normalizedOrder,
      customFields: customFields,
    },
  };
}

function createMarkerIcon(color) {
  const safeColor = color || '#d32f2f';
  return L.divIcon({
    className: 'trf-marker-icon',
    html:
      '<span class="trf-marker-icon__dot" style="background:' +
      escapeAnnotationHtml(safeColor) +
      '"></span>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -10],
  });
}

function getAnnotationOrderNumber(layer, fallbackOrder) {
  if (!layer || !layer.feature || !layer.feature.properties) {
    return fallbackOrder;
  }

  const properties = layer.feature.properties;
  const annotation =
    properties.annotation && typeof properties.annotation === 'object'
      ? properties.annotation
      : {};
  const rawOrder = annotation.order || properties.order;
  const parsed = Number.parseInt(rawOrder, 10);
  return Number.isInteger(parsed) && parsed >= 1 ? parsed : fallbackOrder;
}

function getOrderedAnnotationLayers() {
  if (!drawnLayers || typeof drawnLayers.getLayers !== 'function') {
    return [];
  }

  return drawnLayers
    .getLayers()
    .map(function (layer, index) {
      return {
        layer: layer,
        fallbackIndex: index + 1,
        order: getAnnotationOrderNumber(layer, index + 1),
      };
    })
    .sort(function (a, b) {
      if (a.order !== b.order) {
        return a.order - b.order;
      }
      return a.fallbackIndex - b.fallbackIndex;
    })
    .map(function (entry) {
      return entry.layer;
    });
}

function updateAnnotationTourCounterDisplay() {
  const counterElement = document.getElementById('annotation-tour-counter');
  if (!counterElement) {
    return;
  }

  const total = getOrderedAnnotationLayers().length;
  if (total === 0) {
    annotationTourCursor = -1;
    counterElement.textContent = '0/0';
    return;
  }

  if (annotationTourCursor >= total) {
    annotationTourCursor = -1;
  }

  if (annotationTourCursor < 0) {
    counterElement.textContent = '0/' + String(total);
    return;
  }

  counterElement.textContent =
    String(annotationTourCursor + 1) + '/' + String(total);
}

function flashAnnotationLayer(layer) {
  if (!layer) {
    return;
  }

  if (layer._path) {
    layer._path.classList.remove('trf-annotation-flash-path');
    // Force reflow to replay animation.
    void layer._path.offsetWidth;
    layer._path.classList.add('trf-annotation-flash-path');

    if (layer.__trfFlashTimeoutId) {
      clearTimeout(layer.__trfFlashTimeoutId);
    }
    layer.__trfFlashTimeoutId = setTimeout(function () {
      if (layer._path) {
        layer._path.classList.remove('trf-annotation-flash-path');
      }
    }, 950);
  }

  if (layer._icon) {
    layer._icon.classList.remove('trf-annotation-flash-marker');
    void layer._icon.offsetWidth;
    layer._icon.classList.add('trf-annotation-flash-marker');

    if (layer.__trfMarkerFlashTimeoutId) {
      clearTimeout(layer.__trfMarkerFlashTimeoutId);
    }
    layer.__trfMarkerFlashTimeoutId = setTimeout(function () {
      if (layer._icon) {
        layer._icon.classList.remove('trf-annotation-flash-marker');
      }
    }, 950);
  }
}

function focusAnnotationLayer(layer) {
  if (!layer) {
    return;
  }

  const isSimpleCrs = map.options.crs === MAP_CRS_SIMPLE;
  const maxZoom = isSimpleCrs ? 3 : 16;

  if (typeof layer.getBounds === 'function') {
    const bounds = layer.getBounds();
    if (bounds && typeof bounds.isValid === 'function' && bounds.isValid()) {
      map.flyToBounds(bounds.pad(0.35), {
        maxZoom: maxZoom,
        animate: true,
        duration: 0.8,
      });
    }
  } else if (typeof layer.getLatLng === 'function') {
    const latLng = layer.getLatLng();
    const targetZoom = Math.min(maxZoom, map.getZoom() + 1);
    map.flyTo(latLng, targetZoom, {
      animate: true,
      duration: 0.8,
    });
  }

  if (typeof layer.openPopup === 'function') {
    layer.openPopup();
  }

  flashAnnotationLayer(layer);
}

function focusNextOrderedAnnotation() {
  const orderedLayers = getOrderedAnnotationLayers();
  if (orderedLayers.length === 0) {
    updateAnnotationTourCounterDisplay();
    showAppAlert(t('errors.drawSomethingFirst'));
    return;
  }

  annotationTourCursor = (annotationTourCursor + 1) % orderedLayers.length;
  updateAnnotationTourCounterDisplay();
  focusAnnotationLayer(orderedLayers[annotationTourCursor]);
}

function applyLayerStyleFromProperties(layer, properties) {
  const color = properties.color || properties.strokeColor || '#d32f2f';
  const fillColor = properties.fillColor || color;
  const fillOpacity = Number.isFinite(Number.parseFloat(properties.fillOpacity))
    ? Number.parseFloat(properties.fillOpacity)
    : 0.35;

  if (typeof layer.setStyle === 'function') {
    layer.setStyle({
      color: color,
      fillColor: fillColor,
      fillOpacity: fillOpacity,
      weight: 3,
      opacity: 0.95,
    });
  }

  if (layer instanceof L.Marker) {
    const markerColor = properties.markerColor || color;
    layer.setIcon(createMarkerIcon(markerColor));

    if (typeof layer.getElement === 'function') {
      const iconElement = layer.getElement();
      if (iconElement) {
        iconElement.style.setProperty('--marker-color', markerColor);
      }
    }
  }
}

function getAnnotationPopupOptions(layer) {
  const baseOptions = {
    maxWidth: 360,
    minWidth: 220,
    autoPan: true,
    keepInView: true,
    autoPanPaddingTopLeft: [20, 20],
    autoPanPaddingBottomRight: [20, 20],
    offset: [0, -18],
  };

  if (layer instanceof L.Marker) {
    return {
      ...baseOptions,
      offset: [0, -24],
    };
  }

  if (layer instanceof L.Circle || layer instanceof L.CircleMarker) {
    return {
      ...baseOptions,
      offset: [0, -16],
    };
  }

  return baseOptions;
}

function buildAnnotationPopupHtml(properties) {
  const annotation =
    properties.annotation && typeof properties.annotation === 'object'
      ? properties.annotation
      : {};
  const title = String(annotation.title || properties.title || '').trim();
  const text = String(
    annotation.text || properties.description || properties.text || '',
  ).trim();
  const creator = String(annotation.creator || properties.author || '').trim();
  const created = String(annotation.created || properties.date || '').trim();
  const url = String(annotation.url || properties.url || '').trim();
  const image = String(annotation.image || properties.image || '').trim();
  const audio = String(annotation.audio || properties.audio || '').trim();
  const video = String(annotation.video || properties.video || '').trim();
  const inferredUrlMediaType = getMediaTypeFromUrl(url);
  const effectiveImage = image || (inferredUrlMediaType === 'image' ? url : '');
  const effectiveAudio = audio || (inferredUrlMediaType === 'audio' ? url : '');
  const effectiveVideo = video || (inferredUrlMediaType === 'video' ? url : '');
  const shouldRenderUrlLink = Boolean(
    url &&
    inferredUrlMediaType === null &&
    url !== image &&
    url !== audio &&
    url !== video,
  );
  const tags = Array.isArray(annotation.tags)
    ? annotation.tags.filter(Boolean)
    : String(properties.keywords || '')
        .split(',')
        .map((entry) => entry.trim())
        .filter(Boolean);

  const rows = [];

  if (title) {
    rows.push(
      '<h3 class="trf-popup__title">' + escapeAnnotationHtml(title) + '</h3>',
    );
  }

  if (text) {
    rows.push(
      '<p class="trf-popup__description">' +
        escapeAnnotationHtml(text) +
        '</p>',
    );
  }

  if (effectiveImage) {
    rows.push(
      '<img class="trf-popup__image" src="' +
        escapeAnnotationHtml(effectiveImage) +
        '" alt="' +
        escapeAnnotationHtml(title || 'annotation image') +
        '">',
    );
  }

  if (creator || created) {
    rows.push(
      '<p class="trf-popup__meta"><strong>' +
        escapeAnnotationHtml(t('annotationEditor.fieldAuthor')) +
        ':</strong> ' +
        escapeAnnotationHtml(creator || '-') +
        ' | <strong>' +
        escapeAnnotationHtml(t('annotationEditor.fieldDate')) +
        ':</strong> ' +
        escapeAnnotationHtml(created || '-') +
        '</p>',
    );
  }

  if (tags.length > 0) {
    rows.push(
      '<p class="trf-popup__meta"><strong>' +
        escapeAnnotationHtml(t('annotationEditor.fieldKeywords')) +
        ':</strong> ' +
        escapeAnnotationHtml(tags.join(', ')) +
        '</p>',
    );
  }

  if (shouldRenderUrlLink) {
    rows.push(
      '<p class="trf-popup__meta"><a href="' +
        escapeAnnotationHtml(url) +
        '" target="_blank" rel="noopener noreferrer">' +
        escapeAnnotationHtml(url) +
        '</a></p>',
    );
  }

  if (effectiveAudio) {
    rows.push(
      '<div class="trf-popup__audio">' +
        '<button type="button" class="trf-popup__audio-button" aria-label="Lire audio" aria-pressed="false">' +
        '<i class="fa-solid fa-play" aria-hidden="true"></i>' +
        '</button>' +
        '<button type="button" class="trf-popup__audio-volume" aria-label="Volume" aria-pressed="false">' +
        '<i class="fa-solid fa-volume-high" aria-hidden="true"></i>' +
        '</button>' +
        '<input class="trf-popup__audio-volume-range" type="range" min="0" max="100" value="100" aria-label="Volume">' +
        '<audio class="trf-popup__audio-element" preload="metadata" src="' +
        escapeAnnotationHtml(effectiveAudio) +
        '"></audio>' +
        '</div>',
    );
  }

  if (effectiveVideo) {
    rows.push(
      '<video class="trf-popup__media" controls playsinline preload="metadata" src="' +
        escapeAnnotationHtml(effectiveVideo) +
        '"></video>',
    );
  }

  const customEntries =
    annotation.customFields && Array.isArray(annotation.customFields)
      ? annotation.customFields
      : [];
  if (customEntries.length > 0) {
    const items = customEntries
      .map(function (field) {
        if (!field || typeof field !== 'object') {
          return '';
        }
        const key = String(field.key || '').trim();
        const value = String(field.value || '').trim();
        if (!key || !value) {
          return '';
        }
        return (
          '<li><strong>' +
          escapeAnnotationHtml(key) +
          ':</strong> ' +
          escapeAnnotationHtml(value) +
          '</li>'
        );
      })
      .filter(Boolean)
      .join('');
    if (items) {
      rows.push('<ul class="trf-popup__metadata">' + items + '</ul>');
    }
  }

  if (rows.length === 0) {
    return '';
  }

  rows.push(
    '<p class="trf-popup__hint">' +
      escapeAnnotationHtml(t('annotationEditor.editHint')) +
      '</p>',
  );
  return '<div class="trf-popup">' + rows.join('') + '</div>';
}

function applyPropertiesToLayer(layer, properties) {
  layer.feature = layer.feature || {
    type: 'Feature',
    properties: {},
  };
  layer.feature.properties = properties;

  applyLayerStyleFromProperties(layer, properties);

  const popupHtml = buildAnnotationPopupHtml(properties);
  if (popupHtml) {
    layer.bindPopup(popupHtml, getAnnotationPopupOptions(layer));
  } else {
    layer.unbindPopup();
  }
}

function refreshAllAnnotationPopups() {
  if (!drawnLayers || typeof drawnLayers.eachLayer !== 'function') {
    return;
  }

  drawnLayers.eachLayer(function (layer) {
    if (!layer || !layer.feature || !layer.feature.properties) {
      return;
    }
    applyPropertiesToLayer(layer, layer.feature.properties);
  });
}

function addCustomFieldRow(key, value) {
  if (!annotationEditorState.customFields) {
    return;
  }

  const row = document.createElement('div');
  row.className = 'annotation-editor__custom-row';

  const keyInput = document.createElement('input');
  keyInput.type = 'text';
  keyInput.className = 'annotation-editor__field-key';
  keyInput.placeholder = t('annotationEditor.customFieldKey');
  keyInput.value = key || '';

  const valueInput = document.createElement('input');
  valueInput.type = 'text';
  valueInput.className = 'annotation-editor__field-value';
  valueInput.placeholder = t('annotationEditor.customFieldValue');
  valueInput.value = value || '';

  const deleteButton = document.createElement('button');
  deleteButton.type = 'button';
  deleteButton.className = 'annotation-editor__field-delete';
  deleteButton.textContent = 'x';
  deleteButton.addEventListener('click', function () {
    row.remove();
  });

  row.appendChild(keyInput);
  row.appendChild(valueInput);
  row.appendChild(deleteButton);
  annotationEditorState.customFields.appendChild(row);
}

function ensureAnnotationEditor(forceRefresh) {
  if (annotationEditorState.overlay && forceRefresh) {
    annotationEditorState.overlay.remove();
    annotationEditorState.overlay = null;
    annotationEditorState.form = null;
    annotationEditorState.customFields = null;
  }

  if (annotationEditorState.overlay) {
    return;
  }

  const overlay = document.createElement('div');
  overlay.className = 'annotation-editor-overlay is-hidden';
  overlay.innerHTML =
    '<div class="annotation-editor">' +
    '<h3 class="annotation-editor__title">' +
    t('annotationEditor.title') +
    '</h3>' +
    '<form class="annotation-editor__form">' +
    '<label>' +
    t('annotationEditor.fieldTitle') +
    '<input name="title" type="text"></label>' +
    '<label>' +
    t('annotationEditor.fieldDescription') +
    '<textarea name="description" rows="3"></textarea></label>' +
    '<label>' +
    t('annotationEditor.fieldDate') +
    '<input name="date" type="text"></label>' +
    '<label>' +
    t('annotationEditor.fieldAuthor') +
    '<input name="author" type="text"></label>' +
    '<label>' +
    t('annotationEditor.fieldKeywords') +
    '<input name="keywords" type="text"></label>' +
    '<label>' +
    t('annotationEditor.fieldOrder') +
    '<select name="order"></select></label>' +
    '<label>' +
    t('annotationEditor.fieldUrl') +
    '<input name="url" type="url"></label>' +
    '<label>' +
    t('annotationEditor.fieldImage') +
    '<input name="image" type="url"></label>' +
    '<label>' +
    t('annotationEditor.fieldAudio') +
    '<input name="audio" type="url"></label>' +
    '<label>' +
    t('annotationEditor.fieldVideo') +
    '<input name="video" type="url"></label>' +
    '<div class="annotation-editor__style-grid">' +
    '<label>' +
    t('annotationEditor.lineColor') +
    '<input name="lineColor" type="color"></label>' +
    '<label>' +
    t('annotationEditor.fillColor') +
    '<input name="fillColor" type="color"></label>' +
    '<label>' +
    t('annotationEditor.fillOpacity') +
    '<input name="fillOpacity" type="number" step="0.05" min="0" max="1"></label>' +
    '</div>' +
    '<div class="annotation-editor__custom">' +
    '<div class="annotation-editor__custom-header">' +
    '<span>' +
    t('annotationEditor.customFields') +
    '</span>' +
    '<button type="button" class="annotation-editor__add-field">' +
    t('annotationEditor.addField') +
    '</button>' +
    '</div>' +
    '<div class="annotation-editor__custom-fields"></div>' +
    '</div>' +
    '<div class="annotation-editor__actions">' +
    '<button type="button" class="annotation-editor__cancel">' +
    t('annotationEditor.cancel') +
    '</button>' +
    '<button type="submit" class="annotation-editor__save">' +
    t('annotationEditor.save') +
    '</button>' +
    '</div>' +
    '</form>' +
    '</div>';

  document.body.appendChild(overlay);

  annotationEditorState.overlay = overlay;
  annotationEditorState.form = overlay.querySelector(
    '.annotation-editor__form',
  );
  annotationEditorState.customFields = overlay.querySelector(
    '.annotation-editor__custom-fields',
  );

  overlay
    .querySelector('.annotation-editor__add-field')
    .addEventListener('click', function () {
      addCustomFieldRow('', '');
    });

  overlay
    .querySelector('.annotation-editor__cancel')
    .addEventListener('click', function () {
      overlay.classList.add('is-hidden');
      annotationEditorState.currentLayer = null;
    });

  overlay.addEventListener('click', function (event) {
    if (event.target === overlay) {
      overlay.classList.add('is-hidden');
      annotationEditorState.currentLayer = null;
    }
  });

  annotationEditorState.form.addEventListener('submit', function (event) {
    event.preventDefault();
    const layer = annotationEditorState.currentLayer;
    if (!layer) {
      return;
    }

    const formData = new FormData(annotationEditorState.form);
    const customFields = [];
    annotationEditorState.customFields
      .querySelectorAll('.annotation-editor__custom-row')
      .forEach(function (row) {
        const keyInput = row.querySelector('.annotation-editor__field-key');
        const valueInput = row.querySelector('.annotation-editor__field-value');
        const key = keyInput ? keyInput.value : '';
        const value = valueInput ? valueInput.value : '';
        if (String(key).trim() && String(value).trim()) {
          customFields.push({ key: key, value: value });
        }
      });

    const values = {
      title: formData.get('title') || '',
      description: formData.get('description') || '',
      date: formData.get('date') || '',
      author: formData.get('author') || '',
      keywords: formData.get('keywords') || '',
      order: formData.get('order') || '1',
      url: formData.get('url') || '',
      image: formData.get('image') || '',
      audio: formData.get('audio') || '',
      video: formData.get('video') || '',
      lineColor: formData.get('lineColor') || '#d32f2f',
      markerColor: formData.get('markerColor') || '#d32f2f',
      fillColor: formData.get('fillColor') || '#d32f2f',
      fillOpacity: formData.get('fillOpacity') || '0.35',
      customFields: customFields,
    };

    applyPropertiesToLayer(layer, buildAnnotationProperties(values));
    saveToLocalStorage();

    overlay.classList.add('is-hidden');
    annotationEditorState.currentLayer = null;
  });
}

function openAnnotationEditor(layer) {
  ensureAnnotationEditor(true);

  const normalized = normalizeLayerProperties(layer);
  const form = annotationEditorState.form;
  form.elements.title.value = normalized.title;
  form.elements.description.value = normalized.description;
  form.elements.date.value = normalized.date;
  form.elements.author.value = normalized.author;
  form.elements.keywords.value = normalized.keywords;
  populateOrderSelect(
    form.elements.order,
    normalized.order || String(getLayerOrderPosition(layer)),
    getTotalAnnotationCount(),
  );
  form.elements.url.value = normalized.url;
  form.elements.image.value = normalized.image;
  form.elements.audio.value = normalized.audio;
  form.elements.video.value = normalized.video;
  form.elements.lineColor.value = normalized.lineColor;
  if (form.elements.markerColor) {
    form.elements.markerColor.value = normalized.markerColor || '#d32f2f';
  }
  form.elements.fillColor.value = normalized.fillColor;
  form.elements.fillOpacity.value = normalized.fillOpacity;

  annotationEditorState.customFields.innerHTML = '';
  if (normalized.customFields.length === 0) {
    addCustomFieldRow('', '');
  } else {
    normalized.customFields.forEach(function (field) {
      addCustomFieldRow(field.key, field.value);
    });
  }

  annotationEditorState.currentLayer = layer;
  annotationEditorState.overlay.classList.remove('is-hidden');
}

function attachAnnotationLayerBehavior(layer) {
  if (!layer || layer.__trfAnnotationBound) {
    return;
  }

  layer.__trfAnnotationBound = true;
  layer.on('dblclick', function (event) {
    L.DomEvent.stop(event);
    openAnnotationEditor(layer);
  });
}

function initializeLayerAnnotation(layer) {
  const values = normalizeLayerProperties(layer);
  const properties = buildAnnotationProperties(values);
  applyPropertiesToLayer(layer, properties);
  attachAnnotationLayerBehavior(layer);
}

// Initialize the Leaflet.draw plugin and load saved layers
function drawSomething() {
  if (!L.Control || !L.Control.Draw) {
    debugLog('Leaflet.draw unavailable', 'Draw toolbar skipped');
    return;
  }

  if (!drawnLayers) {
    drawnLayers = new L.FeatureGroup();
  }
  if (!map.hasLayer(drawnLayers)) {
    map.addLayer(drawnLayers);
  }

  if (drawControl) {
    map.removeControl(drawControl);
  }

  drawControl = new L.Control.Draw({
    draw: {
      polygon: true,
      polyline: true,
      rectangle: true,
      circle: true,
      circlemarker: true,
      marker: false,
    },
    edit: {
      featureGroup: drawnLayers,
      edit: true,
      remove: true,
    },
  });
  drawControl.addTo(map);

  if (drawEventsBound) {
    return;
  }
  drawEventsBound = true;

  map.on('draw:created', (e) => {
    const layer = e.layer;
    drawnLayers.addLayer(layer);
    initializeLayerAnnotation(layer);
    openAnnotationEditor(layer);
    saveToLocalStorage();
    updateAnnotationTourCounterDisplay();
  });

  map.on('draw:edited', (e) => {
    e.layers.eachLayer(function (layer) {
      initializeLayerAnnotation(layer);
      if (layer instanceof L.Marker && layer.getElement) {
        const iconElement = layer.getElement();
        if (iconElement) {
          const markerColor =
            (layer.feature &&
              layer.feature.properties &&
              layer.feature.properties.markerColor) ||
            '#d32f2f';
          iconElement.style.setProperty('--marker-color', markerColor);
        }
      }
    });
    saveToLocalStorage();
  });

  map.on('draw:deleted', () => {
    saveToLocalStorage();
    updateAnnotationTourCounterDisplay();
  });
}

function removeAllDrawnPolygons() {
  drawnLayers.clearLayers();
  updateAnnotationTourCounterDisplay();

  const storageKey = getCanvasStorageKey(currentCanvasKey);
  if (storageKey && drawingsByCanvas[storageKey]) {
    delete drawingsByCanvas[storageKey];
    saveDrawingsState();
  }

  // Clear the loaded GeoJSON layer, if any
  if (loadedGeoJSONLayer) {
    map.removeLayer(loadedGeoJSONLayer);
  }
}

function saveToLocalStorage() {
  saveCurrentCanvasDrawings();
}

// Function to load saved layers from local storage and recreate drawn layers
function loadFromLocalStorage() {
  const savedByCanvas = localStorage.getItem(DRAWINGS_STORAGE_KEY);
  if (savedByCanvas) {
    try {
      drawingsByCanvas = JSON.parse(savedByCanvas) || {};
    } catch (_) {
      drawingsByCanvas = {};
    }
    return;
  }

  // Compatibility path for older single-layer storage format.
  const legacySavedLayers = localStorage.getItem('drawnLayers');
  if (legacySavedLayers) {
    try {
      const layersData = JSON.parse(legacySavedLayers);
      const legacyKey = getCanvasStorageKey(currentCanvasKey);
      if (legacyKey) {
        drawingsByCanvas[legacyKey] = layersData;
        saveDrawingsState();
      }
    } catch (_) {
      // Ignore invalid legacy data.
    }

    localStorage.removeItem('drawnLayers');
  }
}

// Download drawn layers as a JSON file
async function downloadDrawnLayers() {
  const savedLayers = drawnLayers.toGeoJSON(); // Convert the drawnItems FeatureGroup to GeoJSON
  if (!savedLayers || savedLayers.features.length === 0) {
    showAppAlert(t('errors.drawSomethingFirst'));
    return;
  }

  const normalizedManifestUrl = normalizeManifestUrl(currentManifestId);
  const sourceMode = osmLayer && map.hasLayer(osmLayer) ? 'osm' : 'iiif';
  const osmStyle = sourceMode === 'osm' ? currentOsmStyle : null;
  const enrichedLayers = {
    ...savedLayers,
    trifoglio: {
      ...(savedLayers.trifoglio || {}),
      sourceMode: sourceMode,
      osmStyle: osmStyle,
      iiifManifestUrl: normalizedManifestUrl || null,
      canvasKey: currentCanvasKey || null,
      exportedAt: new Date().toISOString(),
    },
    sourceMode: sourceMode,
    osmStyle: osmStyle,
    iiifManifestUrl: normalizedManifestUrl || null,
    canvasKey: currentCanvasKey || null,
  };

  if (Array.isArray(enrichedLayers.features)) {
    enrichedLayers.features = enrichedLayers.features.map(function (feature) {
      const nextFeature = {
        ...feature,
        properties: {
          ...(feature && feature.properties ? feature.properties : {}),
        },
      };

      if (normalizedManifestUrl) {
        nextFeature.properties.iiifManifestUrl = normalizedManifestUrl;
      }
      if (currentCanvasKey) {
        nextFeature.properties.canvasKey = currentCanvasKey;
      }
      nextFeature.properties.sourceMode = sourceMode;
      if (osmStyle) {
        nextFeature.properties.osmStyle = osmStyle;
      }

      return nextFeature;
    });
  }

  const jsonData = JSON.stringify(enrichedLayers, null, 2);
  const blob = new Blob([jsonData], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const defaultFileName = t('files.drawingExport');
  const typedName = await showAppPrompt(
    t('dialogs.saveFileNamePrompt'),
    defaultFileName,
    t('buttons.save'),
    t('buttons.cancel'),
  );
  if (typedName === null || typedName === false) {
    return;
  }

  const trimmedName = String(typedName).trim();
  if (!trimmedName) {
    return;
  }

  const fileName = /\.(geo)?json$/i.test(trimmedName)
    ? trimmedName
    : trimmedName + '.geojson';
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;

  a.click();
}

// Define the drawndatas variable as a Leaflet FeatureGroup
const drawndatas = new L.FeatureGroup();

// Add the drawndatas to the map
drawndatas.addTo(map);

// Function to set the start view of the map
function setStartview() {
  if (osmLayer && map.hasLayer(osmLayer)) {
    map.setView(OSM_DEFAULT_CENTER, OSM_DEFAULT_ZOOM);
    return;
  }

  map.setView([-50, 50], 1);
}

// Event listener for the IIIF layer's 'load' event
// This will be triggered when the IIIF layer is fully loaded
map.on('load', () => {
  setStartview(); // Set the start view of the map
});

applyLeafletDrawTranslations();

window.addEventListener('i18n:ready', function () {
  applyLeafletDrawTranslations();
  drawSomething();
  if (typeof window.getAppLocale === 'function') {
    updateLanguageSwitcherState(window.getAppLocale());
  }
  syncRightToolButtonTooltips();
  refreshAllAnnotationPopups();
  if (manifestStatus && manifestStatus.textContent === 'notifications.ready') {
    setManifestStatus(t('notifications.ready'));
  }
});

bindLanguageSwitcher();
if (typeof window.applyI18nToDom === 'function') {
  // Re-apply translations after shell element injection to avoid startup race.
  window.applyI18nToDom();
}
syncRightToolButtonTooltips();

try {
  drawSomething(); // Initialize the Leaflet.draw plugin
} catch (error) {
  console.error('Leaflet.draw initialization failed:', error);
}

// Load saved layers from local storage
try {
  loadFromLocalStorage();
} catch (error) {
  console.error('Loading saved drawings failed:', error);
}

////////////////
//LEAFLET iiif//
////////////////

// Call the function to load the IIIF manifest with the user-specified URL

function loadIIIFManifest(manifestUrl) {
  switchMapCrs(MAP_CRS_SIMPLE, [-50, 50], 1);

  debugLog('Loading manifest', manifestUrl);
  setManifestStatus(t('notifications.loadingManifest'), null);
  currentManifestId = manifestUrl;

  if (osmLayer && map.hasLayer(osmLayer)) {
    map.removeLayer(osmLayer);
  }

  clearIIIFLayers();

  function asArray(value) {
    if (!value) {
      return [];
    }
    return Array.isArray(value) ? value : [value];
  }

  function firstItem(value) {
    const list = asArray(value);
    return list.length > 0 ? list[0] : null;
  }

  function getLabel(label, index) {
    if (!label) {
      return t('viewer.canvasFallback', { index: index + 1 });
    }
    if (typeof label === 'string') {
      return label;
    }
    if (label.none && label.none[0]) {
      return label.none[0];
    }

    const firstLang = Object.keys(label)[0];
    if (firstLang && Array.isArray(label[firstLang]) && label[firstLang][0]) {
      return label[firstLang][0];
    }

    return t('viewer.canvasFallback', { index: index + 1 });
  }

  function getServiceId(service) {
    const firstService = firstItem(service);
    if (!firstService) {
      return null;
    }
    return firstService.id || firstService['@id'] || null;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getText(value, fallbackIndex) {
    if (!value) {
      return null;
    }

    if (typeof value === 'string') {
      return value;
    }

    if (Array.isArray(value)) {
      return value[0] || null;
    }

    if (typeof value === 'object') {
      if (value.none && Array.isArray(value.none) && value.none[0]) {
        return value.none[0];
      }

      const firstLang = Object.keys(value)[0];
      if (firstLang && Array.isArray(value[firstLang]) && value[firstLang][0]) {
        return value[firstLang][0];
      }
    }

    if (typeof fallbackIndex === 'number') {
      return t('viewer.canvasFallback', { index: fallbackIndex + 1 });
    }

    return null;
  }

  function getProviderName(provider) {
    if (!provider) {
      return null;
    }

    return getText(provider.label);
  }

  function getProviderHomepage(provider) {
    if (!provider) {
      return null;
    }

    const homepage = firstItem(provider.homepage);
    if (!homepage) {
      return null;
    }

    return homepage.id || homepage['@id'] || null;
  }

  function buildManifestSourceAttribution(data, sourceUrl) {
    const root = Array.isArray(data) ? data[0] : data;
    if (!root || typeof root !== 'object') {
      return null;
    }

    // IIIF Presentation 3: provider[].label (+ optional homepage)
    const providers = asArray(root.provider);
    for (const provider of providers) {
      const name = getProviderName(provider);
      if (!name) {
        continue;
      }

      const homepage = getProviderHomepage(provider);
      if (homepage) {
        return (
          t('viewer.iiifSource') +
          ': <a href="' +
          escapeHtml(homepage) +
          '" target="_blank" rel="noopener noreferrer">' +
          escapeHtml(name) +
          '</a>'
        );
      }

      return t('viewer.iiifSource') + ': ' + escapeHtml(name);
    }

    // IIIF Presentation 2 often has attribution text.
    const attributionText = getText(root.attribution);
    if (attributionText) {
      return t('viewer.iiifSource') + ': ' + escapeHtml(attributionText);
    }

    // Fallback to manifest label, then URL host.
    const manifestLabel = getText(root.label);
    if (manifestLabel) {
      return t('viewer.iiifSource') + ': ' + escapeHtml(manifestLabel);
    }

    try {
      const source = new URL(sourceUrl);
      return t('viewer.iiifSource') + ': ' + escapeHtml(source.hostname);
    } catch (_) {
      return null;
    }
  }

  function getImageServiceIdFromCanvas(canvas) {
    if (!canvas) {
      return null;
    }

    // IIIF Presentation 2: canvas.images[].resource.service
    const p2Image = firstItem(canvas.images);
    if (p2Image && p2Image.resource) {
      const p2ServiceId = getServiceId(p2Image.resource.service);
      if (p2ServiceId) {
        return p2ServiceId;
      }
    }

    // IIIF Presentation 3: canvas.items[].items[].body.service
    const featurePages = asArray(canvas.items);
    for (const page of featurePages) {
      const features = asArray(page.items);
      for (const feature of features) {
        const bodies = asArray(feature.body);
        for (const body of bodies) {
          const p3ServiceId = getServiceId(body.service);
          if (p3ServiceId) {
            return p3ServiceId;
          }
        }
      }
    }

    return null;
  }

  function getCanvasesFromManifest(data) {
    if (!data || typeof data !== 'object') {
      return [];
    }

    const root = Array.isArray(data) ? data[0] : data;
    if (!root || typeof root !== 'object') {
      return [];
    }

    if (Array.isArray(root.items)) {
      return root.items;
    }

    const firstSequence = firstItem(root.sequences);
    if (firstSequence && Array.isArray(firstSequence.canvases)) {
      return firstSequence.canvases;
    }

    return [];
  }

  function getCanvasUniqueKey(canvas, index) {
    if (canvas && canvas.id) {
      return canvas.id;
    }

    if (canvas && canvas['@id']) {
      return canvas['@id'];
    }

    return t('viewer.canvasKeyFallback', { index: index + 1 });
  }

  fetchJsonWithProxyFallback(manifestUrl)
    .then(function (result) {
      const data = result.data;
      const usedProxy = result.usedProxy;
      debugLog('Manifest fetched', usedProxy ? 'via proxy' : 'ok');

      setIIIFAttribution(buildManifestSourceAttribution(data, manifestUrl));

      // Reset previous layers each time a new manifest is loaded.
      iiifLayers = {};
      manifestCanvasKeys = [];
      manifestCanvasLabels = {};

      // IIIF Presentation 2 uses sequences[0].canvases; Presentation 3 uses items.
      const canvases = getCanvasesFromManifest(data);

      canvases.forEach(function (canvas, index) {
        const serviceId = getImageServiceIdFromCanvas(canvas);
        if (!serviceId) {
          debugLog('Canvas skipped', 'no image service at index ' + index);
          return;
        }

        const layerKey = getCanvasUniqueKey(canvas, index);
        const label = getLabel(canvas.label, index);
        const infoUrl = serviceId.replace(/\/$/, '') + '/info.json';
        iiifLayers[layerKey] = L.tileLayer.iiif(infoUrl, {
          iiifBaseUrl: serviceId.replace(/\/$/, '') + '/',
          jsonProxyBase: JSON_PROXY_BASE_URL,
          tileProxyBase: JSON_PROXY_BASE_URL,
        });
        manifestCanvasKeys.push(layerKey);
        manifestCanvasLabels[layerKey] = label;
      });

      if (manifestCanvasKeys.length === 0) {
        console.error('No IIIF image services found in this manifest.');
        debugLog(
          'No layers created',
          'manifest parsed but no image services found',
        );
        setManifestStatus(t('notifications.noIiifService'), 'error');
        showAppAlert(t('notifications.noIiifService'));
        return;
      }

      let targetCanvasIndex = 0;
      if (pendingImportedCanvasKey) {
        const pendingIndex = manifestCanvasKeys.indexOf(
          pendingImportedCanvasKey,
        );
        if (pendingIndex >= 0) {
          targetCanvasIndex = pendingIndex;
        }
      }

      currentCanvasIndex = -1;
      showCanvasByIndex(targetCanvasIndex);

      if (
        pendingImportedGeoJson &&
        pendingImportedManifestUrl &&
        normalizeManifestUrl(pendingImportedManifestUrl) ===
          normalizeManifestUrl(manifestUrl)
      ) {
        injectImportedGeoJsonFeatures(pendingImportedGeoJson, {
          clearExisting: true,
        });
        pendingImportedGeoJson = null;
        pendingImportedManifestUrl = null;
        pendingImportedCanvasKey = null;
      }

      debugLog(
        'Layer added',
        manifestCanvasLabels[manifestCanvasKeys[targetCanvasIndex]] +
          ' (' +
          manifestCanvasKeys.length +
          ' total)',
      );
    })
    .catch(function (error) {
      const status =
        error && error.status
          ? t('errors.httpStatusPrefix') + error.status
          : t('errors.noHttpStatus');
      const details = [status, error && error.message]
        .filter(Boolean)
        .join(' - ');

      console.error('Failed to load IIIF manifest:', details, manifestUrl);
      debugLog('Manifest load failed', details);
      setManifestStatus(
        t('notifications.loadingFailed', { details: details }),
        'error',
      );
      showAppAlert(
        t('errors.manifestLoadTitle') +
          '\n\n' +
          t('errors.detailsLabel') +
          details +
          '\n\n' +
          t('hints.githubPagesCors'),
      );
    });
}

var iiifLayers = {};
//pour monter les tuiles iiif

function clearIIIFLayers() {
  saveCurrentCanvasDrawings();
  clearIIIFAttribution();

  Object.keys(iiifLayers).forEach(function (layerName) {
    const layer = iiifLayers[layerName];
    if (layer && map.hasLayer(layer)) {
      map.removeLayer(layer);
    }
  });

  iiifLayers = {};
  manifestCanvasKeys = [];
  manifestCanvasLabels = {};
  currentCanvasIndex = -1;
  currentCanvasKey = null;
  updateCanvasNavigation();
}

function closeOsmStyleMenu() {
  if (osmStyleMenu) {
    osmStyleMenu.classList.add('is-hidden');
  }
}

function toggleOsmStyleMenu() {
  if (!osmStyleMenu) {
    return;
  }

  osmStyleMenu.classList.toggle('is-hidden');
}

function showOSMAndClearIIIF(styleName) {
  switchMapCrs(MAP_CRS_OSM, [0, 0], 2);

  clearIIIFLayers();

  const requestedStyle = styleName || currentOsmStyle || 'dark';
  const style =
    OSM_STYLE_DEFINITIONS[requestedStyle] || OSM_STYLE_DEFINITIONS.dark;
  currentOsmStyle = OSM_STYLE_DEFINITIONS[requestedStyle]
    ? requestedStyle
    : 'dark';

  if (osmLayer && map.hasLayer(osmLayer)) {
    map.removeLayer(osmLayer);
  }

  osmLayer = L.tileLayer(style.url, style.options);

  if (osmStyleSelect && osmStyleSelect.value !== currentOsmStyle) {
    osmStyleSelect.value = currentOsmStyle;
  }

  osmLayer.addTo(map);
  map.invalidateSize();
  map.setView([0, 0], 2);
  window.setTimeout(function () {
    map.invalidateSize();
    map.setView([0, 0], 2);
  }, 0);

  setManifestStatus(
    t('notifications.osmActive', { style: currentOsmStyle }),
    'success',
  );
}

function normalizeManifestUrl(inputUrl) {
  if (!inputUrl) {
    return null;
  }

  let candidate = inputUrl.trim();
  if (!candidate) {
    return null;
  }

  // If no protocol is provided, default to HTTPS for GitHub Pages.
  if (!/^https?:\/\//i.test(candidate)) {
    candidate = 'https://' + candidate.replace(/^\/\//, '');
  }

  // Avoid mixed-content blocking (http manifest on https page).
  if (/^http:\/\//i.test(candidate)) {
    candidate = candidate.replace(/^http:\/\//i, 'https://');
  }

  try {
    return new URL(candidate).toString();
  } catch (_) {
    return null;
  }
}

const manifestButton = document.getElementById('ask-button');

function openManifestPanel() {
  manifestPanel.classList.remove('is-hidden');
}

function closeManifestPanel() {
  manifestPanel.classList.add('is-hidden');
}

function updateManifestClearButtonVisibility() {
  if (!manifestClearButton || !manifestInput) {
    return;
  }

  manifestClearButton.classList.toggle('is-hidden', !manifestInput.value);
}

manifestButton.addEventListener('click', function () {
  openManifestPanel();
  updateManifestClearButtonVisibility();
  manifestInput.focus();
  manifestInput.select();
});

if (manifestCloseButton) {
  manifestCloseButton.addEventListener('click', function () {
    closeManifestPanel();
  });
}

document.addEventListener('click', function (event) {
  if (!manifestPanel || manifestPanel.classList.contains('is-hidden')) {
    return;
  }

  if (
    event.target === manifestButton ||
    manifestButton.contains(event.target)
  ) {
    return;
  }

  if (manifestPanel.contains(event.target)) {
    return;
  }

  closeManifestPanel();
});

if (manifestClearButton && manifestInput) {
  manifestClearButton.addEventListener('click', function () {
    manifestInput.value = '';
    updateManifestClearButtonVisibility();
    manifestInput.focus();
  });

  manifestInput.addEventListener('input', function () {
    updateManifestClearButtonVisibility();
  });

  updateManifestClearButtonVisibility();
}

function submitManifestFromInput() {
  const normalizedUrl = normalizeManifestUrl(manifestInput.value);
  if (!normalizedUrl) {
    setManifestStatus(t('errors.invalidManifestUrl'), 'error');
    return;
  }

  manifestInput.value = normalizedUrl;
  updateManifestClearButtonVisibility();
  loadIIIFManifest(normalizedUrl);
}

loadManifestButton.addEventListener('click', submitManifestFromInput);
manifestInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    submitManifestFromInput();
  }
});

canvasPrevButton.addEventListener('click', function () {
  showCanvasByIndex(currentCanvasIndex - 1);
});

canvasNextButton.addEventListener('click', function () {
  showCanvasByIndex(currentCanvasIndex + 1);
});

updateCanvasNavigation();

////////////////
//LEAFLET HASH//
////////////////

//Ajouter hash (Leaflet-hash lets you to add dynamic URL hashes to web pages with Leaflet maps.) Pratique pour les coords de la carte iiif
var hash = new L.Hash(map);

////////////////
//LEAFLET DRAW//
////////////////

//en complement a draw.js

// Load saved layers from local storage when the page loads
loadFromLocalStorage();

///////////////////////
//afficher les coords//
///////////////////////

var div = document.createElement('div');
div.id = 'coordsDiv';
div.style.position = 'absolute';
div.style.bottom = '0';
div.style.left = '0';
div.style.backgroundColor = 'black';
div.style.color = 'white';
div.style.padding = '2px 4px';
div.style.zIndex = '999';
document.getElementById('map').appendChild(div);

map.on('mousemove', function (e) {
  var lat = e.latlng.lat.toFixed(5);
  var lon = e.latlng.lng.toFixed(5);

  document.getElementById('coordsDiv').innerHTML = lat + ', ' + lon;
});

///////////////////////
//DRAG AND DROP ///////
///////////////////////
// Variable to hold the loaded GeoJSON layer
let loadedGeoJSONLayer;

// Function to handle the file drop
function handleFileDrop(event) {
  event.preventDefault();
  const file = event.dataTransfer.files[0];
  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = function (e) {
    try {
      const jsonContent = JSON.parse(e.target.result);

      const sourceMode = getSourceModeFromGeoJson(jsonContent);
      const osmStyle = getOsmStyleFromGeoJson(jsonContent) || currentOsmStyle;
      const manifestUrl = normalizeManifestUrl(
        getManifestUrlFromGeoJson(jsonContent),
      );
      const canvasKey = getCanvasKeyFromGeoJson(jsonContent);

      if (sourceMode === 'osm') {
        showOSMAndClearIIIF(osmStyle);
        injectImportedGeoJsonFeatures(jsonContent, { clearExisting: true });
        return;
      }

      if (manifestUrl) {
        pendingImportedGeoJson = jsonContent;
        pendingImportedManifestUrl = manifestUrl;
        pendingImportedCanvasKey = canvasKey;

        manifestInput.value = manifestUrl;
        updateManifestClearButtonVisibility();
        loadIIIFManifest(manifestUrl);
        return;
      }

      // Remove the previously loaded standalone GeoJSON layer, if any.
      if (loadedGeoJSONLayer) {
        map.removeLayer(loadedGeoJSONLayer);
        loadedGeoJSONLayer = null;
      }

      injectImportedGeoJsonFeatures(jsonContent, { clearExisting: true });
    } catch (error) {
      console.error('Error parsing JSON file:', error);
    }
  };

  reader.readAsText(file);
}

// Add event listeners to the entire window
window.addEventListener('dragover', (event) => event.preventDefault());
window.addEventListener('drop', handleFileDrop);

///////////////////////
//GESTION DES POP-UPS//
///////////////////////

// Fonction pour générer la liste à partir des données de data.js
function generateListFromData(data) {
  let listHtml = '<ul>';
  data.forEach((data) => {
    const title = data.titre ? t(data.titre) : '';
    const cartographer = data.cartographe ? t(data.cartographe) : '';
    listHtml += `<li>${title} - ${cartographer} (${data.year})</li>`;
  });
  listHtml += '</ul>';
  return listHtml;
}

const infoBox = document.getElementById('infoBox');
const infoContent = document.getElementById('infoContent');
const infoButton = document.getElementById('info-button');
const iiifGuideButton = document.getElementById('iiif-guide-button');
const addButton = document.getElementById('add-button');
const osmButton = document.getElementById('osm-button');
const annotationTourButton = document.getElementById('annotation-tour-button');
//const randomButton = document.getElementById("random-button");

function openInfoBox(content) {
  infoContent.innerHTML = content;
  infoBox.style.display = 'block';
}

function closeInfoBox() {
  infoBox.style.display = 'none';
}

// Function to check if the click event is inside the info-box
function isClickInsideInfoBox(event) {
  return event.target === infoBox || infoBox.contains(event.target);
}

// Add a click event listener to the document
document.addEventListener('click', function (event) {
  // Check if the clicked element is inside the info box or the info button
  if (
    !isClickInsideInfoBox(event) &&
    event.target !== infoButton &&
    event.target !== addButton
  ) {
    closeInfoBox(); // Close the info box if clicked outside
  }
});

// ☘ button
infoButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content =
    '<img src="src/app/assets/branding/clover_300.png" class="icon" alt="' +
    t('popup.common.imageAlt') +
    '">' +
    '<h2>' +
    t('app.title') +
    '</h2>' +
    '<p>' +
    t('popup.info.body') +
    '</p>' +
    '<div class="info-footer">' +
    '<span class="info-footer__text">' +
    t('popup.info.madeWith') +
    '</span>' +
    '<img src="src/app/assets/svelte-logo.svg" class="info-footer__logo" alt="' +
    t('popup.common.svelteLogoAlt') +
    '">' +
    '</div>';
  openInfoBox(content);
});

// ➕ Add click event listeners to the buttons
if (iiifGuideButton) {
  iiifGuideButton.addEventListener('click', function (event) {
    event.stopPropagation();
    window.open(
      'https://iiif.io/guides/finding_resources/',
      '_blank',
      'noopener,noreferrer',
    );
  });
}

if (annotationTourButton) {
  annotationTourButton.addEventListener('click', function (event) {
    event.stopPropagation();
    focusNextOrderedAnnotation();
  });
}

updateAnnotationTourCounterDisplay();

addButton.addEventListener('click', function (event) {
  event.stopPropagation(); // Stop the click event from propagating to the map
  const content =
    '<img src="src/app/assets/branding/clover_300.png" class="icon" alt="' +
    t('popup.common.imageAlt') +
    '">' +
    '<h2>' +
    t('app.title') +
    '</h2>' +
    '<p>' +
    t('popup.import.body') +
    '</p>' +
    '<div class="info-box__actions">' +
    '<button type="button" class="info-box__close-btn" onclick="document.getElementById(\'infoBox\').style.display=\'none\'">' +
    t('buttons.ok') +
    '</button>' +
    '</div>';
  openInfoBox(content);
});

osmButton.addEventListener('click', function (event) {
  event.stopPropagation();
  showOSMAndClearIIIF(currentOsmStyle);
  toggleOsmStyleMenu();
});

if (osmStyleSelect) {
  osmStyleSelect.value = currentOsmStyle;
  osmStyleSelect.addEventListener('change', function () {
    showOSMAndClearIIIF(osmStyleSelect.value);
  });
}

document.addEventListener('click', function (event) {
  if (
    osmStyleMenu &&
    !osmStyleMenu.classList.contains('is-hidden') &&
    event.target !== osmButton &&
    !osmButton.contains(event.target) &&
    !osmStyleMenu.contains(event.target)
  ) {
    closeOsmStyleMenu();
  }
});

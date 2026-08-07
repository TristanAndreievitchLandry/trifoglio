/**
 * @class PopupManager
 * @description Handles popup lifecycle and content boundaries for map features.
 * @emits popup:opened
 * @emits popup:closed
 * @emits popup:updated
 */
export class PopupManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = ['popup:opened', 'popup:closed', 'popup:updated'];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.currentPopup = null;
    this.boundAnnotationId = null;
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Binds popup behavior to an annotation.
   * @param {string} annotationId
   * @returns {void}
   */
  bindToAnnotation(annotationId) {
    this.boundAnnotationId = annotationId || null;
    return this.boundAnnotationId;
  }

  /**
   * Opens a popup.
   * @param {Object} context
   * @returns {void}
   */
  openPopup(context = {}) {
    const annotation = context.annotation || context;
    const annotationId = annotation && annotation.id ? annotation.id : null;
    const html = this.generatePopupHtml(annotation);

    this.currentPopup = {
      annotationId: annotationId,
      html: html,
      pinned: false,
    };

    if (annotationId) {
      this.boundAnnotationId = annotationId;
    }

    this._emit('popup:opened', this._deepClone(this.currentPopup));
    return this._deepClone(this.currentPopup);
  }

  /**
   * Closes the current popup.
   * @returns {void}
   */
  closePopup() {
    if (!this.currentPopup) {
      return;
    }

    const payload = this._deepClone(this.currentPopup);
    this.currentPopup = null;
    this._emit('popup:closed', payload);
  }

  /**
   * Updates popup content.
   * @param {Object} content
   * @returns {void}
   */
  updatePopupContent(content = {}) {
    if (!this.currentPopup) {
      return null;
    }

    const annotation = content.annotation || null;
    const nextHtml =
      typeof content.html === 'string'
        ? content.html
        : this.generatePopupHtml(
            annotation || { id: this.currentPopup.annotationId },
          );

    this.currentPopup = {
      ...this.currentPopup,
      html: nextHtml,
    };

    this._emit('popup:updated', this._deepClone(this.currentPopup));
    return this._deepClone(this.currentPopup);
  }

  /**
   * Pins the current popup.
   * @returns {void}
   */
  pinPopup() {
    if (!this.currentPopup) {
      return null;
    }

    this.currentPopup.pinned = true;
    this._emit('popup:updated', this._deepClone(this.currentPopup));
    return this._deepClone(this.currentPopup);
  }

  /**
   * Unpins the current popup.
   * @returns {void}
   */
  unpinPopup() {
    if (!this.currentPopup) {
      return null;
    }

    this.currentPopup.pinned = false;
    this._emit('popup:updated', this._deepClone(this.currentPopup));
    return this._deepClone(this.currentPopup);
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.currentPopup = null;
    this.boundAnnotationId = null;
  }

  /**
   * Generates sanitized popup HTML from annotation data.
   * Displays title, description, and metadata only when present.
   * @param {Object} annotation
   * @returns {string}
   */
  generatePopupHtml(annotation = {}) {
    const properties =
      annotation &&
      annotation.properties &&
      typeof annotation.properties === 'object'
        ? annotation.properties
        : {};

    const title =
      typeof properties.title === 'string' && properties.title.trim() !== ''
        ? properties.title.trim()
        : null;
    const description =
      typeof properties.description === 'string' &&
      properties.description.trim() !== ''
        ? properties.description.trim()
        : null;
    const metadata = this._normalizeMetadata(
      Object.prototype.hasOwnProperty.call(properties, 'metadata')
        ? properties.metadata
        : properties.customMetadata,
    );

    const sections = [];

    if (title) {
      sections.push(
        '<h3 class="trf-popup__title">' + this._escapeHtml(title) + '</h3>',
      );
    }

    if (description) {
      sections.push(
        '<p class="trf-popup__description">' +
          this._escapeHtml(description) +
          '</p>',
      );
    }

    if (metadata.length > 0) {
      const items = metadata
        .map((entry) => {
          return (
            '<li class="trf-popup__meta-item">' +
            '<span class="trf-popup__meta-key">' +
            this._escapeHtml(entry.key) +
            '</span>' +
            '<span class="trf-popup__meta-sep">: </span>' +
            '<span class="trf-popup__meta-value">' +
            this._escapeHtml(entry.value) +
            '</span>' +
            '</li>'
          );
        })
        .join('');

      sections.push('<ul class="trf-popup__metadata">' + items + '</ul>');
    }

    if (sections.length === 0) {
      return '<div class="trf-popup"></div>';
    }

    return '<div class="trf-popup">' + sections.join('') + '</div>';
  }

  /**
   * Normalizes metadata to key/value array.
   * @param {Object|Array} metadata
   * @returns {Array<{key: string, value: string}>}
   */
  _normalizeMetadata(metadata) {
    if (Array.isArray(metadata)) {
      return metadata
        .filter((entry) => entry && typeof entry === 'object')
        .map((entry) => {
          return {
            key:
              typeof entry.key === 'string'
                ? entry.key
                : String(entry.key || ''),
            value:
              typeof entry.value === 'string'
                ? entry.value
                : String(entry.value || ''),
          };
        })
        .filter(
          (entry) => entry.key.trim() !== '' || entry.value.trim() !== '',
        );
    }

    if (metadata && typeof metadata === 'object') {
      return Object.keys(metadata).map((key) => {
        return {
          key: key,
          value:
            typeof metadata[key] === 'string'
              ? metadata[key]
              : String(metadata[key] || ''),
        };
      });
    }

    return [];
  }

  /**
   * Escapes unsafe HTML characters.
   * @param {string} value
   * @returns {string}
   */
  _escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Emits popup events through EventBus when available.
   * @param {string} eventName
   * @param {Object} payload
   * @returns {void}
   */
  _emit(eventName, payload) {
    if (this.eventBus && typeof this.eventBus.emit === 'function') {
      this.eventBus.emit(eventName, payload);
    }
  }

  /**
   * Performs a JSON-safe deep clone.
   * @param {any} value
   * @returns {any}
   */
  _deepClone(value) {
    if (value === null || typeof value === 'undefined') {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }
}

export default PopupManager;

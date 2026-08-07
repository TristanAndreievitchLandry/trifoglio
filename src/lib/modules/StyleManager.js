/**
 * @class StyleManager
 * @description Manages visual style definitions and style assignments.
 * @emits style:created
 * @emits style:updated
 * @emits style:deleted
 * @emits style:applied
 */
export class StyleManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'style:created',
    'style:updated',
    'style:deleted',
    'style:applied',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.stylePresets = new Map();
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Defines a style preset.
   * @param {Object} styleDefinition
   * @returns {void}
   */
  defineStyle(styleDefinition = {}) {
    const styleId = styleDefinition.id || this._createStyleId();
    const preset = {
      id: styleId,
      ...this._deepClone(styleDefinition),
    };

    this.stylePresets.set(styleId, preset);
    this._emit('style:created', {
      styleId: styleId,
      style: this._deepClone(preset),
    });
    return this._deepClone(preset);
  }

  /**
   * Updates an existing style preset.
   * @param {string} styleId
   * @param {Object} patch
   * @returns {void}
   */
  updateStyle(styleId, patch = {}) {
    if (!this.stylePresets.has(styleId)) {
      return null;
    }

    const current = this.stylePresets.get(styleId);
    const next = {
      ...this._deepClone(current),
      ...this._deepClone(patch),
      id: styleId,
    };

    this.stylePresets.set(styleId, next);
    this._emit('style:updated', {
      styleId: styleId,
      style: this._deepClone(next),
    });
    return this._deepClone(next);
  }

  /**
   * Deletes a style preset.
   * @param {string} styleId
   * @returns {void}
   */
  deleteStyle(styleId) {
    if (!this.stylePresets.has(styleId)) {
      return false;
    }

    this.stylePresets.delete(styleId);
    this._emit('style:deleted', { styleId: styleId });
    return true;
  }

  /**
   * Applies a style to a layer.
   * @param {string} layerId
   * @param {string} styleId
   * @returns {void}
   */
  applyStyleToLayer(layerId, styleId) {
    const style = this.stylePresets.get(styleId);
    if (!style) {
      return null;
    }

    const payload = {
      targetType: 'layer',
      targetId: layerId,
      styleId: styleId,
      style: this._deepClone(style),
    };

    this._emit('style:applied', payload);
    return payload;
  }

  /**
   * Applies a style to an annotation.
   * @param {string} annotationId
   * @param {string} styleId
   * @returns {void}
   */
  applyStyleToAnnotation(annotationId, styleId) {
    const style = this.stylePresets.get(styleId);
    if (!style) {
      return null;
    }

    const payload = {
      targetType: 'annotation',
      targetId: annotationId,
      styleId: styleId,
      style: this._deepClone(style),
    };

    this._emit('style:applied', payload);
    return payload;
  }

  /**
   * Resolves effective style.
   * @param {Object} context
   * @returns {void}
   */
  resolveEffectiveStyle(context = {}) {
    const geometryType = this._normalizeGeometryType(
      context.geometryType ||
        (context.annotation &&
          context.annotation.geometry &&
          context.annotation.geometry.type),
    );
    const properties =
      context.properties ||
      (context.annotation && context.annotation.properties) ||
      {};
    const annotationStyle =
      context.annotation && context.annotation.style
        ? context.annotation.style
        : {};

    return {
      ...this.defaultStyle(geometryType, properties),
      ...this._deepClone(annotationStyle),
      ...this._extractStyleFromProperties(properties, geometryType),
    };
  }

  /**
   * Applies a style to an annotation-like object using property-driven colors.
   * @param {Object} annotation
   * @returns {Object}
   */
  applyStyle(annotation = {}) {
    const next = this._deepClone(annotation);
    const geometryType = this._normalizeGeometryType(
      next.geometryType || (next.geometry && next.geometry.type),
    );
    const properties =
      next.properties && typeof next.properties === 'object'
        ? next.properties
        : {};

    next.style = {
      ...this.defaultStyle(geometryType, properties),
      ...this._deepClone(next.style || {}),
      ...this._extractStyleFromProperties(properties, geometryType),
    };

    this._emit('style:applied', {
      targetType: 'annotation',
      targetId: next.id || null,
      style: this._deepClone(next.style),
    });

    return next;
  }

  /**
   * Reads the effective style from an annotation-like object.
   * @param {Object} annotation
   * @returns {Object}
   */
  readStyle(annotation = {}) {
    const geometryType = this._normalizeGeometryType(
      annotation.geometryType ||
        (annotation.geometry && annotation.geometry.type),
    );
    const properties =
      annotation.properties && typeof annotation.properties === 'object'
        ? annotation.properties
        : {};

    return {
      ...this.defaultStyle(geometryType, properties),
      ...this._deepClone(annotation.style || {}),
      ...this._extractStyleFromProperties(properties, geometryType),
    };
  }

  /**
   * Returns default style for a geometry family. Color values always come from properties.
   * @param {string} geometryType
   * @param {Object} properties
   * @returns {Object}
   */
  defaultStyle(geometryType, properties = {}) {
    const family = this._normalizeGeometryType(geometryType);

    if (family === 'marker') {
      return {
        markerColor: this._resolveColor(properties, ['markerColor', 'color']),
        opacity: this._resolveNumber(properties, ['opacity'], 1),
      };
    }

    if (family === 'line') {
      return {
        strokeColor: this._resolveColor(properties, ['strokeColor', 'color']),
        strokeWidth: this._resolveNumber(
          properties,
          ['strokeWidth', 'weight'],
          1,
        ),
        strokeOpacity: this._resolveNumber(
          properties,
          ['strokeOpacity', 'opacity'],
          1,
        ),
      };
    }

    if (family === 'polygon') {
      return {
        strokeColor: this._resolveColor(properties, ['strokeColor', 'color']),
        strokeWidth: this._resolveNumber(
          properties,
          ['strokeWidth', 'weight'],
          1,
        ),
        strokeOpacity: this._resolveNumber(
          properties,
          ['strokeOpacity', 'opacity'],
          1,
        ),
        fillColor: this._resolveColor(properties, ['fillColor', 'color']),
        fillOpacity: this._resolveNumber(properties, ['fillOpacity'], 0.2),
      };
    }

    if (family === 'circle') {
      return {
        strokeColor: this._resolveColor(properties, ['strokeColor', 'color']),
        strokeWidth: this._resolveNumber(
          properties,
          ['strokeWidth', 'weight'],
          1,
        ),
        strokeOpacity: this._resolveNumber(
          properties,
          ['strokeOpacity', 'opacity'],
          1,
        ),
        fillColor: this._resolveColor(properties, ['fillColor', 'color']),
        fillOpacity: this._resolveNumber(properties, ['fillOpacity'], 0.2),
      };
    }

    return {};
  }

  /**
   * Lists style presets.
   * @returns {void}
   */
  listStyles() {
    return Array.from(this.stylePresets.values()).map((style) =>
      this._deepClone(style),
    );
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.stylePresets.clear();
  }

  /**
   * Extracts style-related values from annotation properties.
   * @param {Object} properties
   * @param {string} geometryType
   * @returns {Object}
   */
  _extractStyleFromProperties(properties = {}, geometryType) {
    const family = this._normalizeGeometryType(geometryType);

    if (family === 'marker') {
      return {
        markerColor: this._resolveColor(properties, ['markerColor', 'color']),
        opacity: this._resolveNumber(properties, ['opacity'], 1),
      };
    }

    if (family === 'line') {
      return {
        strokeColor: this._resolveColor(properties, ['strokeColor', 'color']),
        strokeWidth: this._resolveNumber(
          properties,
          ['strokeWidth', 'weight'],
          1,
        ),
        strokeOpacity: this._resolveNumber(
          properties,
          ['strokeOpacity', 'opacity'],
          1,
        ),
      };
    }

    if (family === 'polygon' || family === 'circle') {
      return {
        strokeColor: this._resolveColor(properties, ['strokeColor', 'color']),
        strokeWidth: this._resolveNumber(
          properties,
          ['strokeWidth', 'weight'],
          1,
        ),
        strokeOpacity: this._resolveNumber(
          properties,
          ['strokeOpacity', 'opacity'],
          1,
        ),
        fillColor: this._resolveColor(properties, ['fillColor', 'color']),
        fillOpacity: this._resolveNumber(properties, ['fillOpacity'], 0.2),
      };
    }

    return {};
  }

  /**
   * Normalizes geometry type to marker/line/polygon/circle families.
   * @param {string} geometryType
   * @returns {string}
   */
  _normalizeGeometryType(geometryType) {
    const value = String(geometryType || '').toLowerCase();

    if (value === 'point' || value === 'marker' || value === 'circlemarker') {
      return 'marker';
    }

    if (
      value === 'linestring' ||
      value === 'multilinestring' ||
      value === 'polyline'
    ) {
      return 'line';
    }

    if (value === 'polygon' || value === 'multipolygon') {
      return 'polygon';
    }

    if (value === 'circle') {
      return 'circle';
    }

    return value;
  }

  /**
   * Resolves a numeric property from candidate keys.
   * @param {Object} source
   * @param {string[]} keys
   * @param {number} fallback
   * @returns {number}
   */
  _resolveNumber(source, keys, fallback) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const numeric = Number(source[key]);
        if (!Number.isNaN(numeric)) {
          return numeric;
        }
      }
    }

    return fallback;
  }

  /**
   * Resolves a color value from properties without hard-coded defaults.
   * @param {Object} source
   * @param {string[]} keys
   * @returns {string|null}
   */
  _resolveColor(source, keys) {
    for (const key of keys) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        const value = source[key];
        if (typeof value === 'string' && value.trim() !== '') {
          return value;
        }
      }
    }

    return null;
  }

  /**
   * Emits manager events through EventBus when available.
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

  /**
   * Generates a unique style preset identifier.
   * @returns {string}
   */
  _createStyleId() {
    return 'style-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
  }
}

export default StyleManager;

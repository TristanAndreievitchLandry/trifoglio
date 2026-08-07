/**
 * @class ImportExportManager
 * @description Handles import and export boundaries for projects and annotations.
 * @emits import:started
 * @emits import:completed
 * @emits export:started
 * @emits export:completed
 * @emits importExport:error
 */
export class ImportExportManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'import:started',
    'import:completed',
    'export:started',
    'export:completed',
    'importExport:error',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.connectors = new Map();
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Imports a project.
   * @param {Object} source
   * @returns {void}
   */
  importProject(source) {
    this._emit('import:started', { scope: 'project' });

    try {
      const payload = this._parseSource(source);
      const format = this.detectFormat(payload);
      let project;

      if (format === 'geojson') {
        project = this.importGeoJson(payload, { target: 'project' });
      } else if (format === 'trifoglio') {
        project = this.importTrifoglioProject(payload);
      } else {
        throw new Error('Unsupported import format for project.');
      }

      this._emit('import:completed', {
        scope: 'project',
        format: format,
        project: this._clone(project),
      });

      return this._clone(project);
    } catch (error) {
      this._emitImportExportError('importProject', error, { scope: 'project' });
      throw error;
    }
  }

  /**
   * Exports a project.
   * @param {Object} options
   * @returns {void}
   */
  exportProject(options = {}) {
    this._emit('export:started', { scope: 'project' });

    try {
      const project = options.project || options;
      const format = this._normalizeFormat(options.format) || 'trifoglio';
      let serialized;

      if (format === 'geojson') {
        serialized = this.exportGeoJson(project);
      } else if (format === 'trifoglio') {
        serialized = this.exportTrifoglioProject(project);
      } else {
        throw new Error('Unsupported export format for project.');
      }

      this._emit('export:completed', {
        scope: 'project',
        format: format,
      });

      return serialized;
    } catch (error) {
      this._emitImportExportError('exportProject', error, { scope: 'project' });
      throw error;
    }
  }

  /**
   * Imports annotations.
   * @param {Object} source
   * @returns {void}
   */
  importAnnotations(source) {
    this._emit('import:started', { scope: 'annotations' });

    try {
      const payload = this._parseSource(source);
      const format = this.detectFormat(payload);
      let annotations = [];

      if (format === 'geojson') {
        annotations = this.importGeoJson(payload, { target: 'annotations' });
      } else if (format === 'trifoglio') {
        annotations = this._extractTrifoglioAnnotations(payload);
      } else if (Array.isArray(payload)) {
        annotations = payload.map((annotation) => this._clone(annotation));
      } else {
        throw new Error('Unsupported import format for annotations.');
      }

      this._emit('import:completed', {
        scope: 'annotations',
        format: format,
        count: annotations.length,
      });

      return annotations.map((annotation) => this._clone(annotation));
    } catch (error) {
      this._emitImportExportError('importAnnotations', error, {
        scope: 'annotations',
      });
      throw error;
    }
  }

  /**
   * Exports annotations.
   * @param {Object} options
   * @returns {void}
   */
  exportAnnotations(options = {}) {
    this._emit('export:started', { scope: 'annotations' });

    try {
      const annotations = Array.isArray(options.annotations)
        ? options.annotations
        : Array.isArray(options)
          ? options
          : [];
      const format = this._normalizeFormat(options.format) || 'geojson';

      let serialized;
      if (format === 'geojson') {
        serialized = this.exportGeoJson(annotations);
      } else if (format === 'trifoglio') {
        serialized = JSON.stringify(
          {
            type: 'TrifoglioProject',
            version: '1.0.0',
            id: this._createId('project'),
            name: 'Exported Annotations',
            manifest: null,
            viewerState: {},
            layers: [],
            annotations: annotations.map((annotation) =>
              this._clone(annotation),
            ),
            updatedAt: new Date().toISOString(),
          },
          null,
          2,
        );
      } else {
        throw new Error('Unsupported export format for annotations.');
      }

      this._emit('export:completed', {
        scope: 'annotations',
        format: format,
        count: annotations.length,
      });

      return serialized;
    } catch (error) {
      this._emitImportExportError('exportAnnotations', error, {
        scope: 'annotations',
      });
      throw error;
    }
  }

  /**
   * Registers an import/export connector.
   * @param {string} connectorId
   * @param {Object} connector
   * @returns {void}
   */
  registerConnector(connectorId, connector) {
    if (!connectorId) {
      throw new Error('registerConnector requires connectorId.');
    }

    if (!connector || typeof connector !== 'object') {
      throw new Error('registerConnector requires a connector object.');
    }

    this.connectors.set(connectorId, connector);
    return this.listConnectors();
  }

  /**
   * Unregisters an import/export connector.
   * @param {string} connectorId
   * @returns {void}
   */
  unregisterConnector(connectorId) {
    return this.connectors.delete(connectorId);
  }

  /**
   * Lists registered connectors.
   * @returns {void}
   */
  listConnectors() {
    return Array.from(this.connectors.keys());
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.connectors.clear();
  }

  /**
   * Exports project or annotations as GeoJSON.
   * @param {Object|Object[]} source
   * @returns {string}
   */
  exportGeoJson(source) {
    const annotations = this._resolveAnnotationsForGeoJsonExport(source);
    const featureCollection = {
      type: 'FeatureCollection',
      features: annotations.map((annotation, index) => {
        const properties = this._exportAnnotationProperties(annotation);
        return {
          type: 'Feature',
          id:
            annotation && annotation.id
              ? annotation.id
              : this._createId('feature-' + index),
          geometry:
            annotation && annotation.geometry
              ? this._clone(annotation.geometry)
              : null,
          properties: properties,
        };
      }),
    };

    return JSON.stringify(featureCollection, null, 2);
  }

  /**
   * Exports a TrifoglioProject payload.
   * @param {Object} project
   * @returns {string}
   */
  exportTrifoglioProject(project = {}) {
    const normalized = this._normalizeTrifoglioProject(project);
    return JSON.stringify(normalized, null, 2);
  }

  /**
   * Imports GeoJSON and returns project or annotations based on target.
   * @param {Object|string} source
   * @param {Object} [options]
   * @param {'project'|'annotations'} [options.target='project']
   * @returns {Object|Object[]}
   */
  importGeoJson(source, options = {}) {
    const payload = this._parseSource(source);
    const collection = this._ensureFeatureCollection(payload);
    const target = options.target || 'project';
    const defaultLayerId = 'layer-default';

    const annotations = collection.features.map((feature, index) => {
      const properties =
        feature && feature.properties && typeof feature.properties === 'object'
          ? this._clone(feature.properties)
          : {};

      const layerId =
        properties.layerId ||
        (feature && feature.layerId ? feature.layerId : defaultLayerId);

      if (Object.prototype.hasOwnProperty.call(properties, 'layerId')) {
        delete properties.layerId;
      }

      return {
        id:
          feature && feature.id
            ? String(feature.id)
            : this._createId('annotation-' + index),
        geometry:
          feature && feature.geometry ? this._clone(feature.geometry) : null,
        properties: properties,
        layerId: layerId,
      };
    });

    if (target === 'annotations') {
      return annotations.map((annotation) => this._clone(annotation));
    }

    const project = this._normalizeTrifoglioProject({
      name: 'Imported GeoJSON Project',
      manifest: null,
      viewerState: {},
      layers: [
        {
          id: defaultLayerId,
          name: 'Imported Layer',
          order: 0,
          visible: true,
          locked: false,
          color: '#3388ff',
        },
      ],
      annotations: annotations,
    });

    return this._clone(project);
  }

  /**
   * Imports TrifoglioProject payload.
   * @param {Object|string} source
   * @returns {Object}
   */
  importTrifoglioProject(source) {
    const payload = this._parseSource(source);
    return this._normalizeTrifoglioProject(payload);
  }

  /**
   * Detects payload format.
   * @param {Object|string} source
   * @returns {'geojson'|'trifoglio'|'unknown'}
   */
  detectFormat(source) {
    let payload;
    try {
      payload = this._parseSource(source);
    } catch (_error) {
      return 'unknown';
    }

    if (!payload || typeof payload !== 'object') {
      return 'unknown';
    }

    if (payload.type === 'FeatureCollection' || payload.type === 'Feature') {
      return 'geojson';
    }

    if (
      payload.type === 'TrifoglioProject' ||
      (typeof payload.version === 'string' &&
        Array.isArray(payload.annotations)) ||
      (Array.isArray(payload.layers) && Array.isArray(payload.annotations))
    ) {
      return 'trifoglio';
    }

    return 'unknown';
  }

  /**
   * Emits import/export error payload.
   * @param {string} stage
   * @param {Error} error
   * @param {Object} context
   * @returns {void}
   */
  _emitImportExportError(stage, error, context = {}) {
    this._emit('importExport:error', {
      stage: stage,
      message:
        error && error.message ? error.message : 'Unknown import/export error.',
      context: this._clone(context),
    });
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
   * Parses string/object input payload.
   * @param {Object|string} source
   * @returns {Object}
   */
  _parseSource(source) {
    if (source === null || typeof source === 'undefined') {
      throw new Error('Import source is empty.');
    }

    if (typeof source === 'string') {
      return JSON.parse(source);
    }

    if (typeof source !== 'object') {
      throw new Error('Import source must be a JSON string or object.');
    }

    return source;
  }

  /**
   * Ensures a GeoJSON FeatureCollection.
   * @param {Object} payload
   * @returns {{type: string, features: Object[]}}
   */
  _ensureFeatureCollection(payload) {
    if (
      payload.type === 'FeatureCollection' &&
      Array.isArray(payload.features)
    ) {
      return payload;
    }

    if (payload.type === 'Feature') {
      return {
        type: 'FeatureCollection',
        features: [payload],
      };
    }

    throw new Error('GeoJSON payload must be a FeatureCollection or Feature.');
  }

  /**
   * Resolves annotations from project-like or annotation array source.
   * @param {Object|Object[]} source
   * @returns {Object[]}
   */
  _resolveAnnotationsForGeoJsonExport(source) {
    if (Array.isArray(source)) {
      return source.map((annotation) => this._clone(annotation));
    }

    if (source && Array.isArray(source.annotations)) {
      return source.annotations.map((annotation) => this._clone(annotation));
    }

    throw new Error(
      'GeoJSON export requires annotations or project.annotations.',
    );
  }

  /**
   * Extracts annotations from a TrifoglioProject-like object.
   * @param {Object} payload
   * @returns {Object[]}
   */
  _extractTrifoglioAnnotations(payload) {
    if (!payload || !Array.isArray(payload.annotations)) {
      return [];
    }

    return payload.annotations.map((annotation) => this._clone(annotation));
  }

  /**
   * Normalizes project into TrifoglioProject shape.
   * @param {Object} input
   * @returns {Object}
   */
  _normalizeTrifoglioProject(input = {}) {
    return {
      type: 'TrifoglioProject',
      version: typeof input.version === 'string' ? input.version : '1.0.0',
      id: input.id || this._createId('project'),
      name: input.name || 'Untitled Project',
      manifest: input.manifest || input.iiifManifest || null,
      viewerState:
        input.viewerState && typeof input.viewerState === 'object'
          ? this._clone(input.viewerState)
          : {},
      layers: Array.isArray(input.layers)
        ? input.layers.map((layer) => this._clone(layer))
        : [],
      annotations: Array.isArray(input.annotations)
        ? input.annotations.map((annotation) => this._clone(annotation))
        : [],
      propertyFieldDefinitions: Array.isArray(input.propertyFieldDefinitions)
        ? input.propertyFieldDefinitions.map((field) => this._clone(field))
        : [],
      updatedAt:
        typeof input.updatedAt === 'string'
          ? input.updatedAt
          : new Date().toISOString(),
    };
  }

  /**
   * Exports annotation properties and preserves layerId.
   * @param {Object} annotation
   * @returns {Object}
   */
  _exportAnnotationProperties(annotation = {}) {
    const properties =
      annotation &&
      annotation.properties &&
      typeof annotation.properties === 'object'
        ? this._clone(annotation.properties)
        : {};

    if (
      annotation.layerId &&
      !Object.prototype.hasOwnProperty.call(properties, 'layerId')
    ) {
      properties.layerId = annotation.layerId;
    }

    return properties;
  }

  /**
   * Normalizes format input.
   * @param {string|undefined} format
   * @returns {string|null}
   */
  _normalizeFormat(format) {
    if (typeof format !== 'string') {
      return null;
    }

    const value = format.trim().toLowerCase();
    if (value === 'geojson' || value === 'trifoglio') {
      return value;
    }

    return null;
  }

  /**
   * Generates identifier with prefix.
   * @param {string} prefix
   * @returns {string}
   */
  _createId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
  }

  /**
   * Performs a JSON-safe deep clone.
   * @param {any} value
   * @returns {any}
   */
  _clone(value) {
    if (value === null || typeof value === 'undefined') {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }
}

export default ImportExportManager;

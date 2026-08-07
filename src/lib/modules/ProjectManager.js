/**
 * @class ProjectManager
 * @description Manages the lifecycle and state boundaries of a Trifoglio project.
 * @emits project:created
 * @emits project:opened
 * @emits project:saved
 * @emits project:closed
 * @emits project:stateChanged
 */
export class ProjectManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'project:created',
    'project:opened',
    'project:saved',
    'project:closed',
    'project:stateChanged',
  ];

  /**
   * @type {string}
   */
  static PROJECT_TYPE = 'TrifoglioProject';

  /**
   * @type {string}
   */
  static PROJECT_VERSION = '1.0.0';

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.storageKey = options.storageKey || 'trifoglio:project:active';
    this.activeProject = null;
    this.projects = new Map();
    this.eventBus = options.eventBus;
  }

  /**
   * Loads a project from object, JSON string, or local storage when source is omitted.
   * @param {Object|string} [source]
   * @returns {Object}
   */
  loadProject(source) {
    let payload = source;

    if (typeof payload === 'undefined' || payload === null) {
      payload = this._readFromStorage();
    }

    const project = this.deserialize(payload);
    this.activeProject = project;
    this.projects.set(project.id, project);

    this._emit('project:opened', {
      projectId: project.id,
      manifest: project.manifest,
    });
    this._emit('project:stateChanged', {
      state: 'opened',
      projectId: project.id,
    });

    return project;
  }

  /**
   * Serializes a project to TrifoglioProject JSON by default, or GeoJSON format.
   * @param {Object} [project]
   * @param {Object} [options]
   * @param {string} [options.format='trifoglio']
   * @returns {string}
   */
  serialize(project, options = {}) {
    const source = project || this.activeProject;
    if (!source) {
      throw new Error('No project available to serialize.');
    }

    const format = options.format || 'trifoglio';
    if (format === 'geojson') {
      return JSON.stringify(this._toGeoJson(source), null, 2);
    }

    return JSON.stringify(this._normalizeProject(source), null, 2);
  }

  /**
   * Deserializes TrifoglioProject or GeoJSON input into canonical project shape.
   * @param {Object|string} payload
   * @returns {Object}
   */
  deserialize(payload) {
    if (payload === null || typeof payload === 'undefined') {
      throw new Error('Cannot deserialize an empty payload.');
    }

    const source = typeof payload === 'string' ? JSON.parse(payload) : payload;

    if (source && source.type === 'FeatureCollection') {
      return this._fromGeoJson(source);
    }

    if (source && source.type === ProjectManager.PROJECT_TYPE) {
      return this._normalizeProject(source);
    }

    // Compatibility path for partially shaped legacy project objects.
    return this._normalizeProject(source);
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Creates a new project.
   * @param {Object} input
   * @returns {Object}
   */
  createProject(input = {}) {
    const project = this._normalizeProject({
      id: input.id,
      name: input.name,
      manifest: input.manifest || input.iiifManifest || null,
      viewerState: input.viewerState,
      layers: input.layers,
      annotations: input.annotations,
      propertyFieldDefinitions: input.propertyFieldDefinitions,
    });

    this.activeProject = project;
    this.projects.set(project.id, project);
    this.saveProject({ persist: true });

    this._emit('project:created', {
      projectId: project.id,
      manifest: project.manifest,
    });
    this._emit('project:stateChanged', {
      state: 'created',
      projectId: project.id,
    });

    return project;
  }

  /**
   * Opens an existing project.
   * @param {Object|string} source
   * @returns {Object}
   */
  openProject(source) {
    return this.loadProject(source);
  }

  /**
   * Saves the current project.
   * @param {Object} [options]
   * @param {boolean} [options.persist=true]
   * @param {string} [options.format='trifoglio']
   * @param {Object} [options.project]
   * @returns {string}
   */
  saveProject(options = {}) {
    const project = options.project || this.activeProject;
    if (!project) {
      throw new Error('No active project to save.');
    }

    const normalized = this._normalizeProject(project);
    this.activeProject = normalized;
    this.projects.set(normalized.id, normalized);

    const format = options.format || 'trifoglio';
    const serialized = this.serialize(normalized, { format: format });

    if (options.persist !== false && format === 'trifoglio') {
      this._writeToStorage(serialized);
    }

    this._emit('project:saved', {
      projectId: normalized.id,
      format: format,
      manifest: normalized.manifest,
    });

    return serialized;
  }

  /**
   * Closes the active project.
   * @returns {void}
   */
  closeProject() {
    if (!this.activeProject) {
      return;
    }

    const projectId = this.activeProject.id;
    this.activeProject = null;

    this._emit('project:closed', { projectId: projectId });
    this._emit('project:stateChanged', {
      state: 'closed',
      projectId: projectId,
    });
  }

  /**
   * Sets the active project reference.
   * @param {string} projectId
   * @returns {void}
   */
  setActiveProject(projectId) {
    if (!this.projects.has(projectId)) {
      return;
    }

    this.activeProject = this.projects.get(projectId);
    this._emit('project:stateChanged', {
      state: 'activeProjectChanged',
      projectId: projectId,
    });
  }

  /**
   * Gets the active project reference.
   * @returns {Object|null}
   */
  getActiveProject() {
    return this.activeProject;
  }

  /**
   * Sets project-level property field definitions used by auto-generated forms.
   * @param {Object[]} definitions
   * @param {Object} [options]
   * @param {boolean} [options.persist=true]
   * @returns {Object[]}
   */
  setPropertyFieldDefinitions(definitions = [], options = {}) {
    if (!this.activeProject) {
      throw new Error('No active project to configure property fields.');
    }

    this.activeProject.propertyFieldDefinitions =
      this._normalizePropertyFieldDefinitions(definitions);

    this._emit('project:stateChanged', {
      state: 'propertyFieldsChanged',
      projectId: this.activeProject.id,
    });

    if (options.persist !== false) {
      this.saveProject({ persist: true, project: this.activeProject });
    }

    return this._deepClone(this.activeProject.propertyFieldDefinitions);
  }

  /**
   * Returns project-level property field definitions.
   * @param {string} [projectId]
   * @returns {Object[]}
   */
  getPropertyFieldDefinitions(projectId) {
    const project = projectId
      ? this.projects.get(projectId)
      : this.activeProject;
    if (!project) {
      return [];
    }

    return this._deepClone(
      this._normalizePropertyFieldDefinitions(project.propertyFieldDefinitions),
    );
  }

  /**
   * Exports a project snapshot.
   * @param {Object} [options]
   * @returns {string}
   */
  exportSnapshot(options = {}) {
    return this.serialize(options.project || this.activeProject, options);
  }

  /**
   * Imports a project snapshot.
   * @param {Object|string} snapshot
   * @returns {Object}
   */
  importSnapshot(snapshot) {
    return this.loadProject(snapshot);
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.activeProject = null;
    this.projects.clear();
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
   * Normalizes project input into the TrifoglioProject shape.
   * @param {Object} input
   * @returns {Object}
   */
  _normalizeProject(input = {}) {
    const id = input.id || this._createId('project');
    const name = input.name || 'Untitled Project';
    const manifest = input.manifest || input.iiifManifest || null;

    return {
      type: ProjectManager.PROJECT_TYPE,
      version: ProjectManager.PROJECT_VERSION,
      id: id,
      name: name,
      manifest: manifest,
      viewerState: input.viewerState || {},
      layers: Array.isArray(input.layers) ? input.layers : [],
      annotations: Array.isArray(input.annotations) ? input.annotations : [],
      propertyFieldDefinitions: this._normalizePropertyFieldDefinitions(
        input.propertyFieldDefinitions,
      ),
      updatedAt: new Date().toISOString(),
    };
  }

  /**
   * Converts a TrifoglioProject object to GeoJSON FeatureCollection.
   * @param {Object} project
   * @returns {Object}
   */
  _toGeoJson(project) {
    const annotations = Array.isArray(project.annotations)
      ? project.annotations
      : [];

    const features = annotations.map((annotation, index) => {
      const geometry =
        annotation && annotation.geometry ? annotation.geometry : null;
      const properties =
        annotation &&
        annotation.properties &&
        typeof annotation.properties === 'object'
          ? annotation.properties
          : {};

      return {
        type: 'Feature',
        id:
          annotation && annotation.id
            ? annotation.id
            : this._createId('feature-' + index),
        geometry: geometry,
        properties: properties,
      };
    });

    return {
      type: 'FeatureCollection',
      features: features,
    };
  }

  /**
   * Converts GeoJSON FeatureCollection to a TrifoglioProject shape.
   * @param {Object} geoJson
   * @returns {Object}
   */
  _fromGeoJson(geoJson) {
    const features = Array.isArray(geoJson.features) ? geoJson.features : [];
    const defaultLayerId = 'layer-default';

    const annotations = features.map((feature, index) => {
      return {
        id:
          feature && feature.id
            ? String(feature.id)
            : this._createId('annotation-' + index),
        geometry: feature && feature.geometry ? feature.geometry : null,
        properties:
          feature &&
          feature.properties &&
          typeof feature.properties === 'object'
            ? feature.properties
            : {},
        layerId: defaultLayerId,
      };
    });

    return this._normalizeProject({
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
        },
      ],
      annotations: annotations,
      propertyFieldDefinitions: [],
    });
  }

  /**
   * Normalizes metadata field definitions.
   * @param {Object[]|undefined} definitions
   * @returns {Object[]}
   */
  _normalizePropertyFieldDefinitions(definitions) {
    if (!Array.isArray(definitions)) {
      return [];
    }

    return definitions
      .filter((field) => field && typeof field === 'object')
      .map((field, index) => {
        const key =
          typeof field.key === 'string' && field.key.trim()
            ? field.key.trim()
            : 'field_' + index;

        return {
          key: key,
          label:
            typeof field.label === 'string' && field.label.trim()
              ? field.label.trim()
              : key,
          type:
            typeof field.type === 'string' && field.type.trim()
              ? field.type.trim()
              : 'text',
          required: Boolean(field.required),
          placeholder:
            typeof field.placeholder === 'string' ? field.placeholder : '',
          options: Array.isArray(field.options)
            ? field.options.map((option) => String(option))
            : [],
          defaultValue:
            field.defaultValue === null ||
            typeof field.defaultValue === 'undefined'
              ? ''
              : String(field.defaultValue),
        };
      });
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
   * Generates an identifier with a prefix.
   * @param {string} prefix
   * @returns {string}
   */
  _createId(prefix) {
    return prefix + '-' + Date.now() + '-' + Math.floor(Math.random() * 100000);
  }

  /**
   * Writes serialized project data to local storage.
   * @param {string} serialized
   * @returns {void}
   */
  _writeToStorage(serialized) {
    if (typeof localStorage === 'undefined') {
      return;
    }

    localStorage.setItem(this.storageKey, serialized);
  }

  /**
   * Reads serialized project data from local storage.
   * @returns {string|null}
   */
  _readFromStorage() {
    if (typeof localStorage === 'undefined') {
      return null;
    }

    return localStorage.getItem(this.storageKey);
  }
}

export default ProjectManager;

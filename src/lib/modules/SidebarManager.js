/**
 * @class SidebarManager
 * @description Coordinates sidebar UI state and section rendering boundaries.
 * @emits sidebar:opened
 * @emits sidebar:closed
 * @emits sidebar:sectionChanged
 */
export class SidebarManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'sidebar:opened',
    'sidebar:closed',
    'sidebar:sectionChanged',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.map = options.map || null;
    this.viewerManager = options.viewerManager || null;
    this.isOpen = false;

    this.model = {
      sections: [
        { id: 'project', label: 'Projet' },
        { id: 'layers', label: 'Couches' },
        { id: 'annotations', label: 'Annotations' },
      ],
      activeSectionId: 'project',
      project: null,
      layers: [],
      annotations: [],
      selection: {
        selectedAnnotationId: null,
      },
    };

    // Extension points to plug advanced interactions without changing core API.
    this.interactions = {
      dragDrop: null,
      rename: null,
      contextMenu: null,
    };

    this._projectCreatedHandler = (payload) => {
      const project = payload && payload.project ? payload.project : payload;
      this.updateProjectSummary(project || null);
    };
    this._projectOpenedHandler = (payload) => {
      const project = payload && payload.project ? payload.project : payload;
      this.updateProjectSummary(project || null);
    };
    this._layerCreatedHandler = (payload) => {
      if (!payload || !payload.layer) {
        return;
      }

      this.model.layers = this._upsertById(this.model.layers, payload.layer);
    };
    this._layerUpdatedHandler = (payload) => {
      if (!payload || !payload.layer) {
        return;
      }

      this.model.layers = this._upsertById(this.model.layers, payload.layer);
    };
    this._layerDeletedHandler = (payload) => {
      const layerId = payload ? payload.layerId : null;
      if (!layerId) {
        return;
      }

      this.model.layers = this.model.layers.filter(
        (layer) => layer.id !== layerId,
      );
    };
    this._layerOrderChangedHandler = (payload) => {
      if (payload && Array.isArray(payload.layers)) {
        this.updateLayerTree(payload.layers);
      }
    };
    this._annotationCreatedHandler = (payload) => {
      if (!payload || !payload.annotation) {
        return;
      }

      this.model.annotations = this._upsertById(
        this.model.annotations,
        payload.annotation,
      );
    };
    this._annotationUpdatedHandler = (payload) => {
      if (!payload || !payload.annotation) {
        return;
      }

      this.model.annotations = this._upsertById(
        this.model.annotations,
        payload.annotation,
      );
    };
    this._annotationDeletedHandler = (payload) => {
      const annotationId = payload ? payload.annotationId : null;
      if (!annotationId) {
        return;
      }

      this.model.annotations = this.model.annotations.filter(
        (annotation) => annotation.id !== annotationId,
      );

      if (this.model.selection.selectedAnnotationId === annotationId) {
        this.updateSelectionState({ selectedAnnotationId: null });
      }
    };
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {
    if (!this.eventBus || typeof this.eventBus.on !== 'function') {
      return;
    }

    this.eventBus.on('project:created', this._projectCreatedHandler);
    this.eventBus.on('project:opened', this._projectOpenedHandler);
    this.eventBus.on('layer:created', this._layerCreatedHandler);
    this.eventBus.on('layer:updated', this._layerUpdatedHandler);
    this.eventBus.on('layer:deleted', this._layerDeletedHandler);
    this.eventBus.on('layer:orderChanged', this._layerOrderChangedHandler);
    this.eventBus.on('annotation:created', this._annotationCreatedHandler);
    this.eventBus.on('annotation:updated', this._annotationUpdatedHandler);
    this.eventBus.on('annotation:deleted', this._annotationDeletedHandler);
  }

  /**
   * Opens the sidebar.
   * @returns {void}
   */
  open() {
    if (this.isOpen) {
      return;
    }

    this.isOpen = true;
    this._emit('sidebar:opened', {
      model: this.getState(),
    });
  }

  /**
   * Closes the sidebar.
   * @returns {void}
   */
  close() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this._emit('sidebar:closed', {
      model: this.getState(),
    });
  }

  /**
   * Toggles sidebar visibility.
   * @returns {void}
   */
  toggle() {
    if (this.isOpen) {
      this.close();
      return;
    }

    this.open();
  }

  /**
   * Renders sidebar sections.
   * @param {Object} model
   * @returns {void}
   */
  renderSections(model = {}) {
    if (Array.isArray(model.sections)) {
      this.model.sections = model.sections.map((section) => ({
        id: section.id,
        label: section.label,
      }));
    }

    if (model.activeSectionId) {
      this.model.activeSectionId = model.activeSectionId;
      this._emit('sidebar:sectionChanged', {
        sectionId: this.model.activeSectionId,
      });
    }

    if (Object.prototype.hasOwnProperty.call(model, 'project')) {
      this.updateProjectSummary(model.project);
    }

    if (Object.prototype.hasOwnProperty.call(model, 'layers')) {
      this.updateLayerTree(model.layers);
    }

    if (Object.prototype.hasOwnProperty.call(model, 'annotations')) {
      const annotations = Array.isArray(model.annotations)
        ? model.annotations
        : [];
      this.model.annotations = annotations.map((annotation) =>
        this._clone(annotation),
      );
    }

    if (Object.prototype.hasOwnProperty.call(model, 'selection')) {
      this.updateSelectionState(model.selection);
    }

    return this.getState();
  }

  /**
   * Updates project summary section.
   * @param {Object} summary
   * @returns {void}
   */
  updateProjectSummary(summary) {
    this.model.project = summary ? this._clone(summary) : null;
    return this.getState();
  }

  /**
   * Updates layer tree section.
   * @param {Object} tree
   * @returns {void}
   */
  updateLayerTree(tree) {
    const layers = Array.isArray(tree) ? tree : [];
    this.model.layers = layers.map((layer) => this._clone(layer));
    this.model.layers.sort(
      (a, b) => this._resolveOrder(a) - this._resolveOrder(b),
    );
    return this.getState();
  }

  /**
   * Updates selection state section.
   * @param {Object} selection
   * @returns {void}
   */
  updateSelectionState(selection = {}) {
    const selectedAnnotationId = Object.prototype.hasOwnProperty.call(
      selection,
      'selectedAnnotationId',
    )
      ? selection.selectedAnnotationId
      : this.model.selection.selectedAnnotationId;

    this.model.selection = {
      selectedAnnotationId: selectedAnnotationId || null,
    };

    return this.getState();
  }

  /**
   * Handles annotation click from the sidebar and centers map when possible.
   * @param {string} annotationId
   * @returns {{annotation: Object|null, center: {lat: number, lng: number}|null}}
   */
  clickAnnotation(annotationId) {
    const annotation = this.model.annotations.find(
      (item) => item && item.id === annotationId,
    );

    if (!annotation) {
      return {
        annotation: null,
        center: null,
      };
    }

    this.model.activeSectionId = 'annotations';
    this.updateSelectionState({ selectedAnnotationId: annotationId });

    const center = this._getGeometryCenter(annotation.geometry);
    this._centerMap(center);

    this._emit('sidebar:sectionChanged', {
      sectionId: 'annotations',
      annotationId: annotationId,
      center: center,
    });

    return {
      annotation: this._clone(annotation),
      center: center,
    };
  }

  /**
   * Registers an interaction adapter for future UI features.
   * @param {'dragDrop'|'rename'|'contextMenu'} type
   * @param {Object|null} adapter
   * @returns {void}
   */
  registerInteractionAdapter(type, adapter) {
    if (!Object.prototype.hasOwnProperty.call(this.interactions, type)) {
      throw new Error('Unknown interaction adapter type: ' + type);
    }

    this.interactions[type] = adapter || null;
  }

  /**
   * Returns interaction capabilities currently plugged into the manager.
   * @returns {{dragDrop: boolean, rename: boolean, contextMenu: boolean}}
   */
  getInteractionCapabilities() {
    return {
      dragDrop: Boolean(this.interactions.dragDrop),
      rename: Boolean(this.interactions.rename),
      contextMenu: Boolean(this.interactions.contextMenu),
    };
  }

  /**
   * Returns a snapshot of sidebar state.
   * @returns {Object}
   */
  getState() {
    return this._clone({
      isOpen: this.isOpen,
      sections: this.model.sections,
      activeSectionId: this.model.activeSectionId,
      project: this.model.project,
      layers: this.model.layers,
      annotations: this.model.annotations,
      selection: this.model.selection,
      capabilities: this.getInteractionCapabilities(),
    });
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    if (this.eventBus && typeof this.eventBus.off === 'function') {
      this.eventBus.off('project:created', this._projectCreatedHandler);
      this.eventBus.off('project:opened', this._projectOpenedHandler);
      this.eventBus.off('layer:created', this._layerCreatedHandler);
      this.eventBus.off('layer:updated', this._layerUpdatedHandler);
      this.eventBus.off('layer:deleted', this._layerDeletedHandler);
      this.eventBus.off('layer:orderChanged', this._layerOrderChangedHandler);
      this.eventBus.off('annotation:created', this._annotationCreatedHandler);
      this.eventBus.off('annotation:updated', this._annotationUpdatedHandler);
      this.eventBus.off('annotation:deleted', this._annotationDeletedHandler);
    }

    this.isOpen = false;
    this.model.project = null;
    this.model.layers = [];
    this.model.annotations = [];
    this.model.selection = { selectedAnnotationId: null };
    this.interactions.dragDrop = null;
    this.interactions.rename = null;
    this.interactions.contextMenu = null;
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
   * Returns a normalized ordering value.
   * @param {Object} layer
   * @returns {number}
   */
  _resolveOrder(layer) {
    if (layer && typeof layer.order === 'number') {
      return layer.order;
    }

    if (layer && typeof layer.ordre === 'number') {
      return layer.ordre;
    }

    return 0;
  }

  /**
   * Inserts or replaces one item by id.
   * @param {Object[]} list
   * @param {Object} value
   * @returns {Object[]}
   */
  _upsertById(list, value) {
    const source = Array.isArray(list) ? list : [];
    const next = source.slice();
    const index = next.findIndex((item) => item && item.id === value.id);
    const clone = this._clone(value);

    if (index >= 0) {
      next[index] = clone;
      return next;
    }

    next.push(clone);
    return next;
  }

  /**
   * Computes geometry center from GeoJSON coordinates.
   * @param {Object|null} geometry
   * @returns {{lat: number, lng: number}|null}
   */
  _getGeometryCenter(geometry) {
    if (!geometry || typeof geometry !== 'object') {
      return null;
    }

    if (geometry.type === 'Point' && Array.isArray(geometry.coordinates)) {
      const point = geometry.coordinates;
      if (point.length >= 2) {
        return {
          lng: Number(point[0]),
          lat: Number(point[1]),
        };
      }
    }

    const coordinates = this._extractCoordinatePairs(geometry.coordinates);
    if (!coordinates.length) {
      return null;
    }

    let minLng = Infinity;
    let minLat = Infinity;
    let maxLng = -Infinity;
    let maxLat = -Infinity;

    coordinates.forEach((pair) => {
      const lng = Number(pair[0]);
      const lat = Number(pair[1]);

      if (Number.isNaN(lng) || Number.isNaN(lat)) {
        return;
      }

      minLng = Math.min(minLng, lng);
      minLat = Math.min(minLat, lat);
      maxLng = Math.max(maxLng, lng);
      maxLat = Math.max(maxLat, lat);
    });

    if (
      !Number.isFinite(minLng) ||
      !Number.isFinite(minLat) ||
      !Number.isFinite(maxLng) ||
      !Number.isFinite(maxLat)
    ) {
      return null;
    }

    return {
      lat: (minLat + maxLat) / 2,
      lng: (minLng + maxLng) / 2,
    };
  }

  /**
   * Extracts [lng, lat] coordinate pairs from nested arrays.
   * @param {any} coordinates
   * @returns {number[][]}
   */
  _extractCoordinatePairs(coordinates) {
    if (!Array.isArray(coordinates)) {
      return [];
    }

    if (
      coordinates.length >= 2 &&
      typeof coordinates[0] === 'number' &&
      typeof coordinates[1] === 'number'
    ) {
      return [[coordinates[0], coordinates[1]]];
    }

    const pairs = [];
    coordinates.forEach((child) => {
      pairs.push(...this._extractCoordinatePairs(child));
    });

    return pairs;
  }

  /**
   * Centers map on coordinates when a map interface is available.
   * @param {{lat: number, lng: number}|null} center
   * @returns {void}
   */
  _centerMap(center) {
    if (!center) {
      return;
    }

    const map = this._resolveMap();
    if (!map || typeof map.setView !== 'function') {
      return;
    }

    const zoom =
      typeof map.getZoom === 'function' && Number.isFinite(map.getZoom())
        ? Number(map.getZoom())
        : undefined;

    if (typeof zoom === 'number') {
      map.setView([center.lat, center.lng], zoom);
      return;
    }

    map.setView([center.lat, center.lng]);
  }

  /**
   * Resolves map instance from explicit map or viewer manager.
   * @returns {Object|null}
   */
  _resolveMap() {
    if (this.map) {
      return this.map;
    }

    if (this.viewerManager && this.viewerManager.map) {
      return this.viewerManager.map;
    }

    if (this.options && typeof this.options.getMap === 'function') {
      return this.options.getMap() || null;
    }

    return null;
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

export default SidebarManager;

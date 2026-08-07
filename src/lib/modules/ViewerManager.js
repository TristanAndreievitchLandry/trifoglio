/**
 * @class ViewerManager
 * @description Coordinates rendering concerns for Leaflet and IIIF visualization.
 * @emits viewer:initialized
 * @emits viewer:manifestLoaded
 * @emits viewer:canvasChanged
 * @emits viewer:stateChanged
 */
export class ViewerManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'viewer:initialized',
    'viewer:manifestLoaded',
    'viewer:canvasChanged',
    'viewer:stateChanged',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.map = null;
    this.viewerState = {
      center: options.defaultCenter || { lat: 0, lng: 0 },
      zoom: typeof options.defaultZoom === 'number' ? options.defaultZoom : 0,
      rotation:
        typeof options.defaultRotation === 'number'
          ? options.defaultRotation
          : 0,
    };
    this._projectOpenedHandler = this._onProjectOpened.bind(this);
  }

  /**
   * Initializes the viewer manager.
   * @returns {void}
   */
  initialize() {
    if (this.eventBus && typeof this.eventBus.on === 'function') {
      this.eventBus.on('project:opened', this._projectOpenedHandler);
    }

    this._emit('viewer:initialized', { viewerState: this.serializeViewer() });
  }

  /**
   * Attaches the map instance.
   * @param {Object} mapInstance
   * @returns {void}
   */
  attachMap(mapInstance) {
    this.map = mapInstance || null;

    if (this.map && typeof this.map.getCenter === 'function') {
      const center = this.map.getCenter();
      this.viewerState.center = {
        lat: Number(center.lat),
        lng: Number(center.lng),
      };
    }

    if (this.map && typeof this.map.getZoom === 'function') {
      this.viewerState.zoom = Number(this.map.getZoom());
    }

    if (this.map && typeof this.map.getBearing === 'function') {
      this.viewerState.rotation = Number(this.map.getBearing());
    }

    this._emit('viewer:stateChanged', { viewerState: this.serializeViewer() });
  }

  /**
   * Loads an IIIF manifest into the viewer.
   * @param {string} manifestUrl
   * @returns {void}
   */
  loadManifest(manifestUrl) {
    this._emit('viewer:manifestLoaded', { manifestUrl: manifestUrl });
  }

  /**
   * Sets the active canvas.
   * @param {string} canvasId
   * @returns {void}
   */
  setCanvas(canvasId) {
    this._emit('viewer:canvasChanged', { canvasId: canvasId });
  }

  /**
   * Sets the active basemap style.
   * @param {string} styleId
   * @returns {void}
   */
  setBasemapStyle(styleId) {
    this._emit('viewer:stateChanged', {
      basemapStyle: styleId,
      viewerState: this.serializeViewer(),
    });
  }

  /**
   * Returns the current viewer state.
   * @returns {void}
   */
  getViewerState() {
    return this.serializeViewer();
  }

  /**
   * Applies a viewer state snapshot.
   * @param {Object} viewerState
   * @returns {void}
   */
  applyViewerState(viewerState) {
    this.restoreViewer(viewerState);
  }

  /**
   * Serializes current viewer state.
   * @returns {{center: {lat: number, lng: number}, zoom: number, rotation: number}}
   */
  serializeViewer() {
    return {
      center: {
        lat: Number(this.viewerState.center.lat),
        lng: Number(this.viewerState.center.lng),
      },
      zoom: Number(this.viewerState.zoom),
      rotation: Number(this.viewerState.rotation || 0),
    };
  }

  /**
   * Restores viewer state (center, zoom, optional rotation).
   * @param {Object} viewerState
   * @returns {{center: {lat: number, lng: number}, zoom: number, rotation: number}}
   */
  restoreViewer(viewerState = {}) {
    const nextCenter = viewerState.center || this.viewerState.center;
    const nextZoom =
      typeof viewerState.zoom === 'number'
        ? viewerState.zoom
        : this.viewerState.zoom;
    const nextRotation =
      typeof viewerState.rotation === 'number'
        ? viewerState.rotation
        : this.viewerState.rotation;

    this.viewerState = {
      center: {
        lat: Number(nextCenter.lat),
        lng: Number(nextCenter.lng),
      },
      zoom: Number(nextZoom),
      rotation: Number(nextRotation || 0),
    };

    if (this.map && typeof this.map.setView === 'function') {
      this.map.setView(
        [this.viewerState.center.lat, this.viewerState.center.lng],
        this.viewerState.zoom,
      );
    }

    // Optional rotation support for viewers/plugins exposing setBearing.
    if (this.map && typeof this.map.setBearing === 'function') {
      this.map.setBearing(this.viewerState.rotation);
    }

    const serialized = this.serializeViewer();
    this._emit('viewer:stateChanged', { viewerState: serialized });
    return serialized;
  }

  /**
   * Clears the current document from the viewer.
   * @returns {void}
   */
  clearDocument() {
    this.viewerState = {
      center: { lat: 0, lng: 0 },
      zoom: 0,
      rotation: 0,
    };

    this._emit('viewer:stateChanged', { viewerState: this.serializeViewer() });
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    if (this.eventBus && typeof this.eventBus.off === 'function') {
      this.eventBus.off('project:opened', this._projectOpenedHandler);
    }

    this.map = null;
  }

  /**
   * Restores viewer state after project opening when present in payload.
   * @param {Object} payload
   * @returns {void}
   */
  _onProjectOpened(payload = {}) {
    const source =
      payload.viewerState ||
      (payload.project && payload.project.viewerState) ||
      null;

    if (!source) {
      return;
    }

    this.restoreViewer(source);
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
}

export default ViewerManager;

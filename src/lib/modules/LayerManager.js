/**
 * @class LayerManager
 * @description Manages logical grouping and organization of annotations in layers.
 * @emits layer:created
 * @emits layer:renamed
 * @emits layer:updated
 * @emits layer:deleted
 * @emits layer:orderChanged
 */
export class LayerManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'layer:created',
    'layer:renamed',
    'layer:updated',
    'layer:deleted',
    'layer:orderChanged',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.layers = new Map();
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Creates a new layer.
   * @param {Object} input
   * @returns {void}
   */
  createLayer(input = {}) {
    const id = input.id || this._createLayerId();
    const order =
      typeof input.order === 'number' ? input.order : this.layers.size;
    const visible = typeof input.visible === 'boolean' ? input.visible : true;
    const locked =
      typeof input.locked === 'boolean'
        ? input.locked
        : typeof input.verrouillee === 'boolean'
          ? input.verrouillee
          : false;
    const color =
      typeof input.color === 'string'
        ? input.color
        : typeof input.couleur === 'string'
          ? input.couleur
          : null;
    const name =
      typeof input.name === 'string'
        ? input.name
        : typeof input.nom === 'string'
          ? input.nom
          : 'Layer';

    const layer = {
      id: id,
      name: name,
      nom: name,
      visible: visible,
      locked: locked,
      verrouillee: locked,
      color: color,
      couleur: color,
      order: order,
      ordre: order,
      annotationIds: Array.isArray(input.annotationIds)
        ? [...new Set(input.annotationIds)]
        : [],
    };

    this.layers.set(id, layer);
    this._normalizeOrders();

    this._emit('layer:created', {
      layerId: id,
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Toggles layer visibility.
   * @param {string} layerId
   * @returns {Object|null}
   */
  toggleVisibility(layerId) {
    const layer = this.layers.get(layerId);
    if (!layer) {
      return null;
    }

    layer.visible = !layer.visible;
    this._emit('layer:updated', {
      layerId: layerId,
      field: 'visible',
      value: layer.visible,
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Locks or unlocks a layer.
   * @param {string} layerId
   * @param {boolean} [locked=true]
   * @returns {Object|null}
   */
  lockLayer(layerId, locked = true) {
    const layer = this.layers.get(layerId);
    if (!layer) {
      return null;
    }

    layer.locked = Boolean(locked);
    layer.verrouillee = layer.locked;

    this._emit('layer:updated', {
      layerId: layerId,
      field: 'locked',
      value: layer.locked,
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Moves a layer to a target order index.
   * @param {string} layerId
   * @param {number} targetOrder
   * @returns {Object|null}
   */
  moveLayer(layerId, targetOrder) {
    const items = this._orderedLayers();
    const currentIndex = items.findIndex((item) => item.id === layerId);
    if (currentIndex < 0) {
      return null;
    }

    const boundedIndex = this._clamp(
      Math.trunc(Number(targetOrder)),
      0,
      items.length - 1,
    );
    const [moved] = items.splice(currentIndex, 1);
    items.splice(boundedIndex, 0, moved);

    items.forEach((layer, index) => {
      layer.order = index;
      layer.ordre = index;
      this.layers.set(layer.id, layer);
    });

    this._emit('layer:orderChanged', {
      layerId: layerId,
      order: boundedIndex,
      layers: items.map((layer) => this._clone(layer)),
    });

    return this._clone(this.layers.get(layerId));
  }

  /**
   * Changes layer order.
   * @param {string} layerId
   * @param {number} targetIndex
   * @returns {void}
   */
  reorderLayer(layerId, targetIndex) {
    return this.moveLayer(layerId, targetIndex);
  }

  /**
   * Sets layer visibility.
   * @param {string} layerId
   * @param {boolean} visible
   * @returns {void}
   */
  setLayerVisibility(layerId, visible) {
    const layer = this.layers.get(layerId);
    if (!layer) {
      return null;
    }

    layer.visible = Boolean(visible);
    this._emit('layer:updated', {
      layerId: layerId,
      field: 'visible',
      value: layer.visible,
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Sets layer lock state.
   * @param {string} layerId
   * @param {boolean} locked
   * @returns {void}
   */
  setLayerLock(layerId, locked) {
    return this.lockLayer(layerId, locked);
  }

  /**
   * Sets layer color.
   * @param {string} layerId
   * @param {string} color
   * @returns {void}
   */
  setLayerColor(layerId, color) {
    const layer = this.layers.get(layerId);
    if (!layer) {
      return null;
    }

    layer.color = typeof color === 'string' ? color : null;
    layer.couleur = layer.color;

    this._emit('layer:updated', {
      layerId: layerId,
      field: 'color',
      value: layer.color,
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Adds an annotation to a layer.
   * @param {string} layerId
   * @param {string} annotationId
   * @returns {void}
   */
  addAnnotation(layerId, annotationId) {
    const layer = this.layers.get(layerId);
    if (!layer || !annotationId) {
      return null;
    }

    if (!layer.annotationIds.includes(annotationId)) {
      layer.annotationIds.push(annotationId);
      this._emit('layer:updated', {
        layerId: layerId,
        field: 'annotationIds',
        layer: this._clone(layer),
      });
    }

    return this._clone(layer);
  }

  /**
   * Removes an annotation from a layer.
   * @param {string} layerId
   * @param {string} annotationId
   * @returns {void}
   */
  removeAnnotation(layerId, annotationId) {
    const layer = this.layers.get(layerId);
    if (!layer || !annotationId) {
      return null;
    }

    layer.annotationIds = layer.annotationIds.filter(
      (id) => id !== annotationId,
    );
    this._emit('layer:updated', {
      layerId: layerId,
      field: 'annotationIds',
      layer: this._clone(layer),
    });

    return this._clone(layer);
  }

  /**
   * Deletes a layer.
   * @param {string} layerId
   * @returns {void}
   */
  deleteLayer(layerId) {
    if (!this.layers.has(layerId)) {
      return false;
    }

    this.layers.delete(layerId);
    this._normalizeOrders();

    this._emit('layer:deleted', { layerId: layerId });
    return true;
  }

  /**
   * Lists layers.
   * @returns {void}
   */
  listLayers() {
    return this._orderedLayers().map((layer) => this._clone(layer));
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.layers.clear();
  }

  /**
   * Renames a layer.
   * @param {string} layerId
   * @param {string} name
   * @returns {Object|null}
   */
  renameLayer(layerId, name) {
    const layer = this.layers.get(layerId);
    if (!layer) {
      return null;
    }

    const nextName = typeof name === 'string' ? name : String(name || '');
    layer.name = nextName;
    layer.nom = nextName;

    this._emit('layer:renamed', {
      layerId: layerId,
      name: nextName,
      layer: this._clone(layer),
    });

    return this._clone(layer);
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
   * Returns layers ordered by order/ordre index.
   * @returns {Object[]}
   */
  _orderedLayers() {
    return Array.from(this.layers.values()).sort((a, b) => a.order - b.order);
  }

  /**
   * Reassigns order indices to remain contiguous.
   * @returns {void}
   */
  _normalizeOrders() {
    const ordered = this._orderedLayers();
    ordered.forEach((layer, index) => {
      layer.order = index;
      layer.ordre = index;
      this.layers.set(layer.id, layer);
    });
  }

  /**
   * Clamps number between min and max.
   * @param {number} value
   * @param {number} min
   * @param {number} max
   * @returns {number}
   */
  _clamp(value, min, max) {
    if (Number.isNaN(value)) {
      return min;
    }

    return Math.max(min, Math.min(max, value));
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

  /**
   * Generates a unique layer identifier.
   * @returns {string}
   */
  _createLayerId() {
    let candidate = '';

    do {
      candidate =
        'layer-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    } while (this.layers.has(candidate));

    return candidate;
  }
}

export default LayerManager;

/**
 * @class AnnotationManager
 * @description Manages annotation lifecycle operations independent of geometry type.
 * @emits annotation:created
 * @emits annotation:updated
 * @emits annotation:deleted
 * @emits annotation:selected
 * @emits annotation:deselected
 */
export class AnnotationManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'annotation:created',
    'annotation:updated',
    'annotation:deleted',
    'annotation:duplicated',
    'annotation:selected',
    'annotation:deselected',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.annotations = new Map();
    this.selectedAnnotationId = null;
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Creates a new annotation.
   * @param {Object} input
   * @returns {void}
   */
  createAnnotation(input = {}) {
    const annotation = {
      id: input.id || this.generateUniqueId(),
      geometry: input.geometry || null,
      properties:
        input.properties && typeof input.properties === 'object'
          ? this._deepClone(input.properties)
          : {},
    };

    this.annotations.set(annotation.id, annotation);
    this._emit('annotation:created', {
      annotationId: annotation.id,
      annotation: this._deepClone(annotation),
    });

    return this._deepClone(annotation);
  }

  /**
   * Updates annotation data.
   * @param {string} annotationId
   * @param {Object} patch
   * @returns {Object|null}
   */
  updateAnnotation(annotationId, patch = {}) {
    const current = this.annotations.get(annotationId);
    if (!current) {
      return null;
    }

    const next = {
      id: current.id,
      geometry: Object.prototype.hasOwnProperty.call(patch, 'geometry')
        ? patch.geometry
        : current.geometry,
      properties:
        Object.prototype.hasOwnProperty.call(patch, 'properties') &&
        patch.properties &&
        typeof patch.properties === 'object'
          ? this._deepClone(patch.properties)
          : this._deepClone(current.properties),
    };

    this.annotations.set(annotationId, next);
    this._emit('annotation:updated', {
      annotationId: annotationId,
      annotation: this._deepClone(next),
    });

    return this._deepClone(next);
  }

  /**
   * Updates annotation geometry.
   * @param {string} annotationId
   * @param {Object} geometry
   * @returns {void}
   */
  updateAnnotationGeometry(annotationId, geometry) {
    return this.updateAnnotation(annotationId, { geometry: geometry });
  }

  /**
   * Updates annotation properties.
   * @param {string} annotationId
   * @param {Object} properties
   * @returns {void}
   */
  updateAnnotationProperties(annotationId, properties) {
    return this.updateAnnotation(annotationId, { properties: properties });
  }

  /**
   * Deletes an annotation.
   * @param {string} annotationId
   * @returns {void}
   */
  deleteAnnotation(annotationId) {
    const existing = this.annotations.get(annotationId);
    if (!existing) {
      return null;
    }

    this.annotations.delete(annotationId);

    if (this.selectedAnnotationId === annotationId) {
      this.selectedAnnotationId = null;
      this._emit('annotation:deselected', { annotationId: annotationId });
    }

    this._emit('annotation:deleted', {
      annotationId: annotationId,
      annotation: this._deepClone(existing),
    });

    return this._deepClone(existing);
  }

  /**
   * Duplicates an existing annotation with a new unique ID.
   * @param {string} annotationId
   * @returns {Object|null}
   */
  duplicateAnnotation(annotationId) {
    const source = this.annotations.get(annotationId);
    if (!source) {
      return null;
    }

    const duplicated = {
      id: this.generateUniqueId(),
      geometry: this._deepClone(source.geometry),
      properties: this._deepClone(source.properties),
    };

    this.annotations.set(duplicated.id, duplicated);
    this._emit('annotation:duplicated', {
      sourceAnnotationId: annotationId,
      annotationId: duplicated.id,
      annotation: this._deepClone(duplicated),
    });
    this._emit('annotation:created', {
      annotationId: duplicated.id,
      annotation: this._deepClone(duplicated),
    });

    return this._deepClone(duplicated);
  }

  /**
   * Retrieves one annotation by ID.
   * @param {string} annotationId
   * @returns {Object|null}
   */
  getAnnotation(annotationId) {
    const annotation = this.annotations.get(annotationId);
    return annotation ? this._deepClone(annotation) : null;
  }

  /**
   * Selects an annotation.
   * @param {string} annotationId
   * @returns {void}
   */
  selectAnnotation(annotationId) {
    if (!this.annotations.has(annotationId)) {
      return null;
    }

    this.selectedAnnotationId = annotationId;
    this._emit('annotation:selected', { annotationId: annotationId });
    return this.getAnnotation(annotationId);
  }

  /**
   * Clears annotation selection.
   * @returns {void}
   */
  clearSelection() {
    if (!this.selectedAnnotationId) {
      return;
    }

    const annotationId = this.selectedAnnotationId;
    this.selectedAnnotationId = null;
    this._emit('annotation:deselected', { annotationId: annotationId });
  }

  /**
   * Lists annotations.
   * @param {Object} [filters]
   * @returns {void}
   */
  listAnnotations(filters = {}) {
    const list = Array.from(this.annotations.values());
    const filtered = this._applyFilters(list, filters);
    return filtered.map((annotation) => this._deepClone(annotation));
  }

  /**
   * Assigns an annotation to a layer.
   * @param {string} annotationId
   * @param {string} layerId
   * @returns {void}
   */
  attachLayer(annotationId, layerId) {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) {
      return null;
    }

    const nextProperties = {
      ...(annotation.properties || {}),
      layerId: layerId,
    };

    return this.updateAnnotation(annotationId, {
      properties: nextProperties,
    });
  }

  /**
   * Removes an annotation from a layer.
   * @param {string} annotationId
   * @param {string} layerId
   * @returns {void}
   */
  detachLayer(annotationId, layerId) {
    const annotation = this.annotations.get(annotationId);
    if (!annotation) {
      return null;
    }

    const currentLayerId = annotation.properties
      ? annotation.properties.layerId
      : undefined;
    if (currentLayerId !== layerId) {
      return this.getAnnotation(annotationId);
    }

    const nextProperties = { ...(annotation.properties || {}) };
    delete nextProperties.layerId;

    return this.updateAnnotation(annotationId, {
      properties: nextProperties,
    });
  }

  /**
   * Generates a unique annotation identifier.
   * @returns {string}
   */
  generateUniqueId() {
    let candidate = '';

    do {
      candidate =
        'annotation-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
    } while (this.annotations.has(candidate));

    return candidate;
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.annotations.clear();
    this.selectedAnnotationId = null;
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
   * Applies optional in-memory filters to annotation lists.
   * @param {Object[]} annotations
   * @param {Object} filters
   * @returns {Object[]}
   */
  _applyFilters(annotations, filters) {
    const keys = Object.keys(filters || {});
    if (keys.length === 0) {
      return annotations;
    }

    return annotations.filter((annotation) => {
      return keys.every((key) => {
        if (key === 'id') {
          return annotation.id === filters.id;
        }

        if (key === 'geometryType') {
          return (
            annotation.geometry &&
            annotation.geometry.type === filters.geometryType
          );
        }

        if (key === 'propertyKey') {
          const propertyKey = filters.propertyKey;
          return (
            annotation.properties &&
            Object.prototype.hasOwnProperty.call(
              annotation.properties,
              propertyKey,
            )
          );
        }

        return true;
      });
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
}

export default AnnotationManager;

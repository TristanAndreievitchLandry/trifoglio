/**
 * @class SearchManager
 * @description Defines search and filtering boundaries over project annotations.
 * @emits search:started
 * @emits search:completed
 * @emits search:filtersChanged
 */
export class SearchManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'search:started',
    'search:completed',
    'search:filtersChanged',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.annotations = [];
    this.activeFilters = {
      layerId: null,
    };
    this.lastResults = [];
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Indexes project data for search.
   * @param {Object} project
   * @returns {void}
   */
  indexProject(project = {}) {
    const annotations = Array.isArray(project.annotations)
      ? project.annotations
      : [];

    this.annotations = annotations.map((annotation) => this._clone(annotation));
    return this.annotations.map((annotation) => this._clone(annotation));
  }

  /**
   * Searches annotations.
   * @param {Object} criteria
   * @returns {void}
   */
  searchAnnotations(criteria = {}) {
    const normalizedCriteria = this._normalizeCriteria(criteria);

    this._emit('search:started', {
      criteria: this._clone(normalizedCriteria),
    });

    const results = this.annotations.filter((annotation) => {
      if (!this._matchesLayerFilter(annotation)) {
        return false;
      }

      return this._matchesAnnotation(annotation, normalizedCriteria);
    });

    this.lastResults = results.map((annotation) => this._clone(annotation));

    const payload = {
      criteria: this._clone(normalizedCriteria),
      total: this.lastResults.length,
      annotations: this.lastResults.map((annotation) =>
        this._clone(annotation),
      ),
    };

    this._emit('search:completed', payload);
    return payload.annotations;
  }

  /**
   * Searches annotation metadata.
   * @param {Object} criteria
   * @returns {void}
   */
  searchMetadata(criteria = {}) {
    const query =
      typeof criteria.query === 'string'
        ? criteria.query
        : typeof criteria.text === 'string'
          ? criteria.text
          : '';

    const metadataCriteria = {
      ...criteria,
      fields: ['metadata'],
      query: query,
    };

    return this.searchAnnotations(metadataCriteria);
  }

  /**
   * Filters annotations by layer.
   * @param {string} layerId
   * @returns {void}
   */
  filterByLayer(layerId) {
    this.activeFilters.layerId = layerId || null;

    this._emit('search:filtersChanged', {
      filters: this.getFilters(),
    });

    return this.getFilters();
  }

  /**
   * Clears active filters.
   * @returns {void}
   */
  clearFilters() {
    this.activeFilters.layerId = null;
    this._emit('search:filtersChanged', {
      filters: this.getFilters(),
    });

    return this.getFilters();
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.annotations = [];
    this.lastResults = [];
    this.activeFilters.layerId = null;
  }

  /**
   * Returns current active filters.
   * @returns {{layerId: string|null}}
   */
  getFilters() {
    return {
      layerId: this.activeFilters.layerId,
    };
  }

  /**
   * Returns last search result snapshot.
   * @returns {Object[]}
   */
  getLastResults() {
    return this.lastResults.map((annotation) => this._clone(annotation));
  }

  /**
   * Normalizes incoming search criteria.
   * @param {Object} criteria
   * @returns {{query: string, fields: string[], tags: string[]}}
   */
  _normalizeCriteria(criteria = {}) {
    const query =
      typeof criteria.query === 'string'
        ? criteria.query
        : typeof criteria.text === 'string'
          ? criteria.text
          : '';

    const fields = this._normalizeFields(criteria.fields);
    const tags = this._normalizeTags(criteria.tags);

    return {
      query: query.trim(),
      fields: fields,
      tags: tags,
    };
  }

  /**
   * Normalizes fields list with supported values.
   * @param {string[]|string|undefined} fields
   * @returns {string[]}
   */
  _normalizeFields(fields) {
    const allowed = ['title', 'description', 'category', 'metadata', 'tags'];
    const list =
      typeof fields === 'string'
        ? fields.split(',')
        : Array.isArray(fields)
          ? fields
          : allowed;

    const normalized = list
      .map((field) => String(field).trim().toLowerCase())
      .filter((field) => allowed.includes(field));

    return normalized.length ? [...new Set(normalized)] : allowed;
  }

  /**
   * Normalizes tags criteria to string list.
   * @param {string[]|string|undefined} tags
   * @returns {string[]}
   */
  _normalizeTags(tags) {
    if (typeof tags === 'string') {
      const trimmed = tags.trim();
      return trimmed ? [trimmed.toLowerCase()] : [];
    }

    if (!Array.isArray(tags)) {
      return [];
    }

    return tags
      .map((tag) => String(tag).trim().toLowerCase())
      .filter((tag) => tag.length > 0);
  }

  /**
   * Verifies whether annotation matches active layer filter.
   * @param {Object} annotation
   * @returns {boolean}
   */
  _matchesLayerFilter(annotation = {}) {
    if (!this.activeFilters.layerId) {
      return true;
    }

    if (
      annotation.layerId &&
      annotation.layerId === this.activeFilters.layerId
    ) {
      return true;
    }

    if (
      annotation.properties &&
      annotation.properties.layerId === this.activeFilters.layerId
    ) {
      return true;
    }

    if (
      Array.isArray(annotation.layerIds) &&
      annotation.layerIds.includes(this.activeFilters.layerId)
    ) {
      return true;
    }

    return false;
  }

  /**
   * Verifies search match against one annotation.
   * @param {Object} annotation
   * @param {{query: string, fields: string[], tags: string[]}} criteria
   * @returns {boolean}
   */
  _matchesAnnotation(annotation = {}, criteria) {
    const properties =
      annotation.properties && typeof annotation.properties === 'object'
        ? annotation.properties
        : {};
    const haystack = this._buildFieldText(properties, criteria.fields);
    const hasQuery = criteria.query.length > 0;
    const hasTagCriteria = criteria.tags.length > 0;

    const queryMatch = hasQuery
      ? haystack.includes(criteria.query.toLowerCase())
      : true;

    const tagsMatch = hasTagCriteria
      ? this._matchesTagCriteria(properties, criteria.tags)
      : true;

    return queryMatch && tagsMatch;
  }

  /**
   * Builds a lower-cased searchable text from selected fields.
   * @param {Object} properties
   * @param {string[]} fields
   * @returns {string}
   */
  _buildFieldText(properties, fields) {
    const parts = [];

    if (fields.includes('title') && typeof properties.title === 'string') {
      parts.push(properties.title);
    }

    if (
      fields.includes('description') &&
      typeof properties.description === 'string'
    ) {
      parts.push(properties.description);
    }

    if (
      fields.includes('category') &&
      typeof properties.category === 'string'
    ) {
      parts.push(properties.category);
    }

    if (fields.includes('metadata')) {
      parts.push(this._metadataToText(properties));
    }

    if (fields.includes('tags')) {
      parts.push(this._tagsToText(properties.tags));
    }

    return parts.join(' ').toLowerCase();
  }

  /**
   * Builds searchable metadata text.
   * @param {Object} properties
   * @returns {string}
   */
  _metadataToText(properties = {}) {
    const metadata =
      properties.metadata ||
      properties.customMetadata ||
      properties.metadonnees;

    if (Array.isArray(metadata)) {
      return metadata
        .map((entry) => {
          if (entry && typeof entry === 'object') {
            const key = Object.prototype.hasOwnProperty.call(entry, 'key')
              ? String(entry.key)
              : '';
            const value = Object.prototype.hasOwnProperty.call(entry, 'value')
              ? String(entry.value)
              : '';
            return (key + ' ' + value).trim();
          }

          return String(entry || '');
        })
        .join(' ');
    }

    if (metadata && typeof metadata === 'object') {
      return Object.entries(metadata)
        .map(([key, value]) => key + ' ' + String(value))
        .join(' ');
    }

    if (typeof metadata === 'string') {
      return metadata;
    }

    return '';
  }

  /**
   * Builds searchable tags text.
   * @param {string[]|string|undefined} tags
   * @returns {string}
   */
  _tagsToText(tags) {
    if (Array.isArray(tags)) {
      return tags.map((tag) => String(tag)).join(' ');
    }

    if (typeof tags === 'string') {
      return tags;
    }

    return '';
  }

  /**
   * Verifies that annotation tags satisfy all tag criteria.
   * @param {Object} properties
   * @param {string[]} requiredTags
   * @returns {boolean}
   */
  _matchesTagCriteria(properties = {}, requiredTags = []) {
    const annotationTags = this._normalizeTags(properties.tags);
    if (!requiredTags.length) {
      return true;
    }

    if (!annotationTags.length) {
      return false;
    }

    return requiredTags.every((tag) => annotationTags.includes(tag));
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
  _clone(value) {
    if (value === null || typeof value === 'undefined') {
      return value;
    }

    return JSON.parse(JSON.stringify(value));
  }
}

export default SearchManager;

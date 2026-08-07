/**
 * @class PropertiesDialog
 * @description Defines the dialog boundary for editing annotation properties.
 * @emits propertiesDialog:opened
 * @emits propertiesDialog:closed
 * @emits propertiesDialog:submitted
 * @emits propertiesDialog:reset
 */
export class PropertiesDialog {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'propertiesDialog:opened',
    'propertiesDialog:closed',
    'propertiesDialog:submitted',
    'propertiesDialog:reset',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.validationSchema = null;
    this.isOpen = false;
    this.sourceAnnotation = null;
    this.fieldDefinitions = this._normalizeFieldDefinitions(
      options.fieldDefinitions,
    );
    this.draftValues = this._createDefaultValues();
  }

  /**
   * Initializes the dialog manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Opens the dialog.
   * @param {Object} context
   * @returns {{fields: Object[], values: Object}}
   */
  open(context = {}) {
    const annotation = context.annotation || context;
    if (!annotation || typeof annotation !== 'object') {
      throw new Error('PropertiesDialog.open requires an annotation object.');
    }

    if (context.project) {
      this.applyProjectDefinition(context.project);
    }

    if (Object.prototype.hasOwnProperty.call(context, 'fieldDefinitions')) {
      this.setFieldDefinitions(context.fieldDefinitions);
    }

    this.sourceAnnotation = this._deepClone(annotation);
    this.draftValues = this._extractValuesFromAnnotation(annotation);
    this.isOpen = true;

    const form = this.getFormModel();

    this._emit('propertiesDialog:opened', {
      annotationId: annotation.id || null,
      values: this.getValues(),
      form: form,
    });

    return form;
  }

  /**
   * Closes the dialog.
   * @returns {void}
   */
  close() {
    const previousAnnotationId =
      this.sourceAnnotation && this.sourceAnnotation.id
        ? this.sourceAnnotation.id
        : null;

    this.isOpen = false;
    this.sourceAnnotation = null;
    this.draftValues = this._createDefaultValues();

    this._emit('propertiesDialog:closed', {
      annotationId: previousAnnotationId,
    });
  }

  /**
   * Submits dialog values.
   * @param {Object} values
   * @returns {Object}
   */
  submit(values = {}) {
    if (!this.sourceAnnotation) {
      throw new Error('PropertiesDialog.submit requires an opened annotation.');
    }

    this.setValues(values);
    this._validateDraft(this.draftValues);

    const updatedAnnotation = this._buildUpdatedAnnotation();

    this._emit('propertiesDialog:submitted', {
      annotationId: updatedAnnotation.id || null,
      values: this.getValues(),
      annotation: this._deepClone(updatedAnnotation),
    });

    return updatedAnnotation;
  }

  /**
   * Resets dialog state.
   * @returns {void}
   */
  reset() {
    if (this.sourceAnnotation) {
      this.draftValues = this._extractValuesFromAnnotation(
        this.sourceAnnotation,
      );
    } else {
      this.draftValues = this._createDefaultValues();
    }

    this._emit('propertiesDialog:reset', {
      values: this.getValues(),
      form: this.getFormModel(),
    });
  }

  /**
   * Sets validation schema reference.
   * @param {Object} schema
   * @returns {void}
   */
  setValidationSchema(schema) {
    this.validationSchema = schema || null;
  }

  /**
   * Gets current values.
   * @returns {Object}
   */
  getValues() {
    return this._deepClone(this.draftValues);
  }

  /**
   * Returns an auto-generated form model.
   * @returns {{fields: Object[], values: Object}}
   */
  getFormModel() {
    return {
      fields: this._buildFormFields(),
      values: this.getValues(),
    };
  }

  /**
   * Sets current values.
   * @param {Object} values
   * @returns {void}
   */
  setValues(values = {}) {
    const normalized = this._normalizeValues(values);
    this.draftValues = {
      ...this.draftValues,
      ...normalized,
      metadata: {
        ...this.draftValues.metadata,
        ...normalized.metadata,
      },
    };
  }

  /**
   * Defines metadata fields used to generate the form.
   * @param {Object[]} definitions
   * @returns {Object[]}
   */
  setFieldDefinitions(definitions = []) {
    this.fieldDefinitions = this._normalizeFieldDefinitions(definitions);
    this.draftValues = {
      ...this.draftValues,
      metadata: {
        ...this._createMetadataDefaults(),
        ...this.draftValues.metadata,
      },
    };

    return this.getFieldDefinitions();
  }

  /**
   * Gets metadata field definitions.
   * @returns {Object[]}
   */
  getFieldDefinitions() {
    return this._deepClone(this.fieldDefinitions);
  }

  /**
   * Applies project-level metadata field definitions.
   * @param {Object} project
   * @returns {Object[]}
   */
  applyProjectDefinition(project = {}) {
    return this.setFieldDefinitions(
      this._resolveProjectFieldDefinitions(project),
    );
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.isOpen = false;
    this.sourceAnnotation = null;
    this.validationSchema = null;
    this.fieldDefinitions = this._normalizeFieldDefinitions(
      this.options.fieldDefinitions,
    );
    this.draftValues = this._createDefaultValues();
  }

  /**
   * Creates default editable fields.
   * @returns {{title: string, description: string, metadata: Object}}
   */
  _createDefaultValues() {
    return {
      title: '',
      description: '',
      metadata: this._createMetadataDefaults(),
    };
  }

  /**
   * Extracts editable values from an annotation object.
   * @param {Object} annotation
   * @returns {{title: string, description: string, metadata: Object}}
   */
  _extractValuesFromAnnotation(annotation) {
    const properties =
      annotation &&
      annotation.properties &&
      typeof annotation.properties === 'object'
        ? annotation.properties
        : {};

    const metadataSource = Object.prototype.hasOwnProperty.call(
      properties,
      'metadata',
    )
      ? properties.metadata
      : properties.customMetadata;

    return {
      title: typeof properties.title === 'string' ? properties.title : '',
      description:
        typeof properties.description === 'string'
          ? properties.description
          : '',
      metadata: {
        ...this._createMetadataDefaults(),
        ...this._normalizeMetadataObject(metadataSource),
      },
    };
  }

  /**
   * Normalizes incoming values to editable fields.
   * @param {Object} values
   * @returns {{title?: string, description?: string, metadata: Object}}
   */
  _normalizeValues(values) {
    const normalized = {
      metadata: {},
    };

    if (Object.prototype.hasOwnProperty.call(values, 'title')) {
      normalized.title =
        typeof values.title === 'string'
          ? values.title
          : String(values.title || '');
    }
    if (Object.prototype.hasOwnProperty.call(values, 'description')) {
      normalized.description =
        typeof values.description === 'string'
          ? values.description
          : String(values.description || '');
    }

    if (Object.prototype.hasOwnProperty.call(values, 'metadata')) {
      normalized.metadata = this._normalizeMetadataObject(values.metadata);
    }

    this.fieldDefinitions.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(values, field.key)) {
        normalized.metadata[field.key] = this._normalizeMetadataValue(
          values[field.key],
        );
      }

      const namespacedKey = 'metadata.' + field.key;
      if (Object.prototype.hasOwnProperty.call(values, namespacedKey)) {
        normalized.metadata[field.key] = this._normalizeMetadataValue(
          values[namespacedKey],
        );
      }
    });

    if (Object.prototype.hasOwnProperty.call(values, 'customMetadata')) {
      normalized.metadata = {
        ...normalized.metadata,
        ...this._normalizeMetadataObject(values.customMetadata),
      };
    }

    return normalized;
  }

  /**
   * Normalizes metadata into a free object.
   * @param {Object|Array|string|number|boolean|null|undefined} metadata
   * @returns {Object}
   */
  _normalizeMetadataObject(metadata) {
    if (metadata === null || typeof metadata === 'undefined') {
      return {};
    }

    if (Array.isArray(metadata)) {
      return metadata.reduce((accumulator, item, index) => {
        if (item && typeof item === 'object' && item.key) {
          accumulator[String(item.key)] = this._normalizeMetadataValue(
            Object.prototype.hasOwnProperty.call(item, 'value')
              ? item.value
              : '',
          );
          return accumulator;
        }

        accumulator['field-' + index] = this._normalizeMetadataValue(item);
        return accumulator;
      }, {});
    }

    if (metadata && typeof metadata === 'object') {
      return Object.keys(metadata).reduce((accumulator, key) => {
        accumulator[key] = this._normalizeMetadataValue(metadata[key]);
        return accumulator;
      }, {});
    }

    return {
      value: this._normalizeMetadataValue(metadata),
    };
  }

  /**
   * Normalizes one metadata value.
   * @param {any} value
   * @returns {string}
   */
  _normalizeMetadataValue(value) {
    if (value === null || typeof value === 'undefined') {
      return '';
    }

    if (typeof value === 'string') {
      return value;
    }

    if (typeof value === 'number' || typeof value === 'boolean') {
      return String(value);
    }

    try {
      return JSON.stringify(value);
    } catch (_error) {
      return String(value);
    }
  }

  /**
   * Builds a modified annotation from source annotation and current draft values.
   * @returns {Object}
   */
  _buildUpdatedAnnotation() {
    const annotation = this._deepClone(this.sourceAnnotation);
    const properties =
      annotation.properties && typeof annotation.properties === 'object'
        ? annotation.properties
        : {};

    annotation.properties = {
      ...properties,
      title: this.draftValues.title,
      description: this.draftValues.description,
      metadata: this._deepClone(this.draftValues.metadata),
    };

    if (
      Object.prototype.hasOwnProperty.call(
        annotation.properties,
        'customMetadata',
      )
    ) {
      delete annotation.properties.customMetadata;
    }

    return annotation;
  }

  /**
   * Resolves metadata field definitions from project object.
   * @param {Object} project
   * @returns {Object[]}
   */
  _resolveProjectFieldDefinitions(project = {}) {
    if (Array.isArray(project.propertyFieldDefinitions)) {
      return project.propertyFieldDefinitions;
    }

    if (Array.isArray(project.annotationPropertyDefinitions)) {
      return project.annotationPropertyDefinitions;
    }

    if (
      project.preferences &&
      Array.isArray(project.preferences.propertyFieldDefinitions)
    ) {
      return project.preferences.propertyFieldDefinitions;
    }

    return [];
  }

  /**
   * Normalizes field definitions.
   * @param {Object[]|undefined} definitions
   * @returns {Object[]}
   */
  _normalizeFieldDefinitions(definitions) {
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
            ? field.options.map((option) =>
                this._normalizeMetadataValue(option),
              )
            : [],
          defaultValue: this._normalizeMetadataValue(field.defaultValue),
        };
      });
  }

  /**
   * Creates metadata defaults from field definitions.
   * @returns {Object}
   */
  _createMetadataDefaults() {
    return this.fieldDefinitions.reduce((accumulator, field) => {
      accumulator[field.key] = field.defaultValue || '';
      return accumulator;
    }, {});
  }

  /**
   * Builds auto-generated form fields.
   * @returns {Object[]}
   */
  _buildFormFields() {
    const baseFields = [
      {
        key: 'title',
        label: 'Title',
        type: 'text',
        required: false,
        source: 'properties.title',
      },
      {
        key: 'description',
        label: 'Description',
        type: 'textarea',
        required: false,
        source: 'properties.description',
      },
    ];

    const metadataFields = this.fieldDefinitions.map((field) => {
      return {
        key: field.key,
        label: field.label,
        type: field.type,
        required: field.required,
        placeholder: field.placeholder,
        options: this._deepClone(field.options),
        source: 'properties.metadata.' + field.key,
      };
    });

    return baseFields.concat(metadataFields);
  }

  /**
   * Validates draft values when a schema is provided.
   * @param {Object} values
   * @returns {void}
   */
  _validateDraft(values) {
    if (!this.validationSchema) {
      return;
    }

    if (typeof this.validationSchema === 'function') {
      const result = this.validationSchema(values);
      if (result === false) {
        throw new Error('PropertiesDialog validation failed.');
      }
      return;
    }

    if (
      this.validationSchema &&
      typeof this.validationSchema.validate === 'function'
    ) {
      const result = this.validationSchema.validate(values);
      if (result === false) {
        throw new Error('PropertiesDialog validation failed.');
      }
    }
  }

  /**
   * Emits dialog events through EventBus when available.
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

export default PropertiesDialog;

/**
 * @class ContextMenuManager
 * @description Manages contextual action menus for viewer and annotation interactions.
 * @emits contextMenu:opened
 * @emits contextMenu:closed
 * @emits contextMenu:actionRegistered
 * @emits contextMenu:actionInvoked
 */
export class ContextMenuManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'contextMenu:opened',
    'contextMenu:closed',
    'contextMenu:actionRegistered',
    'contextMenu:actionInvoked',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.isOpen = false;
    this.context = null;
    this.actions = new Map();
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {
    this._registerDefaultAnnotationActions();
  }

  /**
   * Registers a context menu action.
   * @param {string} actionId
   * @param {Object} actionDefinition
   * @returns {void}
   */
  registerAction(actionId, actionDefinition = {}) {
    if (!actionId) {
      throw new Error('ContextMenuManager.registerAction requires actionId.');
    }

    const normalized = {
      id: actionId,
      label:
        typeof actionDefinition.label === 'string'
          ? actionDefinition.label
          : actionId,
      contexts: Array.isArray(actionDefinition.contexts)
        ? [...actionDefinition.contexts]
        : ['annotation'],
      order:
        typeof actionDefinition.order === 'number' ? actionDefinition.order : 0,
      meta:
        actionDefinition.meta && typeof actionDefinition.meta === 'object'
          ? this._clone(actionDefinition.meta)
          : {},
    };

    this.actions.set(actionId, normalized);

    this._emit('contextMenu:actionRegistered', {
      action: this._clone(normalized),
    });

    return this._clone(normalized);
  }

  /**
   * Unregisters a context menu action.
   * @param {string} actionId
   * @returns {void}
   */
  unregisterAction(actionId) {
    if (!this.actions.has(actionId)) {
      return false;
    }

    this.actions.delete(actionId);
    return true;
  }

  /**
   * Opens the context menu.
   * @param {Object} context
   * @returns {void}
   */
  openContextMenu(context = {}) {
    this.setContext(context);
    this.isOpen = true;

    const payload = {
      context: this._clone(this.context),
      actions: this._getActionsForContext(this.context),
    };

    this._emit('contextMenu:opened', payload);
    return payload;
  }

  /**
   * Closes the context menu.
   * @returns {void}
   */
  closeContextMenu() {
    if (!this.isOpen) {
      return;
    }

    this.isOpen = false;
    this._emit('contextMenu:closed', {
      context: this._clone(this.context),
    });
  }

  /**
   * Sets the active context for menu actions.
   * @param {Object} context
   * @returns {void}
   */
  setContext(context = {}) {
    this.context = {
      targetType:
        typeof context.targetType === 'string'
          ? context.targetType
          : context.annotationId
            ? 'annotation'
            : 'unknown',
      annotationId: context.annotationId || null,
      annotation:
        context.annotation && typeof context.annotation === 'object'
          ? this._clone(context.annotation)
          : null,
      position:
        context.position && typeof context.position === 'object'
          ? {
              x: Number(context.position.x),
              y: Number(context.position.y),
            }
          : null,
      sourceEvent: context.sourceEvent || null,
    };

    return this._clone(this.context);
  }

  /**
   * Handles right-click opening on an annotation target.
   * @param {Object} context
   * @returns {{context: Object, actions: Object[]}}
   */
  openAnnotationContextMenu(context = {}) {
    return this.openContextMenu({
      ...context,
      targetType: 'annotation',
    });
  }

  /**
   * Emits intent for an action selection. No business logic is executed here.
   * @param {string} actionId
   * @param {Object} [extra]
   * @returns {Object|null}
   */
  invokeAction(actionId, extra = {}) {
    const action = this.actions.get(actionId);
    if (!action) {
      return null;
    }

    const payload = {
      action: this._clone(action),
      context: this._clone(this.context),
      extra: extra && typeof extra === 'object' ? this._clone(extra) : {},
    };

    this._emit('contextMenu:actionInvoked', payload);
    return payload;
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.closeContextMenu();
    this.context = null;
    this.actions.clear();
  }

  /**
   * Returns a state snapshot.
   * @returns {{isOpen: boolean, context: Object|null, actions: Object[]}}
   */
  getState() {
    return {
      isOpen: this.isOpen,
      context: this._clone(this.context),
      actions: this._getActionsForContext(this.context),
    };
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
   * Returns actions visible for a context.
   * @param {Object|null} context
   * @returns {Object[]}
   */
  _getActionsForContext(context) {
    const targetType =
      context && context.targetType ? context.targetType : 'unknown';

    return Array.from(this.actions.values())
      .filter((action) => action.contexts.includes(targetType))
      .sort((a, b) => a.order - b.order)
      .map((action) => this._clone(action));
  }

  /**
   * Registers the default annotation context actions.
   * @returns {void}
   */
  _registerDefaultAnnotationActions() {
    const defaults = [
      { id: 'annotation:edit', label: 'Modifier', order: 10 },
      { id: 'annotation:duplicate', label: 'Dupliquer', order: 20 },
      { id: 'annotation:delete', label: 'Supprimer', order: 30 },
      { id: 'annotation:zoom', label: 'Zoom', order: 40 },
    ];

    defaults.forEach((action) => {
      this.registerAction(action.id, {
        label: action.label,
        contexts: ['annotation'],
        order: action.order,
      });
    });
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

export default ContextMenuManager;

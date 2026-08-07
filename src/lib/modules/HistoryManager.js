/**
 * @class HistoryManager
 * @description Provides history boundaries for undo/redo and action tracking.
 * @emits history:pushed
 * @emits history:undo
 * @emits history:redo
 * @emits history:cleared
 */
export class HistoryManager {
  /**
   * @type {string[]}
   */
  static emittedEvents = [
    'history:pushed',
    'history:undo',
    'history:redo',
    'history:cleared',
  ];

  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus;
    this.maxHistory = this._resolveMaxHistory(options.maxHistory);
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Initializes the manager.
   * @returns {void}
   */
  initialize() {}

  /**
   * Pushes an action into history.
   * @param {Object} action
   * @returns {void}
   */
  pushAction(action) {
    const command = this._normalizeCommand(action);

    const result = command.execute();
    this._pushExecutedCommand(command);

    this._emit('history:pushed', {
      command: this._serializeCommand(command),
      state: this.getHistoryState(),
    });

    return result;
  }

  /**
   * Performs undo.
   * @returns {void}
   */
  undo() {
    if (!this.canUndo()) {
      return null;
    }

    const command = this.undoStack.pop();
    const result = command.undo();
    this.redoStack.push(command);

    this._emit('history:undo', {
      command: this._serializeCommand(command),
      state: this.getHistoryState(),
    });

    return result;
  }

  /**
   * Performs redo.
   * @returns {void}
   */
  redo() {
    if (!this.canRedo()) {
      return null;
    }

    const command = this.redoStack.pop();
    const result =
      typeof command.redo === 'function' ? command.redo() : command.execute();

    this.undoStack.push(command);
    this._truncateUndoOverflow();

    this._emit('history:redo', {
      command: this._serializeCommand(command),
      state: this.getHistoryState(),
    });

    return result;
  }

  /**
   * Returns whether undo is available.
   * @returns {void}
   */
  canUndo() {
    return this.undoStack.length > 0;
  }

  /**
   * Returns whether redo is available.
   * @returns {void}
   */
  canRedo() {
    return this.redoStack.length > 0;
  }

  /**
   * Clears history.
   * @returns {void}
   */
  clearHistory() {
    this.undoStack = [];
    this.redoStack = [];

    this._emit('history:cleared', {
      state: this.getHistoryState(),
    });
  }

  /**
   * Gets history state.
   * @returns {void}
   */
  getHistoryState() {
    return {
      maxHistory: this.maxHistory,
      canUndo: this.canUndo(),
      canRedo: this.canRedo(),
      undoCount: this.undoStack.length,
      redoCount: this.redoStack.length,
      undoStack: this.undoStack.map((command) =>
        this._serializeCommand(command),
      ),
      redoStack: this.redoStack.map((command) =>
        this._serializeCommand(command),
      ),
    };
  }

  /**
   * Releases manager resources.
   * @returns {void}
   */
  destroy() {
    this.undoStack = [];
    this.redoStack = [];
  }

  /**
   * Alias for command execution. All mutating operations should go through this method.
   * @param {Object} command
   * @returns {any}
   */
  execute(command) {
    return this.pushAction(command);
  }

  /**
   * Pushes a command that has already been executed externally.
   * Use sparingly while migrating legacy flows to full command execution.
   * @param {Object} action
   * @returns {Object}
   */
  pushExecutedAction(action) {
    const command = this._normalizeCommand(action);
    this._pushExecutedCommand(command);

    this._emit('history:pushed', {
      command: this._serializeCommand(command),
      state: this.getHistoryState(),
    });

    return this._serializeCommand(command);
  }

  /**
   * Normalizes command object for history.
   * @param {Object} action
   * @returns {{id: string, label: string, execute: Function, undo: Function, redo?: Function, metadata: Object}}
   */
  _normalizeCommand(action) {
    if (!action || typeof action !== 'object') {
      throw new Error('HistoryManager requires a command object.');
    }

    const execute =
      typeof action.execute === 'function'
        ? action.execute.bind(action)
        : typeof action.do === 'function'
          ? action.do.bind(action)
          : null;
    const undo =
      typeof action.undo === 'function' ? action.undo.bind(action) : null;
    const redo =
      typeof action.redo === 'function' ? action.redo.bind(action) : null;

    if (!execute) {
      throw new Error('History command must expose execute() or do().');
    }

    if (!undo) {
      throw new Error('History command must expose undo().');
    }

    return {
      id: action.id || this._createCommandId(),
      label:
        typeof action.label === 'string' && action.label.trim()
          ? action.label.trim()
          : 'Command',
      execute: execute,
      undo: undo,
      redo: redo,
      metadata:
        action.metadata && typeof action.metadata === 'object'
          ? this._clone(action.metadata)
          : {},
    };
  }

  /**
   * Adds executed command to undo stack and clears redo stack.
   * @param {Object} command
   * @returns {void}
   */
  _pushExecutedCommand(command) {
    this.undoStack.push(command);
    this._truncateUndoOverflow();
    this.redoStack = [];
  }

  /**
   * Enforces max history size by dropping oldest undo commands.
   * @returns {void}
   */
  _truncateUndoOverflow() {
    while (this.undoStack.length > this.maxHistory) {
      this.undoStack.shift();
    }
  }

  /**
   * Serializes command for state/event payloads.
   * @param {Object} command
   * @returns {{id: string, label: string, metadata: Object}}
   */
  _serializeCommand(command) {
    return {
      id: command.id,
      label: command.label,
      metadata: this._clone(command.metadata || {}),
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
   * Resolves max history size.
   * @param {number|undefined} value
   * @returns {number}
   */
  _resolveMaxHistory(value) {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return 100;
    }

    return Math.max(1, Math.trunc(value));
  }

  /**
   * Creates a unique command id.
   * @returns {string}
   */
  _createCommandId() {
    return 'command-' + Date.now() + '-' + Math.floor(Math.random() * 1000000);
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

export default HistoryManager;

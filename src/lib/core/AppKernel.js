import {
  AnnotationManager,
  ContextMenuManager,
  HistoryManager,
  ImportExportManager,
  LayerManager,
  PopupManager,
  ProjectManager,
  PropertiesDialog,
  SearchManager,
  SidebarManager,
  StyleManager,
  Utils,
  ViewerManager,
} from '../modules/index.js';
import { EventBus } from './EventBus.js';

/**
 * @class AppKernel
 * @description Minimal composition root that instantiates and registers all managers.
 */
export class AppKernel {
  /**
   * @param {Object} [options={}]
   * @param {Object} [options.eventBus]
   */
  constructor(options = {}) {
    this.options = options;
    this.eventBus = options.eventBus || new EventBus();
    this.managers = new Map();
  }

  /**
   * Returns the kernel event bus.
   * @returns {Object}
   */
  getEventBus() {
    return this.eventBus;
  }

  /**
   * Replaces the kernel event bus and reconnects managers.
   * @param {Object} eventBus
   * @returns {void}
   */
  setEventBus(eventBus) {
    this.eventBus = eventBus;
    this.connectManagersToEventBus();
  }

  /**
   * Creates and registers default manager instances.
   * @returns {void}
   */
  registerDefaultManagers() {
    this.registerManager(
      'projectManager',
      new ProjectManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'viewerManager',
      new ViewerManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'annotationManager',
      new AnnotationManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'layerManager',
      new LayerManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'sidebarManager',
      new SidebarManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'popupManager',
      new PopupManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'styleManager',
      new StyleManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'importExportManager',
      new ImportExportManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'historyManager',
      new HistoryManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'searchManager',
      new SearchManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'contextMenuManager',
      new ContextMenuManager({ eventBus: this.eventBus }),
    );
    this.registerManager(
      'propertiesDialog',
      new PropertiesDialog({ eventBus: this.eventBus }),
    );
    this.registerManager('utils', new Utils({ eventBus: this.eventBus }));
  }

  /**
   * Registers one manager instance in the kernel registry.
   * @param {string} name
   * @param {Object} manager
   * @returns {void}
   */
  registerManager(name, manager) {
    if (manager) {
      manager.eventBus = this.eventBus;
    }

    this.managers.set(name, manager);
  }

  /**
   * Propagates the current event bus to all registered managers.
   * @returns {void}
   */
  connectManagersToEventBus() {
    this.managers.forEach((manager) => {
      if (manager) {
        manager.eventBus = this.eventBus;
      }
    });
  }

  /**
   * Returns a manager instance by name.
   * @param {string} name
   * @returns {Object|undefined}
   */
  getManager(name) {
    return this.managers.get(name);
  }

  /**
   * Returns all registered managers.
   * @returns {Map<string, Object>}
   */
  getManagers() {
    return this.managers;
  }

  /**
   * Calls initialize on registered managers when available.
   * @returns {void}
   */
  initialize() {
    this.managers.forEach((manager) => {
      if (manager && typeof manager.initialize === 'function') {
        manager.initialize();
      }
    });
  }

  /**
   * Calls destroy on registered managers when available and clears registry.
   * @returns {void}
   */
  destroy() {
    this.managers.forEach((manager) => {
      if (manager && typeof manager.destroy === 'function') {
        manager.destroy();
      }
    });

    this.managers.clear();
  }
}

export default AppKernel;

/**
 * @class EventBus
 * @description Contract-only event bus for module communication.
 */
export class EventBus {
  /**
   * @param {Object} [options={}]
   */
  constructor(options = {}) {
    this.options = options;
  }

  /**
   * Subscribes to an event.
   * @param {string} eventName
   * @param {Function} handler
   * @returns {void}
   */
  on(eventName, handler) {}

  /**
   * Unsubscribes from an event.
   * @param {string} eventName
   * @param {Function} handler
   * @returns {void}
   */
  off(eventName, handler) {}

  /**
   * Subscribes to an event once.
   * @param {string} eventName
   * @param {Function} handler
   * @returns {void}
   */
  once(eventName, handler) {}

  /**
   * Emits an event.
   * @param {string} eventName
   * @param {Object} payload
   * @returns {void}
   */
  emit(eventName, payload) {}

  /**
   * Clears subscriptions for one event or all events.
   * @param {string} [eventName]
   * @returns {void}
   */
  clear(eventName) {}

  /**
   * Destroys bus resources.
   * @returns {void}
   */
  destroy() {}
}

export default EventBus;

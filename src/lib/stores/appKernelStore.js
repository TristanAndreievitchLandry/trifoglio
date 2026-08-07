import { writable } from 'svelte/store';

/**
 * Holds the AppKernel instance for Svelte composition.
 */
export const appKernel = writable(null);

/**
 * Binds a kernel instance to the store.
 * @param {Object} kernel
 * @returns {void}
 */
export function bindKernel(kernel) {
  appKernel.set(kernel);
}

/**
 * Clears the kernel instance from the store.
 * @returns {void}
 */
export function unbindKernel() {
  appKernel.set(null);
}

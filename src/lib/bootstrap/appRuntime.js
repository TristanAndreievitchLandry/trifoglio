import { createKernel } from './createKernel.js';
import { bindKernel, unbindKernel } from '../stores/appKernelStore.js';

/**
 * Holds the active kernel instance for the app runtime.
 * @type {import('../core/index.js').AppKernel | null}
 */
let kernelInstance = null;

/**
 * Starts the app runtime and binds the kernel to the store.
 * @returns {import('../core/index.js').AppKernel}
 */
export function startAppRuntime() {
  if (kernelInstance) {
    return kernelInstance;
  }

  kernelInstance = createKernel();
  bindKernel(kernelInstance);
  return kernelInstance;
}

/**
 * Stops the app runtime and unbinds kernel from the store.
 * @returns {void}
 */
export function stopAppRuntime() {
  if (kernelInstance && typeof kernelInstance.destroy === 'function') {
    kernelInstance.destroy();
  }

  kernelInstance = null;
  unbindKernel();
}

/**
 * Returns the active kernel instance.
 * @returns {import('../core/index.js').AppKernel | null}
 */
export function getAppRuntimeKernel() {
  return kernelInstance;
}

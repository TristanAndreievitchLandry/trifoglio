import { AppKernel } from '../core/index.js';

/**
 * Creates and initializes the application kernel.
 * This is scaffold-only and contains no business feature wiring.
 * @returns {AppKernel}
 */
export function createKernel() {
  const kernel = new AppKernel();
  kernel.registerDefaultManagers();
  kernel.initialize();
  return kernel;
}

export default createKernel;

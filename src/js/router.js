/**
 * QuotePilot AI - Client-side Router
 * Hash-based routing for GitHub Pages / static hosting compatibility
 */

const routes = new Map();
let currentRoute = null;
let beforeEachHooks = [];
let afterEachHooks = [];

/**
 * Register a route
 * @param {string} path - Route path (e.g., '/dashboard', '/rfqs/:id')
 * @param {Function} handler - Route handler function
 * @param {Object} options - Route options (roles, title, etc.)
 */
export function route(path, handler, options = {}) {
  const regex = pathToRegex(path);
  routes.set(path, { regex, handler, options, path });
}

/**
 * Convert path pattern to regex
 * @param {string} path - Path pattern with optional :param
 * @returns {RegExp}
 */
function pathToRegex(path) {
  const pattern = path
    .replace(/\//g, '\\/')
    .replace(/:([a-zA-Z0-9_]+)/g, '(?<$1>[^\\/]+)');
  return new RegExp(`^${pattern}$`);
}

/**
 * Extract params from path
 * @param {string} path - Route pattern
 * @param {string} hash - Current hash
 * @returns {Object|null}
 */
function extractParams(path, hash) {
  const regex = pathToRegex(path);
  const match = hash.match(regex);
  if (!match) return null;
  return match.groups || {};
}

/**
 * Navigate to a route
 * @param {string} path - Target path
 * @param {Object} params - Route parameters
 */
export function navigate(path, params = {}) {
  let finalPath = path;
  Object.entries(params).forEach(([key, value]) => {
    finalPath = finalPath.replace(`:${key}`, value);
  });
  window.location.hash = finalPath;
}

/**
 * Go back in history
 */
export function goBack() {
  window.history.back();
}

/**
 * Get current route info
 * @returns {Object|null}
 */
export function getCurrentRoute() {
  return currentRoute;
}

/**
 * Get current route params
 * @returns {Object}
 */
export function getParams() {
  return currentRoute?.params || {};
}

/**
 * Add navigation guard
 * @param {Function} hook - Function(route) => boolean|Promise<boolean>
 */
export function beforeEach(hook) {
  beforeEachHooks.push(hook);
}

/**
 * Add after navigation hook
 * @param {Function} hook - Function(route)
 */
export function afterEach(hook) {
  afterEachHooks.push(hook);
}

/**
 * Handle hash change
 */
async function handleHashChange() {
  const hash = window.location.hash.slice(1) || '/';
  
  // Find matching route
  for (const [path, route] of routes) {
    const params = extractParams(path, hash);
    if (params !== null) {
      const routeInfo = { path, hash, params, options: route.options };
      
      // Run beforeEach guards
      for (const hook of beforeEachHooks) {
        const result = await hook(routeInfo);
        if (result === false) return;
        if (result && typeof result === 'string') {
          navigate(result);
          return;
        }
      }
      
      currentRoute = routeInfo;
      await route.handler(routeInfo);
      
      // Run afterEach hooks
      for (const hook of afterEachHooks) {
        await hook(routeInfo);
      }
      return;
    }
  }
  
  // No route matched - 404
  handle404(hash);
}

/**
 * Handle 404
 * @param {string} hash - Unmatched hash
 */
function handle404(hash) {
  console.warn(`Route not found: ${hash}`);
  navigate('/404');
}

/**
 * Initialize router
 */
export function initRouter() {
  window.addEventListener('hashchange', handleHashChange);
  // Handle initial load
  handleHashChange();
}

/**
 * Generate URL for route
 * @param {string} path - Route path
 * @param {Object} params - Parameters
 * @returns {string}
 */
export function urlFor(path, params = {}) {
  let finalPath = path;
  Object.entries(params).forEach(([key, value]) => {
    finalPath = finalPath.replace(`:${key}`, value);
  });
  return `#${finalPath}`;
}

/**
 * Check if current route matches path
 * @param {string} path - Route path to check
 * @returns {boolean}
 */
export function isActive(path) {
  if (!currentRoute) return false;
  const regex = pathToRegex(path);
  return regex.test(currentRoute.hash);
}
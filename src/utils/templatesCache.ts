/**
 * Preload templates so list and apply feel instant.
 * Page prefetches on load; Sidebar/Dashboard read from cache.
 */

type Cached = {
  templates: Array<unknown>;
  total: number;
} | null;

let cache: Cached = null;
let promise: Promise<Cached> | null = null;

export function prefetchTemplates(): Promise<Cached> {
  if (cache) return Promise.resolve(cache);
  if (promise) return promise;
  promise = fetch('/api/templates')
    .then((res) => (res.ok ? res.json() : Promise.reject(new Error('Failed to fetch'))))
    .then((data) => {
      cache = { templates: data.templates || [], total: data.total ?? 0 };
      return cache;
    })
    .catch(() => {
      promise = null;
      return null;
    });
  return promise;
}

export function getTemplates(): Promise<Cached> {
  return prefetchTemplates();
}

export function getTemplatesSync(): Cached {
  return cache;
}

export function invalidateTemplatesCache(): void {
  cache = null;
  promise = null;
}

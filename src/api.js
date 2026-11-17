const API_BASE = import.meta.env.VITE_API_URL ? `${import.meta.env.VITE_API_URL}/api` : '/api';

// In-memory GET cache & in-flight request deduplicator
const cache = new Map();
const inFlight = new Map();
const DEFAULT_TTL_MS = 5 * 60 * 1000; // 5 minutes safety expiry

function invalidateCache(prefix = '') {
  if (!prefix) {
    cache.clear();
    return;
  }
  for (const key of cache.keys()) {
    if (key.startsWith(prefix)) {
      cache.delete(key);
    }
  }
}

async function request(path, options = {}) {
  const method = (options.method || 'GET').toUpperCase();
  const isGet = method === 'GET';
  const forceRefresh = Boolean(options.force);

  // 1. Return cached GET response immediately if still valid
  if (isGet && !forceRefresh && cache.has(path)) {
    const entry = cache.get(path);
    if (Date.now() - entry.timestamp < DEFAULT_TTL_MS) {
      return entry.data;
    }
    cache.delete(path);
  }

  // 2. Deduplicate identical concurrent GET requests
  if (isGet && inFlight.has(path)) {
    return inFlight.get(path);
  }

  const { force, ...fetchOptions } = options;

  const promise = (async () => {
    const res = await fetch(`${API_BASE}${path}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...(fetchOptions.headers || {}),
      },
      ...fetchOptions,
    });

    if (res.status === 204) {
      if (!isGet) invalidateCache();
      return null;
    }

    const data = await res.json().catch(() => null);
    if (!res.ok) {
      const err = new Error(data?.error?.message || `Request failed (${res.status})`);
      err.fields = data?.error?.fields;
      throw err;
    }

    if (isGet) {
      // Save successful GET response in cache
      cache.set(path, { data, timestamp: Date.now() });
    } else {
      // Any POST, PATCH, or DELETE (renting, reserving, approving, returning, logout, etc.)
      // clears cached data so subsequent views reflect the updated server state
      invalidateCache();
    }

    return data;
  })();

  if (isGet) {
    inFlight.set(path, promise);
  }

  try {
    return await promise;
  } finally {
    if (isGet) {
      inFlight.delete(path);
    }
  }
}

export const api = {
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body) => request(path, { method: 'POST', body: JSON.stringify(body) }),
  patch: (path, body) => request(path, { method: 'PATCH', body: JSON.stringify(body) }),
  delete: (path) => request(path, { method: 'DELETE' }),
  clearCache: invalidateCache,
};
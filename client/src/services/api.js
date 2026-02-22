const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

/**
 * Get current tenant slug from the hostname
 */
const getTenantDomain = () => {
    const hostname = window.location.hostname;
    return hostname === '127.0.0.1' ? 'localhost' : hostname;
};

/**
 * Universal wrapper around fetch to automatically include
 * the Tenant boundary header and Base URL mapping.
 */
const apiFetch = async (endpoint, options = {}) => {
    const url = `${API_BASE}${endpoint}`;

    const headers = new Headers(options.headers || {});
    headers.set('X-Tenant-Domain', getTenantDomain());

    if (options.body && !(options.body instanceof FormData)) {
        headers.append('Content-Type', 'application/json');
        options.body = JSON.stringify(options.body);
    }

    const response = await fetch(url, {
        ...options,
        headers
    });

    const isJson = response.headers.get('content-type')?.includes('application/json');
    const data = isJson ? await response.json() : null;

    if (!response.ok) {
        const error = new Error(data?.message || response.statusText);
        error.status = response.status;
        error.data = data;
        throw error;
    }

    return data;
};

export const api = {
    get: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'GET' }),
    post: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'POST', body }),
    put: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PUT', body }),
    patch: (endpoint, body, options) => apiFetch(endpoint, { ...options, method: 'PATCH', body }),
    delete: (endpoint, options) => apiFetch(endpoint, { ...options, method: 'DELETE' }),
};

export default api;

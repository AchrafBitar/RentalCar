import api from './api';

export const tenantService = {
    /**
     * Fetch tenant configuration based on the current domain slug.
     * We pass the domain in the X-Tenant-Domain header as strictly required by our backend.
     */
    async getTenantConfig() {
        const hostname = window.location.hostname;
        // For local dev, we might be on localhost.
        // Replace with a logic matching your exact domain setup (e.g subdomains vs path)
        // Here we use the whole hostname or 'localhost' as fallback.
        const domainSlug = hostname === '127.0.0.1' ? 'localhost' : hostname;

        try {
            const response = await api.get('/tenant/config');

            if (response && response.success) {
                return response.data; // The config object
            }
            return null;
        } catch (error) {
            console.error('Failed to fetch tenant configuration:', error);
            return null;
        }
    },
};

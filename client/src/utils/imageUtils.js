const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';
const BASE_URL = API_BASE.replace(/\/api\/?$/, '');

/**
 * Ensures a valid image URL by prepending the backend base URL for relative paths.
 * Returns null if the path is invalid or is exactly 'Logo.png' (handled by frontend default).
 */
export const getImageUrl = (path) => {
    if (!path) return null;

    // Check if it's already an absolute URL or data URI
    if (path.startsWith('http') || path.startsWith('data:')) {
        return path;
    }

    // Ignore direct "Logo.png" references from the DB which rely on frontend imports
    if (path === 'Logo.png' || path === '/Logo.png') {
        return null;
    }

    // Ensure the path is properly formatted (e.g. /uploads/...)
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};

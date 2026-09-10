/**
 * Normalizes and returns the backend API base URL.
 * Ensures the returned URL has no trailing slashes and ends with `/api`.
 */
export const getApiBaseUrl = () => {
    let url = import.meta.env.VITE_API_BASE_URL;

    if (!url) {
        if (typeof window !== 'undefined' && window.location.hostname.includes('vercel.app')) {
            url = 'https://finexa-ai-xama.onrender.com/api';
        } else {
            url = 'http://localhost:5000/api';
        }
    }

    url = url.trim();

    // 1. Remove trailing slashes
    url = url.replace(/\/+$/, '');

    // 2. Ensure it ends with /api
    if (!url.endsWith('/api')) {
        url = url + '/api';
    }

    return url;
};

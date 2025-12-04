import axios from 'axios';

// Use environment variable for API base URL so it works locally and in deployment.
// Vite exposes variables prefixed with VITE_ via import.meta.env.
const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002',
    headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
    },
    withCredentials: false
});

// Add request interceptor for debugging
api.interceptors.request.use(request => {
    console.log('Starting Request:', {
        url: request.url,
        method: request.method,
        headers: request.headers
    });
    return request;
});

// Add response interceptor for debugging
api.interceptors.response.use(
    response => {
        console.log('Response:', response);
        return response;
    },
    error => {
        console.error('API Error:', {
            message: error.message,
            response: error.response,
            request: error.request
        });
        return Promise.reject(error);
    }
);

export default api;
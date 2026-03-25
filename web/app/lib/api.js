const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

class ApiClient {
    constructor() {
        this.baseURL = API_BASE_URL;
    }

    getToken() {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    }

    async request(endpoint, options = {}) {
        const token = this.getToken();
        const config = {
            method: options.method || 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...(token ? { Authorization: `Bearer ${token}` } : {}),
                ...options.headers,
            },
            ...(options.body ? { body: JSON.stringify(options.body) } : {}),
        };

        try {
            const response = await fetch(`${this.baseURL}${endpoint}`, config);
            const data = await response.json();

            if (!response.ok) {
                if (response.status === 401 && !endpoint.includes('/login')) {
                    // Session expired or invalid token
                    if (typeof window !== 'undefined') {
                        localStorage.removeItem('token');
                        localStorage.removeItem('user');
                        window.location.href = '/login?expired=true';
                        // Return a promise that never resolves to prevent downstream errors/alerts while redirecting
                        return new Promise(() => { });
                    }
                }
                throw new Error(data.message || 'Something went wrong');
            }

            return data;
        } catch (error) {
            console.error('API Error:', error.message);
            throw error;
        }
    }

    get(endpoint) { return this.request(endpoint, { method: 'GET' }); }
    post(endpoint, body) { return this.request(endpoint, { method: 'POST', body }); }
    put(endpoint, body) { return this.request(endpoint, { method: 'PUT', body }); }
    delete(endpoint) { return this.request(endpoint, { method: 'DELETE' }); }
}

export const api = new ApiClient();

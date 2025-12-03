import axiosLib, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosError } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a singleton axios instance - ES modules ensure only one instance is created
const axios: AxiosInstance = axiosLib.create({
    baseURL: API_BASE_URL,
});

// Track if we're currently refreshing to prevent multiple refresh calls
let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

// Request interceptor: Attach access token to requests
axios.interceptors.request.use((config: InternalAxiosRequestConfig) => {
        const accessToken = localStorage.getItem('accessToken');
        
        // Don't attach token to refresh endpoint or auth endpoints (login/register)
        if (config.url?.includes('/refresh-access-token') || 
            config.url?.includes('/login') || 
            config.url?.includes('/register')) {
            return config;
        }

        if (accessToken && config.headers) {
            config.headers.Authorization = `Bearer ${accessToken}`;
        }
        
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: Handle 401 errors and refresh token
axios.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
        
        // If it's a 401 and we haven't already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            // Skip refresh for auth endpoints
            if (originalRequest.url?.includes('/refresh-access-token') ||
                originalRequest.url?.includes('/login') ||
                originalRequest.url?.includes('/register') ||
                originalRequest.url?.includes('/check-session')) {
                return Promise.reject(error);
            }

            originalRequest._retry = true;
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                // No refresh token, clear everything and reject
                localStorage.removeItem('accessToken');
                localStorage.removeItem('refreshToken');
                return Promise.reject(error);
            }

            // If already refreshing, wait for that promise
            if (isRefreshing && refreshPromise) {
                try {
                    const newAccessToken = await refreshPromise;
                    if (originalRequest.headers) {
                        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                    }
                    return axios(originalRequest);
                } catch {
                    return Promise.reject(error);
                }
            }

            // Start refresh process
            isRefreshing = true;
            refreshPromise = axiosLib.post<{ accessToken: string }>(`${API_BASE_URL}/api/auth/refresh-access-token`,
                { refreshToken },
            ).then((response) => {
                const { accessToken } = response.data;
                localStorage.setItem('accessToken', accessToken);
                isRefreshing = false;
                refreshPromise = null;
                return accessToken;
            }).catch((refreshError) => {
                    // Refresh failed, clear tokens
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    isRefreshing = false;
                    refreshPromise = null;
                    return Promise.reject(refreshError);
                });

            try {
                const newAccessToken = await refreshPromise;
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                }
                return axios(originalRequest);
            } catch {
                return Promise.reject(error);
            }
        }

        return Promise.reject(error);
    }
);

export default axios;
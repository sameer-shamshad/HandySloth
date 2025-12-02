import axiosLib, { type AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Create a singleton axios instance - ES modules ensure only one instance is created
const axios: AxiosInstance = axiosLib.create({
    baseURL: API_BASE_URL,
});

export default axios;
import { AxiosError } from 'axios';
import axios from '../lib/axios';
import type { User } from '../types';

interface CheckSessionResponse {
  user: User;
  accessToken?: string;
  refreshToken?: string;
}

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

interface AuthResponse {
  user: User;
  message: string;
  accessToken: string;
}

export const checkSession = async (accessToken: string): Promise<CheckSessionResponse> => {
  console.log('Checking session...', accessToken);
  try {
    const response = await axios.get<CheckSessionResponse>('/api/auth/check-session', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'An error occurred');
    }
    throw error;
  }
};

export const login = async (credentials: LoginRequest): Promise<AuthResponse> => {
  try { 
    const response = await axios.post<AuthResponse>('/api/auth/login', credentials);
    if (response.status !== 200) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'An error occurred');
    }
    throw error;
  }
};

export const register = async (userData: RegisterRequest): Promise<AuthResponse> => {
  try {
    const response = await axios.post<AuthResponse>('/api/auth/register', userData);
    if (response.status !== 201) {
      throw new Error(response.data.message);
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'An error occurred');
    }
    throw error;
  }
};
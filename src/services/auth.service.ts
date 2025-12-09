import axios from '../lib/axios';
import { AxiosError } from 'axios';
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
  refreshToken: string;
}

export const checkSession = async (accessToken: string): Promise<CheckSessionResponse> => {
  try {
    const response = await axios.get<CheckSessionResponse>('/api/auth/check-session', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      const customError = new Error(error.response?.data.message || 'An error occurred') as Error & { statusCode?: number };
      customError.statusCode = error.response?.status;
      throw customError;
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

interface RefreshAccessTokenResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export const refreshAccessToken = async (refreshToken: string): Promise<RefreshAccessTokenResponse> => {
  try {
    const response = await axios.post<RefreshAccessTokenResponse>('/api/auth/refresh-access-token', {
      refreshToken,
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to refresh access token');
    }
    throw error;
  }
};

interface LogoutResponse {
  message: string;
}

export const logout = async (refreshToken: string): Promise<LogoutResponse> => {
  try {
    const response = await axios.post<LogoutResponse>('/api/auth/logout', { refreshToken });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to logout');
    }
    throw error;
  }
};
import type { User } from "../../types";
import type { RootState, AppDispatch } from "../store";
import { createReducer, createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { checkSession as checkSessionApi, refreshAccessToken as refreshAccessTokenApi, logout as logoutApi } from "../../services/auth.service";

type AuthState = {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  accessToken: string | null;
  isAuthenticated: boolean;
}

const getInitialContext = (): AuthState => {
  const accessToken = localStorage.getItem('accessToken');
  
  return {
    user: null,
    error: null,
    isLoading: false,
    isAuthenticated: false,
    accessToken: accessToken || null,
  };
};

const initialState: AuthState = getInitialContext();

// Async thunk for session checking (replaces AuthMachine checkSession actor)
export const checkSessionThunk = createAsyncThunk<
  { user: User; accessToken?: string; refreshToken?: string },
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'auth/checkSession',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    const { accessToken, user } = auth;
    const refreshToken = user?.refreshToken || localStorage.getItem('refreshToken');

    if (!accessToken) {
      return rejectWithValue('No access token found');
    }

    try {
      const response = await checkSessionApi(accessToken);
      // Use refreshToken from user object, response root, existing state, or localStorage
      const refreshTokenValue = response.user.refreshToken || response.refreshToken || user?.refreshToken || localStorage.getItem('refreshToken');
      const userWithRefreshToken = refreshTokenValue ? { ...response.user, refreshToken: refreshTokenValue } : response.user;
      return {
        user: userWithRefreshToken,
        accessToken: response.accessToken,
        refreshToken: refreshTokenValue || undefined,
      };
    } catch (error: unknown) {
      // If 401, try to refresh token
      if (error instanceof Error && 'statusCode' in error) {
        const errorWithStatus = error as Error & { statusCode?: number };
        if (errorWithStatus.statusCode === 401 && refreshToken) {
          try {
            const refreshResponse = await refreshAccessTokenApi(refreshToken);
            localStorage.setItem('accessToken', refreshResponse.accessToken);
            // Preserve refreshToken in localStorage (it stays the same unless backend provides a new one)
            // This ensures refreshToken is always accessible even if accessToken expires on reload
            if (!localStorage.getItem('refreshToken')) {
              localStorage.setItem('refreshToken', refreshToken);
            }
            
            // Retry checkSession with new token
            const retryResponse = await checkSessionApi(refreshResponse.accessToken);
            // Use refreshToken from user object (from backend), response root, or existing refreshToken
            const refreshTokenValue = retryResponse.user.refreshToken || retryResponse.refreshToken || refreshToken;
            
            // Store refreshToken in localStorage if we got a new one
            if (refreshTokenValue) {
              localStorage.setItem('refreshToken', refreshTokenValue);
            }
            
            const userWithRefreshToken = refreshTokenValue ? { ...retryResponse.user, refreshToken: refreshTokenValue } : retryResponse.user;
            return {
              user: userWithRefreshToken,
              accessToken: refreshResponse.accessToken,
              refreshToken: refreshTokenValue || undefined,
            };
          } catch (refreshError) {
            return rejectWithValue('Failed to refresh token');
          }
        }
      }
      const errorMessage = error instanceof Error ? error.message : 'Session check failed';
      return rejectWithValue(errorMessage);
    }
  }
);

// Async thunk for logout (invalidates refresh token on server)
export const logoutThunk = createAsyncThunk<
  void,
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'auth/logout',
  async (_, { getState }) => {
    const { auth } = getState();
    const refreshToken = auth.user?.refreshToken || localStorage.getItem('refreshToken');

    if (refreshToken) {
      try {
        await logoutApi(refreshToken);
      } catch (error) {
        console.warn('Logout API call failed, but proceeding with local logout:', error);
      }
    }

    // Always clear local storage and tokens
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
);

// Action creators
export const setAuthenticated = createAction<{ user: User; accessToken: string; refreshToken: string; }>('auth/SET_AUTHENTICATED');
export const setError = createAction<string>('auth/setError');
export const setLoading = createAction<boolean>('auth/setLoading');

const authReducer = createReducer(initialState, (builder) => {
  builder
    // Check session thunk
    .addCase(checkSessionThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(checkSessionThunk.fulfilled, (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      if (accessToken) {
        localStorage.setItem('accessToken', accessToken);
        state.accessToken = accessToken;
      }
      
      // Prioritize refreshToken from user object (from backend), then from payload
      const refreshTokenValue = user.refreshToken || refreshToken;
      const userWithRefreshToken = refreshTokenValue ? { ...user, refreshToken: refreshTokenValue } : user;
      
      // Always store refreshToken in localStorage if available (so it's accessible even if accessToken expires)
      if (refreshTokenValue) {
        localStorage.setItem('refreshToken', refreshTokenValue);
      }

      state.user = userWithRefreshToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(checkSessionThunk.rejected, (state, action) => {
      // Clear tokens on session check failure
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = action.payload || 'Session check failed';
    })
    // SET_AUTHENTICATED - matches AuthMachine SET_AUTHENTICATED event
    .addCase(setAuthenticated, (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      
      localStorage.setItem('accessToken', accessToken);
      
      // Prioritize refreshToken from user object, then from payload
      const refreshTokenValue = user.refreshToken || refreshToken;
      
      // Always store refreshToken in localStorage if available (so it's accessible even if accessToken expires)
      if (refreshTokenValue) {
        localStorage.setItem('refreshToken', refreshTokenValue);
      }

      // Store refreshToken in user object
      const userWithRefreshToken = refreshTokenValue ? { ...user, refreshToken: refreshTokenValue } : user;

      state.user = userWithRefreshToken;
      state.accessToken = accessToken;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    })
    // Logout thunk
    .addCase(logoutThunk.pending, (state) => {
      state.isLoading = true;
      state.error = null;
    })
    .addCase(logoutThunk.fulfilled, (state) => {
      // Local storage already cleared in thunk
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(logoutThunk.rejected, (state) => {
      state.user = null;
      state.accessToken = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    })
    .addCase(setError, (state, action) => {
      state.error = action.payload;
    })
    .addCase(setLoading, (state, action) => {
      state.isLoading = action.payload;
    });
});

export default authReducer;
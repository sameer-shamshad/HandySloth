import authReducer from './features/AuthReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './middleware/authMiddleware';
import userReducer, { loadPersistedUserState } from './features/userReducer';

// Only load persisted user state if tokens exist (user might be authenticated)
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const persistedUserState = (accessToken || refreshToken) ? loadPersistedUserState() : { tools: [], bookmarkedTools: [] };

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  preloadedState: {
    user: {
      tools: persistedUserState.tools || [],
      bookmarkedTools: persistedUserState.bookmarkedTools || [],
      isLoadingTools: false,
      isLoadingBookmarks: false,
      error: null,
      bookmarksError: null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
import authReducer from './features/AuthReducer';
import userReducer, { loadPersistedUserState } from './features/userReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './middleware/authMiddleware';

// Load persisted user state from localStorage (IDs only)
const persistedUserState = loadPersistedUserState();

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
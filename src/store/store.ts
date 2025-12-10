import authReducer from './features/AuthReducer';
import { configureStore } from '@reduxjs/toolkit';
import { authMiddleware } from './middleware/authMiddleware';
import userReducer, { loadPersistedUserState } from './features/userReducer';

// Only load persisted user state if tokens exist (user might be authenticated)
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const persistedUserState = (accessToken || refreshToken) ? loadPersistedUserState() : { toolIds: [], bookmarkedToolIds: [], upvotedToolIds: [], recentlyViewedTools: [] };

export const store = configureStore({
  reducer: {
    auth: authReducer,
    user: userReducer,
  },
  preloadedState: {
    user: {
      toolIds: persistedUserState.toolIds || [],
      bookmarkedToolIds: persistedUserState.bookmarkedToolIds || [],
      upvotedToolIds: persistedUserState.upvotedToolIds || [],
      tools: [],
      bookmarkedTools: [],
      bookmarkedToolsDisplay: [],
      recentlyViewedTools: persistedUserState.recentlyViewedTools || [],
      upvotedTools: [],
      isLoadingTools: false,
      isLoadingBookmarks: false,
      isLoadingBookmarkedToolsDisplay: false,
      isLoadingRecentlyViewedTools: false,
      isLoadingUpvotedTools: false,
      error: null,
      bookmarksError: null,
      bookmarkedToolsDisplayError: null,
      recentlyViewedToolsError: null,
      upvotedToolsError: null,
    },
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppStore = typeof store;
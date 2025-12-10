import type { Middleware } from '@reduxjs/toolkit';
import { setAuthenticated, checkSessionThunk } from '../features/AuthReducer';
import { fetchUserToolsThunk, fetchBookmarkedToolsThunk, fetchBookmarkedToolsDisplayThunk, fetchUpvotedToolsThunk, fetchRecentlyViewedToolsThunk } from '../features/userReducer';

/**
 * Helper to check if localStorage has data
**/

const hasLocalStorageData = (): boolean => {
  try {
    const persistedState = localStorage.getItem('userState');
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      return (
        (parsed.toolIds && parsed.toolIds.length > 0) ||
        (parsed.bookmarkedToolIds && parsed.bookmarkedToolIds.length > 0) ||
        (parsed.upvotedToolIds && parsed.upvotedToolIds.length > 0) ||
        (parsed.recentlyViewedTools && parsed.recentlyViewedTools.length > 0)
      );
    }
  } catch (error) {
    console.error('Failed to check localStorage:', error);
  }
  return false;
};

const hasRecentlyViewedToolsInLocalStorage = (): boolean => {
  try {
    const persistedState = localStorage.getItem('userState');
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      return parsed.recentlyViewedTools && parsed.recentlyViewedTools.length > 0;
    }
  } catch (error) {
    console.error('Failed to check localStorage:', error);
  }
  return false;
};

/**
 * Middleware to automatically fetch user data when authentication state changes
 * Only fetches if localStorage is empty to avoid duplicate calls
**/

export const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action); // Execute the action first
  
  // Trigger fetch on login/register (setAuthenticated) - only if localStorage is empty
  if (setAuthenticated.match(action)) {
    if (!hasLocalStorageData()) { // Only fetch IDs if localStorage is empty
      store.dispatch(fetchUserToolsThunk() as any);
      store.dispatch(fetchBookmarkedToolsThunk() as any);
      store.dispatch(fetchUpvotedToolsThunk() as any);
    }

    // Always fetch bookmarkedToolsDisplay since it's not persisted to localStorage
    store.dispatch(fetchBookmarkedToolsDisplayThunk() as any);
    
    // Fetch recentlyViewedTools only if not in localStorage
    if (!hasRecentlyViewedToolsInLocalStorage()) {
      store.dispatch(fetchRecentlyViewedToolsThunk() as any);
    }
  }

  // Also trigger fetch on session check success (page reload scenario) - only if localStorage is empty
  if (checkSessionThunk.fulfilled.match(action)) {
    if (!hasLocalStorageData()) { // Only fetch IDs if localStorage is empty
      store.dispatch(fetchUserToolsThunk() as any);
      store.dispatch(fetchBookmarkedToolsThunk() as any);
      store.dispatch(fetchUpvotedToolsThunk() as any);
    }
    
    // Always fetch bookmarkedToolsDisplay since it's not persisted to localStorage
    store.dispatch(fetchBookmarkedToolsDisplayThunk() as any);
    
    // Fetch recentlyViewedTools only if not in localStorage
    if (!hasRecentlyViewedToolsInLocalStorage()) {
      store.dispatch(fetchRecentlyViewedToolsThunk() as any);
    }
  }

  return result;
};
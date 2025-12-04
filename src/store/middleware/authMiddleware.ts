import type { Middleware } from '@reduxjs/toolkit';
import { setAuthenticated, checkSessionThunk } from '../features/AuthReducer';
import { fetchUserToolsThunk, fetchBookmarkedToolsThunk } from '../features/userReducer';

/**
 * Middleware to automatically fetch user data when authentication state changes
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action); // Execute the action first
  
  // Trigger fetch on login/register (setAuthenticated)
  if (setAuthenticated.match(action)) {
    // After authentication, automatically fetch user tools and bookmarks
    store.dispatch(fetchUserToolsThunk() as any);
    store.dispatch(fetchBookmarkedToolsThunk() as any);
  }
  
  // Also trigger fetch on session check success (page reload scenario)
  if (checkSessionThunk.fulfilled.match(action)) {
    // After successful session check, fetch user tools and bookmarks
    store.dispatch(fetchUserToolsThunk() as any);
    store.dispatch(fetchBookmarkedToolsThunk() as any);
  }

  return result;
};
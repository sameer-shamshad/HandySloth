import type { Middleware } from '@reduxjs/toolkit';
import { setAuthenticated } from '../features/AuthReducer';
import { fetchUserToolsThunk, fetchBookmarkedToolsThunk } from '../features/userReducer';

/**
 * Middleware to automatically fetch user data when authentication state changes
 */
export const authMiddleware: Middleware = (store) => (next) => (action) => {
  const result = next(action); // Execute the action first
  
  if (setAuthenticated.match(action)) { // Check if it's a setAuthenticated action
    // After authentication, automatically fetch user tools and bookmarks
    store.dispatch(fetchUserToolsThunk() as any);
    store.dispatch(fetchBookmarkedToolsThunk() as any);
  }

  return result;
};
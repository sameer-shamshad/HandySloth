import { logoutThunk, checkSessionThunk } from "./AuthReducer";
import type { RootState, AppDispatch } from "../store";
import { createReducer, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { fetchUserTools, fetchBookmarkedTools } from "../../services/tools.service";

// localStorage key for persisting user state
const USER_STATE_KEY = 'userState';

type UserState = {
  tools: string[]; // Array of tool IDs
  isLoadingTools: boolean;
  bookmarkedTools: string[]; // Array of bookmarked tool IDs
  isLoadingBookmarks: boolean;
  error: string | null;
  bookmarksError: string | null;
}

// Helper function to save user state to localStorage
const saveToLocalStorage = (state: UserState) => {
  try {
    // Only save tool IDs, not loading states or errors
    const stateToSave = {
      tools: state.tools,
      bookmarkedTools: state.bookmarkedTools,
    };
    localStorage.setItem(USER_STATE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save user state to localStorage:', error);
  }
};

// Helper function to load user state from localStorage
export const loadPersistedUserState = (): { tools: string[]; bookmarkedTools: string[] } => {
  try {
    const persistedState = localStorage.getItem(USER_STATE_KEY);
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      return {
        tools: parsed.tools || [],
        bookmarkedTools: parsed.bookmarkedTools || [],
      };
    }
  } catch (error) {
    console.error('Failed to load persisted user state:', error);
  }
  
  return {
    tools: [],
    bookmarkedTools: [],
  };
};

// Helper function to clear user state from localStorage
const clearLocalStorage = () => {
  try {
    localStorage.removeItem(USER_STATE_KEY);
  } catch (error) {
    console.error('Failed to clear user state from localStorage:', error);
  }
};

const initialState: UserState = {
  tools: [],
  bookmarkedTools: [],
  isLoadingTools: false,
  isLoadingBookmarks: false,
  error: null,
  bookmarksError: null,
};

// Async thunks - these check authentication before fetching and return only IDs
export const fetchUserToolsThunk = createAsyncThunk<
  string[], // Return array of tool IDs
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'user/fetchTools',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    
    // Only fetch if user is authenticated
    if (!auth.isAuthenticated) {
      return rejectWithValue('User is not authenticated');
    }

    try {
      const toolIds = await fetchUserTools();
      return toolIds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user tools';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookmarkedToolsThunk = createAsyncThunk<
  string[], // Return array of bookmarked tool IDs
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'user/fetchBookmarkedTools',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();
    
    // Only fetch if user is authenticated
    if (!auth.isAuthenticated) {
      return rejectWithValue('User is not authenticated');
    }

    try {
      const toolIds = await fetchBookmarkedTools();
      return toolIds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookmarked tools';
      return rejectWithValue(errorMessage);
    }
  }
);

// Action to add a tool ID to user's tools (optimistic update)
export const addUserTool = createAction<string>('user/addTool'); // toolId

// Actions to add/remove bookmarked tool IDs (for real-time updates)
export const addBookmarkedTool = createAction<string>('user/addBookmarkedTool'); // toolId
export const removeBookmarkedTool = createAction<string>('user/removeBookmarkedTool'); // toolId

// Action to clear all user data (when user is not authenticated)
export const clearUserData = createAction('user/clearUserData');

const userReducer = createReducer(initialState, (builder) => {
  builder
    .addCase(fetchUserToolsThunk.pending, (state) => {
      state.isLoadingTools = true;
      state.error = null;
    })
    .addCase(fetchUserToolsThunk.fulfilled, (state, action) => {
      state.isLoadingTools = false;
      state.tools = action.payload;
      state.error = null;
      // Save to localStorage after updating tools
      saveToLocalStorage(state);
    })
    .addCase(fetchUserToolsThunk.rejected, (state, action) => {
      state.isLoadingTools = false;
      state.error = action.payload || 'Failed to fetch user tools';
    })
    // Fetch bookmarked tools
    .addCase(fetchBookmarkedToolsThunk.pending, (state) => {
      state.isLoadingBookmarks = true;
      state.bookmarksError = null;
    })
    .addCase(fetchBookmarkedToolsThunk.fulfilled, (state, action) => {
      state.isLoadingBookmarks = false;
      state.bookmarkedTools = action.payload;
      state.bookmarksError = null;
      // Save to localStorage after updating bookmarked tools
      saveToLocalStorage(state);
    })
    .addCase(fetchBookmarkedToolsThunk.rejected, (state, action) => {
      state.isLoadingBookmarks = false;
      state.bookmarksError = action.payload || 'Failed to fetch bookmarked tools';
    })
    // Add tool ID to user's tools (optimistic update)
    .addCase(addUserTool, (state, action) => {
      const toolId = action.payload;
      if (!state.tools.includes(toolId)) {
        state.tools = [toolId, ...state.tools];
        // Save to localStorage after adding tool
        saveToLocalStorage(state);
      }
    })
    // Add bookmarked tool ID (for real-time updates)
    .addCase(addBookmarkedTool, (state, action) => {
      const toolId = action.payload;
      if (!state.bookmarkedTools.includes(toolId)) {
        state.bookmarkedTools = [toolId, ...state.bookmarkedTools];
        // Save to localStorage after adding bookmark
        saveToLocalStorage(state);
      }
    })
    // Remove bookmarked tool ID (for real-time updates)
    .addCase(removeBookmarkedTool, (state, action) => {
      const toolId = action.payload;
      state.bookmarkedTools = state.bookmarkedTools.filter(id => id !== toolId);
      // Save to localStorage after removing bookmark
      saveToLocalStorage(state);
    })
    // Clear user data on logout
    .addCase(logoutThunk.fulfilled, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
      // Clear localStorage on logout
      clearLocalStorage();
    })
    .addCase(logoutThunk.rejected, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
      
      clearLocalStorage(); // Clear localStorage on logout failure too
    })
    // Clear user data when session check fails (user not authenticated)
    .addCase(checkSessionThunk.rejected, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
      // Clear localStorage when session check fails
      clearLocalStorage();
    })
    // Clear all user data (generic action)
    .addCase(clearUserData, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
      // Clear localStorage
      clearLocalStorage();
    });
});

export default userReducer;

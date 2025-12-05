import type { RootState, AppDispatch } from "../store";
import { logoutThunk, checkSessionThunk } from "./AuthReducer";
import { createReducer, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { fetchUserToolIds, fetchBookmarkedToolIds, fetchUpvotedToolIds, fetchBookmarkedTools } from "../../services/tools.service";
import type { Tool, UserBookmarkedTool } from "../../types";

// localStorage key for persisting user state
const USER_STATE_KEY = 'userState';

type UserState = {
  toolIds: string[]; // Array of tool IDs
  bookmarkedToolIds: string[]; // Array of bookmarked tool IDs
  upvotedToolIds: string[]; // Array of upvoted tool IDs
  
  tools: Tool[]; // Array of tools
  bookmarkedTools: Tool[]; // Array of bookmarked tools
  bookmarkedToolsDisplay: UserBookmarkedTool[]; // Array of bookmarked tools for display (name, logo)
  upvotedTools: Tool[]; // Array of upvoted tools
  isLoadingTools: boolean;
  isLoadingBookmarks: boolean;
  isLoadingBookmarkedToolsDisplay: boolean;
  isLoadingUpvotedTools: boolean;
  error: string | null;
  bookmarksError: string | null;
  bookmarkedToolsDisplayError: string | null;
  upvotedToolsError: string | null;
}

// Helper function to save user state to localStorage
const saveToLocalStorage = (state: UserState) => {
  try {
    // Only save tool IDs, not loading states or errors
    const stateToSave = {
      toolIds: state.toolIds,
      bookmarkedToolIds: state.bookmarkedToolIds,
      upvotedToolIds: state.upvotedToolIds,
    };
    localStorage.setItem(USER_STATE_KEY, JSON.stringify(stateToSave));
  } catch (error) {
    console.error('Failed to save user state to localStorage:', error);
  }
};

// Helper function to load user state from localStorage
export const loadPersistedUserState = (): { toolIds: string[]; bookmarkedToolIds: string[]; upvotedToolIds: string[] } => {
  try {
    const persistedState = localStorage.getItem(USER_STATE_KEY);
    if (persistedState) {
      const parsed = JSON.parse(persistedState);
      return {
        toolIds: parsed.toolIds || [],
        bookmarkedToolIds: parsed.bookmarkedToolIds || [],
        upvotedToolIds: parsed.upvotedToolIds || [],
      };
    }
  } catch (error) {
    console.error('Failed to load persisted user state:', error);
  }
  
  return {
    toolIds: [],
    bookmarkedToolIds: [],
    upvotedToolIds: [],
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
  toolIds: [],
  bookmarkedToolIds: [],
  upvotedToolIds: [],
  tools: [],
  bookmarkedTools: [],
  bookmarkedToolsDisplay: [],
  upvotedTools: [],
  isLoadingTools: false,
  isLoadingBookmarks: false,
  isLoadingBookmarkedToolsDisplay: false,
  isLoadingUpvotedTools: false,
  error: null,
  bookmarksError: null,
  bookmarkedToolsDisplayError: null,
  upvotedToolsError: null,
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
      const toolIds = await fetchUserToolIds();
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
      const toolIds = await fetchBookmarkedToolIds();
      return toolIds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookmarked tools';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchUpvotedToolsThunk = createAsyncThunk<
  string[], // Return array of upvoted tool IDs
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'user/fetchUpvotedTools',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return rejectWithValue('User is not authenticated');
    }

    try {
      const toolIds = await fetchUpvotedToolIds();
      return toolIds;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch upvoted tools';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookmarkedToolsDisplayThunk = createAsyncThunk<
  UserBookmarkedTool[], // Return array of bookmarked tools
  void,
  { state: RootState; dispatch: AppDispatch; rejectValue: string }
>(
  'user/fetchBookmarkedToolsDisplay',
  async (_, { getState, rejectWithValue }) => {
    const { auth } = getState();

    if (!auth.isAuthenticated) {
      return rejectWithValue('User is not authenticated');
    }

    try {
      const tools = await fetchBookmarkedTools();
      return tools;
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

// Actions to add/remove upvoted tool IDs (for real-time updates)
export const addUpvotedTool = createAction<string>('user/addUpvotedTool'); // toolId
export const removeUpvotedTool = createAction<string>('user/removeUpvotedTool'); // toolId

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
      state.toolIds = action.payload;
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
      state.bookmarkedToolIds = action.payload;
      state.bookmarksError = null;
      // Save to localStorage after updating bookmarked tools
      saveToLocalStorage(state);
    })
    .addCase(fetchBookmarkedToolsThunk.rejected, (state, action) => {
      state.isLoadingBookmarks = false;
      state.bookmarksError = action.payload || 'Failed to fetch bookmarked tools';
    })
    // Fetch upvoted tools
    .addCase(fetchUpvotedToolsThunk.pending, (state) => {
      state.isLoadingUpvotedTools = true;
      state.upvotedToolsError = null;
    })
    .addCase(fetchUpvotedToolsThunk.fulfilled, (state, action) => {
      state.isLoadingUpvotedTools = false;
      state.upvotedToolIds = action.payload;
      state.upvotedToolsError = null;
      // Save to localStorage after updating upvoted tools
      saveToLocalStorage(state);
    })
    .addCase(fetchUpvotedToolsThunk.rejected, (state, action) => {
      state.isLoadingUpvotedTools = false;
      state.upvotedToolsError = action.payload || 'Failed to fetch upvoted tools';
    })
    // Fetch bookmarked tools display
    .addCase(fetchBookmarkedToolsDisplayThunk.pending, (state) => {
      state.isLoadingBookmarkedToolsDisplay = true;
      state.bookmarkedToolsDisplayError = null;
    })
    .addCase(fetchBookmarkedToolsDisplayThunk.fulfilled, (state, action) => {
      state.isLoadingBookmarkedToolsDisplay = false;
      state.bookmarkedToolsDisplay = action.payload;
      state.bookmarkedToolsDisplayError = null;
    })
    .addCase(fetchBookmarkedToolsDisplayThunk.rejected, (state, action) => {
      state.isLoadingBookmarkedToolsDisplay = false;
      state.bookmarkedToolsDisplayError = action.payload || 'Failed to fetch bookmarked tools display';
    })
    // Add tool ID to user's tools (optimistic update)
    .addCase(addUserTool, (state, action) => {
      const toolId = action.payload;
      if (!state.toolIds.includes(toolId)) {
        state.toolIds = [toolId, ...state.toolIds];
        // Save to localStorage after adding tool
        saveToLocalStorage(state);
      }
    })
    // Add bookmarked tool ID (for real-time updates)
    .addCase(addBookmarkedTool, (state, action) => {
      const toolId = action.payload;
      if (!state.bookmarkedToolIds.includes(toolId)) {
        state.bookmarkedToolIds = [toolId, ...state.bookmarkedToolIds];
        // Save to localStorage after adding bookmark
        saveToLocalStorage(state);
      }
    })
    // Remove bookmarked tool ID (for real-time updates)
    .addCase(removeBookmarkedTool, (state, action) => {
      const toolId = action.payload;
      state.bookmarkedToolIds = state.bookmarkedToolIds.filter(id => id !== toolId);
      // Save to localStorage after removing bookmark
      saveToLocalStorage(state);
    })
    // Add upvoted tool ID (for real-time updates)
    .addCase(addUpvotedTool, (state, action) => {
      const toolId = action.payload;
      if (!state.upvotedToolIds.includes(toolId)) {
        state.upvotedToolIds = [toolId, ...state.upvotedToolIds];
        // Save to localStorage after adding upvote
        saveToLocalStorage(state);
      }
    })
    // Remove upvoted tool ID (for real-time updates)
    .addCase(removeUpvotedTool, (state, action) => {
      const toolId = action.payload;
      state.upvotedToolIds = state.upvotedToolIds.filter(id => id !== toolId);
      // Save to localStorage after removing upvote
      saveToLocalStorage(state);
    })
    // Clear user data on logout
    .addCase(logoutThunk.fulfilled, (state) => {
      state.toolIds = [];
      state.bookmarkedToolIds = [];
      state.upvotedToolIds = [];
      state.tools = [];
      state.bookmarkedTools = [];
      state.bookmarkedToolsDisplay = [];
      state.upvotedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.isLoadingBookmarkedToolsDisplay = false;
      state.isLoadingUpvotedTools = false;
      state.error = null;
      state.bookmarksError = null;
      state.bookmarkedToolsDisplayError = null;
      state.upvotedToolsError = null;
      // Clear localStorage on logout
      clearLocalStorage();
    })
    .addCase(logoutThunk.rejected, (state) => {
      state.toolIds = [];
      state.bookmarkedToolIds = [];
      state.upvotedToolIds = [];
      state.tools = [];
      state.bookmarkedTools = [];
      state.bookmarkedToolsDisplay = [];
      state.upvotedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.isLoadingBookmarkedToolsDisplay = false;
      state.isLoadingUpvotedTools = false;
      state.error = null;
      state.bookmarksError = null;
      state.bookmarkedToolsDisplayError = null;
      state.upvotedToolsError = null;
      
      clearLocalStorage(); // Clear localStorage on logout failure too
    })
    // Clear user data when session check fails (user not authenticated)
    .addCase(checkSessionThunk.rejected, (state) => {
      state.toolIds = [];
      state.bookmarkedToolIds = [];
      state.upvotedToolIds = [];
      state.tools = [];
      state.bookmarkedTools = [];
      state.bookmarkedToolsDisplay = [];
      state.upvotedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.isLoadingBookmarkedToolsDisplay = false;
      state.isLoadingUpvotedTools = false;
      state.error = null;
      state.bookmarksError = null;
      state.bookmarkedToolsDisplayError = null;
      state.upvotedToolsError = null;
      // Clear localStorage when session check fails
      clearLocalStorage();
    })
    // Clear all user data (generic action)
    .addCase(clearUserData, (state) => {
      state.toolIds = [];
      state.bookmarkedToolIds = [];
      state.upvotedToolIds = [];
      state.tools = [];
      state.bookmarkedTools = [];
      state.bookmarkedToolsDisplay = [];
      state.upvotedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.isLoadingBookmarkedToolsDisplay = false;
      state.isLoadingUpvotedTools = false;
      state.error = null;
      state.bookmarksError = null;
      state.bookmarkedToolsDisplayError = null;
      state.upvotedToolsError = null;
      // Clear localStorage
      clearLocalStorage();
    });
});

export default userReducer;

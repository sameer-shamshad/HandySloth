import { logoutThunk } from "./AuthReducer";
import type { Tool } from "../../types";
import type { RootState, AppDispatch } from "../store";
import { createReducer, createAsyncThunk, createAction } from "@reduxjs/toolkit";
import { fetchUserTools, fetchBookmarkedTools } from "../../services/tools.service";

type UserState = {
  tools: Tool[];
  isLoadingTools: boolean;
  bookmarkedTools: Tool[];
  isLoadingBookmarks: boolean;
  error: string | null;
  bookmarksError: string | null;
}

const initialState: UserState = {
  tools: [],
  bookmarkedTools: [],
  isLoadingTools: false,
  isLoadingBookmarks: false,
  error: null,
  bookmarksError: null,
};

// Async thunks - these check authentication before fetching
export const fetchUserToolsThunk = createAsyncThunk< // return type, payload type, thunkAPI type
  Tool[],
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
      const tools = await fetchUserTools();
      return tools;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch user tools';
      return rejectWithValue(errorMessage);
    }
  }
);

export const fetchBookmarkedToolsThunk = createAsyncThunk<
  Tool[],
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
      const tools = await fetchBookmarkedTools();
      return tools;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch bookmarked tools';
      return rejectWithValue(errorMessage);
    }
  }
);

// Action to add a tool to user's tools (optimistic update)
export const addUserTool = createAction<Tool>('user/addTool');

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
    })
    .addCase(fetchBookmarkedToolsThunk.rejected, (state, action) => {
      state.isLoadingBookmarks = false;
      state.bookmarksError = action.payload || 'Failed to fetch bookmarked tools';
    })
    // Add tool to user's tools (optimistic update)
    .addCase(addUserTool, (state, action) => {
      const newTool = action.payload;
      const existingTool = state.tools.find(tool => tool._id === newTool._id);
      if (!existingTool) {
        state.tools = [newTool, ...state.tools];
      }
    })
    // Clear user data on logout
    .addCase(logoutThunk.fulfilled, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
    })
    .addCase(logoutThunk.rejected, (state) => {
      state.tools = [];
      state.bookmarkedTools = [];
      state.isLoadingTools = false;
      state.isLoadingBookmarks = false;
      state.error = null;
      state.bookmarksError = null;
    });
});

export default userReducer;

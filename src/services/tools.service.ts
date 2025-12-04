import axios from '../lib/axios';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { NewTool, Tool, User } from '../types';
import { tools as seedTools } from '../dummy-data/tools';

export const fetchToolsMock = (): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clonedTools = (seedTools as Tool[]).map((tool) => ({ ...tool }));
      resolve(clonedTools);
    }, 3000);
  });
}

export const createToolMock = (tool: NewTool): Promise<Tool> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const now = new Date().toISOString();
      const clonedTool = {
        _id: uuidv4(),
        ...tool,
        views: 0,
        bookmarks: [],
        createdAt: now,
        updatedAt: now,
        logo: '',
      }
      resolve(clonedTool as Tool);
    }, 3000);
  });
}
interface CreateToolRequest {
  name: string;
  shortDescription?: string;
  fullDetail?: string;
  toolImages?: string[];
  category: string[]; // Server expects array
  tags: string[];
  links: {
    telegram: string;
    x: string;
    website: string;
  };
}

interface CreateToolResponse {
  tool: Tool;
  message: string;
}

interface CreateToolInput {
  name: string;
  category: string[]; // Array format from machine context
  shortDescription?: string;
  fullDetail?: string;
  toolImages?: string[];
  tags: string[];
  links: {
    telegram: string;
    x: string;
    website: string;
  };
}

export const createTool = async (tool: CreateToolInput): Promise<Tool> => {
  try {
    const requestData: CreateToolRequest = {
      ...tool,
      category: tool.category || [],
    };

    const response = await axios.post<CreateToolResponse>('/api/tool', requestData);
    
    if (response.status !== 201) {
      throw new Error(response.data.message || 'Failed to create tool');
    }

    return response.data.tool;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to create tool');
    }
    throw error;
  }
};

interface FetchUserToolsResponse {
  tools: Tool[];
  message: string;
}

export const fetchUserTools = async (): Promise<Tool[]> => {
  try {
    const response = await axios.get<FetchUserToolsResponse>('/api/user/tools');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch user tools');
    }

    return response.data.tools;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch user tools');
    }
    throw error;
  }
};

interface BookmarkedTool {
  _id: string;
  bookmarks: User["_id"][];
}

interface BookmarkResponse {
  message: string;
  tool: BookmarkedTool;
}

export const bookmarkTool = async (toolId: string): Promise<BookmarkedTool> => {
  try {
    const response = await axios.post<BookmarkResponse>(`/api/tool/${toolId}/bookmark`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to bookmark tool');
    }

    return response.data.tool;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to bookmark tool');
    }
    throw error;
  }
};

export const removeBookmark = async (toolId: string): Promise<BookmarkedTool> => {
  try {
    const response = await axios.delete<BookmarkResponse>(`/api/tool/${toolId}/bookmark`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to remove bookmark');
    }

    return response.data.tool;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to remove bookmark');
    }
    throw error;
  }
};

interface FetchBookmarkedToolsResponse {
  tools: Tool[];
  message: string;
}

export const fetchBookmarkedTools = async (): Promise<Tool[]> => {
  try {
    const response = await axios.get<FetchBookmarkedToolsResponse>('/api/user/bookmarks');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch bookmarked tools');
    }

    return response.data.tools;
  } catch (error: unknown) {
    console.log('Error fetching bookmarked tools', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch bookmarked tools');
    }
    throw error;
  }
};

interface FetchToolByIdResponse {
  tool: Tool;
  message: string;
}

export const fetchToolById = async (toolId: string): Promise<Tool> => {
  try {
    const response = await axios.get<FetchToolByIdResponse>(`/api/tool/${toolId}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch tool');
    }

    return response.data.tool;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch tool');
    }
    throw error;
  }
};

interface FetchRecentToolsResponse {
  tools: Tool[];
  message: string;
}

export const fetchRecentTools = async (): Promise<Tool[]> => {
  try {
    const response = await axios.get<FetchRecentToolsResponse>('/api/tool/recent');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch recent tools');
    }

    return response.data.tools;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch recent tools');
    }
    throw error;
  }
};

interface FetchTrendingToolsResponse {
  tools: Tool[];
  message: string;
}

export const fetchTrendingTools = async (): Promise<Tool[]> => {
  try {
    const response = await axios.get<FetchTrendingToolsResponse>('/api/tool/trending');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch trending tools');
    }

    return response.data.tools;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch trending tools');
    }
    throw error;
  }
};
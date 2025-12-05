import axios from '../lib/axios';
import { AxiosError } from 'axios';
import type { Tool, ToolCategory, User, UserBookmarkedTool } from '../types';

interface CreateToolRequest {
  name: string;
  logo?: string;
  shortDescription?: string;
  fullDetail?: string;
  toolImages?: string[];
  category: string[]; // Server expects array
  primaryCategory: string; // Required primary category (single value)
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
  logo?: string;
  category: ToolCategory[]; // Array format from machine context
  primaryCategory: ToolCategory; // Required primary category (single value)
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
      category: tool?.category || [],
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

interface FetchToolsByIdsResponse {
  tools: Tool[];
  message: string;
}

// Fetch full tool objects by array of tool IDs
export const fetchToolsByIds = async (toolIds: string[]): Promise<Tool[]> => {
  try {
    if (!toolIds || toolIds.length === 0) {
      return [];
    }
    
    const response = await axios.post<FetchToolsByIdsResponse>('/api/tool/by-ids', { toolIds });
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch tools by IDs');
    }

    return response.data.tools || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch tools by IDs');
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

interface FetchCategoryStatsResponse {
  stats: import('../types').CategoryStats[];
  message?: string;
}

export const fetchCategoryStats = async (): Promise<import('../types').CategoryStats[]> => {
  try {
    const response = await axios.get<FetchCategoryStatsResponse>('/api/tool/stats/categories');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch category stats');
    }

    return response.data.stats || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch category stats');
    }
    throw error;
  }
};

interface UpvotedTool {
  message: string;
  tool: {
    _id: string;
    votes: string[];
  };
}

interface UpvoteResponse {
  message: string;
  tool: {
    _id: string;
    votes: string[];
  };
}

export const upvoteTool = async (toolId: string): Promise<UpvotedTool> => {
  try {
    const response = await axios.post<UpvoteResponse>(`/api/tool/${toolId}/upvote`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to upvote tool');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to upvote tool');
    }
    throw error;
  }
};

export const downvoteTool = async (toolId: string): Promise<UpvotedTool> => {
  try {
    const response = await axios.delete<UpvoteResponse>(`/api/tool/${toolId}/upvote`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to downvote tool');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to downvote tool');
    }
    throw error;
  }
};

interface FetchUserToolsResponse {
  toolIds: string[];
  message: string;
}

export const fetchUserToolIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get<FetchUserToolsResponse>('/api/user/tools/ids');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch user tools');
    }

    return response.data.toolIds || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch user tools');
    }
    throw error;
  }
};

interface FetchBookmarkedToolsResponse {
  bookmarkedToolIds: string[];
  message: string;
}

export const fetchBookmarkedToolIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get<FetchBookmarkedToolsResponse>('/api/user/bookmarks/ids');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch bookmarked tools');
    }

    return response.data.bookmarkedToolIds || [];
  } catch (error: unknown) {
    console.log('Error fetching bookmarked tools', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch bookmarked tools');
    }
    throw error;
  }
};

interface FetchUpvotedToolsResponse {
  votedToolIds: string[];
  message: string;
}

export const fetchUpvotedToolIds = async (): Promise<string[]> => {
  try {
    const response = await axios.get<FetchUpvotedToolsResponse>('/api/user/votes/ids');

    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch upvoted tools');
    }

    return response.data.votedToolIds || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch upvoted tools');
    }
    throw error;
  }
};

interface FetchBookmarkedToolsDisplayResponse {
  bookmarkedTools: UserBookmarkedTool[];
  message: string;
}

export const fetchBookmarkedTools = async (): Promise<UserBookmarkedTool[]> => {
  try {
    const response = await axios.get<FetchBookmarkedToolsDisplayResponse>('/api/user/bookmarks');
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch bookmarked tools');
    }

    return response.data.bookmarkedTools || [];
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch bookmarked tools');
    }
    throw error;
  }
};
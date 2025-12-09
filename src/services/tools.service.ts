import axios from '../lib/axios';
import { AxiosError } from 'axios';
import type { Tool, ToolCard, User, UserBookmarkedTool, CreateToolInput } from '../types';

interface CreateToolResponse {
  tool: ToolCard;
  message: string;
}

export const createTool = async (tool: CreateToolInput): Promise<ToolCard> => {
  try {
    const response = await axios.post<CreateToolResponse>('/api/tool', tool);
    
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

interface UpdateToolResponse {
  tool: ToolCard;
  message: string;
}

export const updateTool = async (toolId: string, tool: CreateToolInput): Promise<ToolCard> => {
  try {
    const response = await axios.put<UpdateToolResponse>(`/api/tool/${toolId}`, tool);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update tool');
    }

    return response.data.tool;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to update tool');
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
  alternative: {
    tool: {
      _id: string;
      name: string;
    };
    totalSaved: number;
    totalAlternatives: number;
  }
  message: string;
}

export const fetchToolById = async (toolId: string): Promise<FetchToolByIdResponse> => {
  try {
    const response = await axios.get<FetchToolByIdResponse>(`/api/tool/${toolId}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch tool');
    }

    console.log('Fetch tool by ID response', response.data);
    return response.data;
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

interface IncrementViewResponse {
  message: string;
}

export const incrementToolView = async (toolId: string): Promise<IncrementViewResponse> => {
  try {
    const response = await axios.post<IncrementViewResponse>(`/api/tool/${toolId}/view`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to increment tool view');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to increment tool view');
    }
    throw error;
  }
};

interface AddRatingRequest {
  rating: number;
  feedback: string;
}

interface RatingResponse {
  message: string;
}

export const addToolRating = async (toolId: string, rating: number, feedback: string): Promise<RatingResponse> => {
  try {
    const response = await axios.post<RatingResponse>(`/api/tool/${toolId}/rating`, {
      rating,
      feedback,
    } as AddRatingRequest);
    
    if (response.status !== 200 && response.status !== 201) {
      throw new Error(response.data.message || 'Failed to add rating');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to add rating');
    }
    throw error;
  }
};

export const updateToolRating = async (toolId: string, rating: number, feedback: string): Promise<RatingResponse> => {
  try {
    const response = await axios.put<RatingResponse>(`/api/tool/${toolId}/rating`, {
      rating,
      feedback,
    } as AddRatingRequest);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to update rating');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to update rating');
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

interface FetchToolsByCategoryResponse {
  tools: Tool[];
  message?: string;
}

export const fetchToolsByCategory = async (primaryCategory: string): Promise<Tool[]> => {
  try {
    const response = await axios.get<FetchToolsByCategoryResponse>(`/api/tool/category/${primaryCategory}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch tools by category');
    }

    return response.data.tools || [];
  } catch (error: unknown) {
    console.log('Error fetching tools by category', error);
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch tools by category');
    }
    throw error;
  }
};

interface PopularAlternativeResponse {
  tool: {
    _id: string;
    name: string;
  };
  totalSaved: number;
  totalAlternatives: number;
  message: string;
}

export const fetchPopularAlternative = async (primaryCategory: string): Promise<PopularAlternativeResponse> => {
  try {
    const response = await axios.get<PopularAlternativeResponse>(`/api/tool/popular-alternative/${primaryCategory}`);
    
    if (response.status !== 200) {
      throw new Error(response.data.message || 'Failed to fetch popular alternative');
    }

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      throw new Error(error.response?.data.message || 'Failed to fetch popular alternative');
    }
    throw error;
  }
};
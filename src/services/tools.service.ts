import axios from '../lib/axios';
import { AxiosError } from 'axios';
import { v4 as uuidv4 } from 'uuid';
import type { NewTool, Tool } from '../types';
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
        bookmarks: 0,
        createdAt: now,
        updatedAt: now,
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
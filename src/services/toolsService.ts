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
      const clonedTool = {
        _id: uuidv4(),
        ...tool,
        clicks: 0,
        views: 0,
        bookmarks: 0,
        createdAt: new Date().toISOString(),
      }
      resolve(clonedTool as Tool);
    }, 3000);
  });
}
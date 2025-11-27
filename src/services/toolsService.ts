import type { Tool } from '../types';
import { tools as seedTools } from '../dummy-data/tools';

export const fetchToolsMock = (): Promise<Tool[]> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const clonedTools = (seedTools as Tool[]).map((tool) => ({ ...tool }));
      resolve(clonedTools);
    }, 3000);
  });
};


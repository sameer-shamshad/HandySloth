import { assign, setup } from 'xstate';
import type { Tool } from '../types';
import { tools as seedTools } from '../dummy-data/tools';

const initialTools: Tool[] = (seedTools as Tool[]).map((tool) => ({ ...tool }));

export const toolMachine = setup({
  types: {
    context: {} as {
      tools: Tool[];
    },
    events: {} as
      | { type: 'ADD_TOOL'; tool: Tool }
      | { type: 'UPDATE_TOOL'; tool: Tool }
      | { type: 'DELETE_TOOL'; id: string }
      | { type: 'INCREMENT_VIEW'; id: string }
      | { type: 'INCREMENT_CLICK'; id: string },
  },
  actions: {
    addTool: assign(({ context, event }) => {
      if (event.type !== 'ADD_TOOL') return context;
      return {
        tools: [event.tool, ...context.tools],
      };
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;
      return {
        tools: context.tools.map((tool) => (tool.id === event.tool.id ? event.tool : tool)),
      };
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;
      return {
        tools: context.tools.filter((tool) => tool.id !== event.id),
      };
    }),
    incrementView: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_VIEW') return context;
      return {
        tools: context.tools.map((tool) =>
          tool.id === event.id ? { ...tool, views: tool.views + 1 } : tool,
        ),
      };
    }),
    incrementClick: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_CLICK') return context;
      return {
        tools: context.tools.map((tool) =>
          tool.id === event.id ? { ...tool, clicks: tool.clicks + 1 } : tool,
        ),
      };
    }),
  },
}).createMachine({
  id: 'toolMachine',
  initial: 'idle',
  context: {
    tools: initialTools,
  },
  states: {
    idle: {
      on: {
        ADD_TOOL: { actions: 'addTool' },
        UPDATE_TOOL: { actions: 'updateTool' },
        DELETE_TOOL: { actions: 'deleteTool' },
        INCREMENT_VIEW: { actions: 'incrementView' },
        INCREMENT_CLICK: { actions: 'incrementClick' },
      },
    },
  },
});

const sortBy = (tools: Tool[], key: 'views' | 'clicks') => [...tools].sort((a, b) => b[key] - a[key]);

export const selectTrendingTools = (tools: Tool[], limit = 5) => sortBy(tools, 'views').slice(0, limit);
export const selectPopularTools = (tools: Tool[], limit = 5) => sortBy(tools, 'clicks').slice(0, limit);
export const selectRecentTools = (tools: Tool[], limit = 5) => [...tools].sort((a, b) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}).slice(0, limit);
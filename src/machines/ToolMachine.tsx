import type { Tool } from '../types';
import { assign, setup, fromPromise } from 'xstate';
import { fetchToolsMock } from '../services/toolsService';

const sortBy = (tools: Tool[], key: 'views' | 'clicks') => [...tools].sort((a, b) => b[key] - a[key]);

export const selectTrendingTools = (tools: Tool[], limit = 5) => sortBy(tools, 'views').slice(0, limit);
export const selectPopularTools = (tools: Tool[], limit = 5) => sortBy(tools, 'clicks').slice(0, limit);
export const selectRecentTools = (tools: Tool[], limit = 5) => [...tools].sort((a, b) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}).slice(0, limit);

export const toolMachine = setup({
  types: {
    context: {} as {
      tools: Tool[];
      recentTools: Tool[];
      popularTools: Tool[];
      trendingTools: Tool[];
    },
    events: {} as
      | { type: 'FETCH_TOOLS'; tools: Tool[] }
      | { type: 'ADD_TOOL'; tool: Tool }
      | { type: 'UPDATE_TOOL'; tool: Tool }
      | { type: 'DELETE_TOOL'; id: string }
      | { type: 'INCREMENT_VIEW'; id: string }
      | { type: 'INCREMENT_CLICK'; id: string },
  },
  actors: {
    fetchTools: fromPromise(() => fetchToolsMock()),
  },
  actions: {
    assignFetchedTools: assign(({ event }) => {
      const tools = (event as unknown as { output: Tool[] }).output;
      return {
        tools,
        recentTools: selectRecentTools(tools),
        popularTools: selectPopularTools(tools),
        trendingTools: selectTrendingTools(tools),
      };
    }),
    fetchTools: assign(({ context, event }) => {
      console.log('fetchTools', event, context);
      if (event.type !== 'FETCH_TOOLS') return context;

      return {
        tools: event.tools,
        recentTools: selectRecentTools(event.tools),
        popularTools: selectPopularTools(event.tools),
        trendingTools: selectTrendingTools(event.tools),
      };
    }),
    addTool: assign(({ context, event }) => {
      if (event.type !== 'ADD_TOOL') return context;
      return {
        tools: [event.tool, ...context.tools],
      };
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;

      const toolToUpdate = context.tools.find((tool) => tool.id === event.tool.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, ...event.tool };
      return {
        tools: context.tools.map((tool) => tool.id === event.tool.id ? updatedTool : tool),
        recentTools: context.recentTools.map((tool) => tool.id === event.tool.id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool.id === event.tool.id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool.id === event.tool.id ? updatedTool : tool),
      };
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;

      const toolToDelete = context.tools.find((tool) => tool.id === event.id);
      if (!toolToDelete) return context;

      return {
        tools: context.tools.filter((tool) => tool.id !== event.id),
        recentTools: context.recentTools.filter((tool) => tool.id !== toolToDelete.id),
        popularTools: context.popularTools.filter((tool) => tool.id !== toolToDelete.id),
        trendingTools: context.trendingTools.filter((tool) => tool.id !== toolToDelete.id),
      };
    }),
    incrementView: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_VIEW') return context;

      const toolToUpdate = context.tools.find((tool) => tool.id === event.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, views: toolToUpdate.views + 1 };
      return {
        tools: context.tools.map((tool) => tool.id === event.id ? updatedTool : tool),
        recentTools: context.recentTools.map((tool) => tool.id === event.id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool.id === event.id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool.id === event.id ? updatedTool : tool),
      };
    }),
    incrementClick: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_CLICK') return context;

      const toolToUpdate = context.tools.find((tool) => tool.id === event.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, clicks: toolToUpdate.clicks + 1 };
      return {
        tools: context.tools.map((tool) => tool.id === event.id ? updatedTool : tool),
        recentTools: context.recentTools.map((tool) => tool.id === event.id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool.id === event.id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool.id === event.id ? updatedTool : tool),
      };
    }),
  },
}).createMachine({
  id: 'toolMachine',
  initial: 'loading',
  context: {
    tools: [],
    recentTools: [],
    popularTools: [],
    trendingTools: [],
  },
  states: {
    loading: {
      invoke: {
        src: 'fetchTools',
        onDone: {
          target: 'idle',
          actions: 'assignFetchedTools',
        },
      },
    },
    idle: {
      on: {
        FETCH_TOOLS: { actions: 'fetchTools' },
        ADD_TOOL: { actions: 'addTool' },
        UPDATE_TOOL: { actions: 'updateTool' },
        DELETE_TOOL: { actions: 'deleteTool' },
        INCREMENT_VIEW: { actions: 'incrementView' },
        INCREMENT_CLICK: { actions: 'incrementClick' },
      },
    },
  },
});
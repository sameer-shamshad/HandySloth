import type { Tool } from '../../types';
import { assign, setup, fromPromise } from 'xstate';
import { fetchRecentTools, fetchTrendingTools } from '../../services/tools.service';

const sortBy = (tools: Tool[], key: 'views') => [...tools].sort((a, b) => b[key] - a[key]);

// Helper functions for backward compatibility (for pages that might still use them)
export const selectTrendingTools = (tools: Tool[], limit = 5) => sortBy(tools, 'views').slice(0, limit);
export const selectPopularTools = (tools: Tool[], limit = 5) => sortBy(tools, 'views').slice(0, limit);
export const selectRecentTools = (tools: Tool[], limit = 5) => [...tools].sort((a, b) => {
  return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
}).slice(0, limit);

export const toolMachine = setup({
  types: {
    context: {} as {
      recentTools: Tool[];
      popularTools: Tool[];
      trendingTools: Tool[];
    },
    events: {} as
      | { type: 'FETCH_TOOLS'; tools: Tool[] }
      | { type: 'ADD_TOOL'; toolListType: 'recent' | 'trending' | 'popular'; tool: Tool }
      | { type: 'UPDATE_TOOL'; tool: Tool }
      | { type: 'DELETE_TOOL'; id: string }
      | { type: 'INCREMENT_VIEW'; id: string }
  },
  actors: {
    fetchRecentTools: fromPromise(async () => {
      const tools = await fetchRecentTools();
      return tools;
    }),
    fetchTrendingTools: fromPromise(async () => {
      const tools = await fetchTrendingTools();
      return tools;
    }),
  },
  actions: {
    assignRecentTools: assign(({ event }) => {
      const tools = (event as unknown as { output: Tool[] }).output;
      return {
        recentTools: tools,
      };
    }),
    assignTrendingTools: assign(({ event }) => {
      const tools = (event as unknown as { output: Tool[] }).output;
      return {
        trendingTools: tools,
        popularTools: tools, // Popular tools use same sorting as trending (by views)
      };
    }),
    fetchTools: assign(({ context, event }) => {
      console.log('fetchTools', event, context);
      if (event.type !== 'FETCH_TOOLS') return context;

      return {
        recentTools: selectRecentTools(event.tools),
        popularTools: selectPopularTools(event.tools),
        trendingTools: selectTrendingTools(event.tools),
      };
    }),
    addTool: assign(({ context, event }) => {
      if (event.type !== 'ADD_TOOL') return context;
    
      if (event.toolListType === 'recent') {
        return { ...context, recentTools: [event.tool, ...context.recentTools] };
      } else if (event.toolListType === 'trending') {
        return { ...context, trendingTools: [event.tool, ...context.trendingTools] };
      } else if (event.toolListType === 'popular') {
        return { ...context, popularTools: [event.tool, ...context.popularTools] };
      }

      return context;
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;

      const recentTool = context.recentTools.find((tool) => tool._id === event.tool._id);
      const trendingTool = context.trendingTools.find((tool) => tool._id === event.tool._id);
      const popularTool = context.popularTools.find((tool) => tool._id === event.tool._id);
      
      if (recentTool) {
        return { ...context, recentTools: context.recentTools.map((tool) => tool._id === event.tool._id ? event.tool : tool) };
      } else if (trendingTool) {
        return { ...context, trendingTools: context.trendingTools.map((tool) => tool._id === event.tool._id ? event.tool : tool) };
      } else if (popularTool) {
        return { ...context, popularTools: context.popularTools.map((tool) => tool._id === event.tool._id ? event.tool : tool) };
      }

      return context;
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;

      return {
        recentTools: context.recentTools.filter((tool) => tool._id !== event.id),
        popularTools: context.popularTools.filter((tool) => tool._id !== event.id),
        trendingTools: context.trendingTools.filter((tool) => tool._id !== event.id),
      };
    }),
    incrementView: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_VIEW') return context;

      return context;
    }),
  },
}).createMachine({
  id: 'toolMachine',
  initial: 'loading',
  context: {
    recentTools: [],
    popularTools: [],
    trendingTools: [],
  },
  states: {
    loading: {
      initial: 'fetchingRecent',
      states: {
        fetchingRecent: {
          invoke: {
            src: 'fetchRecentTools',
            onDone: {
              target: 'fetchingTrending',
              actions: 'assignRecentTools',
            },
            onError: {
              target: '#toolMachine.idle', // Go to idle even if one fails
            },
          },
        },
        fetchingTrending: {
          invoke: {
            src: 'fetchTrendingTools',
            onDone: {
              target: '#toolMachine.idle',
              actions: 'assignTrendingTools',
            },
            onError: {
              target: '#toolMachine.idle', // Go to idle even if one fails
            },
          },
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
      },
    }
  },
});
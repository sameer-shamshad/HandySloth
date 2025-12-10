import type { ToolCard } from '../../types';
import { assign, setup, fromPromise } from 'xstate';
import { fetchToolsByType } from '../../services/tools.service';

export const toolMachine = setup({
  types: {
    context: {} as {
      recentTools: ToolCard[];
      popularTools: ToolCard[];
      trendingTools: ToolCard[];
    },
    events: {} as
      | { type: 'ADD_TOOL'; toolListType: 'recent' | 'trending' | 'popular'; tool: ToolCard }
      | { type: 'UPDATE_TOOL'; tool: ToolCard }
      | { type: 'DELETE_TOOL'; id: string }
  },
  actors: {
    fetchToolsByType: fromPromise(async ({ input }: { input: 'recent' | 'trending' | 'popular' }) => {
      const tools = await fetchToolsByType(input);
      return tools;
    }),
  },
  actions: {
    assignRecentTools: assign(({ event }) => {
      const tools = (event as unknown as { output: ToolCard[] }).output;
      return {
        recentTools: tools || [],
      };
    }),
    assignTrendingTools: assign(({ event }) => {
      const tools = (event as unknown as { output: ToolCard[] }).output;
      return {
        trendingTools: tools || [],
      };
    }),
    assignPopularTools: assign(({ event }) => {
      const tools = (event as unknown as { output: ToolCard[] }).output;
      return {
        popularTools: tools || [],
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
            src: 'fetchToolsByType',
            input: 'recent',
            onDone: {
              target: 'fetchingTrending',
              actions: 'assignRecentTools',
            },
            onError: {
              target: 'fetchingTrending', // Continue to next fetch even if one fails
            },
          },
        },
        fetchingTrending: {
          invoke: {
            src: 'fetchToolsByType',
            input: 'trending',
            onDone: {
              target: 'fetchingPopular',
              actions: 'assignTrendingTools',
            },
            onError: {
              target: 'fetchingPopular', // Continue to next fetch even if one fails
            },
          },
        },
        fetchingPopular: {
          invoke: {
            src: 'fetchToolsByType',
            input: 'popular' as 'popular',
            onDone: {
              target: '#toolMachine.idle',
              actions: 'assignPopularTools',
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
        ADD_TOOL: { actions: 'addTool' },
        UPDATE_TOOL: { actions: 'updateTool' },
        DELETE_TOOL: { actions: 'deleteTool' },
      },
    }
  },
});
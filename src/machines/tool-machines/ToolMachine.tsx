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
      | { type: 'ADD_TOOL'; tool: Tool }
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
      
      // Check if tool already exists in any array to prevent duplicates
      const allTools = [...context.recentTools, ...context.trendingTools, ...context.popularTools];
      const toolExists = allTools.some((t) => t._id === event.tool._id);
      
      // If tool already exists anywhere, don't add it again (should use UPDATE_TOOL instead)
      if (toolExists) {
        return context; // Return unchanged context, tool should be updated instead
      }
      
      // Prepend new tool to recentTools (since it's the most recent)
      const updatedRecentTools = [event.tool, ...context.recentTools];
      // Combine all tools for sorting popular and trending
      const allToolsForSorting = [event.tool, ...allTools];
      
      return {
        ...context,
        recentTools: updatedRecentTools,
        popularTools: selectPopularTools(allToolsForSorting),
        trendingTools: selectTrendingTools(allToolsForSorting),
      };
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;

      // Check if tool exists in any array (recentTools, trendingTools, popularTools)
      const allTools = [...context.recentTools, ...context.trendingTools, ...context.popularTools];
      const toolToUpdate = allTools.find((tool) => tool._id === event.tool._id);
      if (!toolToUpdate) {
        // Tool doesn't exist anywhere, treat as add instead
        return context;
      }

      // Update the tool with latest data from event
      const updatedTool = { ...toolToUpdate, ...event.tool };
      
      // Update tool in all arrays where it exists
      return {
        recentTools: context.recentTools.some((t) => t._id === event.tool._id)
          ? context.recentTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool)
          : context.recentTools,
        popularTools: context.popularTools.some((t) => t._id === event.tool._id)
          ? context.popularTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool)
          : context.popularTools,
        trendingTools: context.trendingTools.some((t) => t._id === event.tool._id)
          ? context.trendingTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool)
          : context.trendingTools,
      };
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;

      // Check if tool exists in any array
      const allTools = [...context.recentTools, ...context.trendingTools, ...context.popularTools];
      const toolToDelete = allTools.find((tool) => tool._id === event.id);
      if (!toolToDelete) return context;

      return {
        recentTools: context.recentTools.filter((tool) => tool._id !== event.id),
        popularTools: context.popularTools.filter((tool) => tool._id !== event.id),
        trendingTools: context.trendingTools.filter((tool) => tool._id !== event.id),
      };
    }),
    incrementView: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_VIEW') return context;

      // Check if tool exists in any array
      const allTools = [...context.recentTools, ...context.trendingTools, ...context.popularTools];
      const toolToUpdate = allTools.find((tool) => tool._id === event.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, views: toolToUpdate.views + 1 };
      return {
        recentTools: context.recentTools.map((tool) => tool._id === event.id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool._id === event.id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool._id === event.id ? updatedTool : tool),
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
import type { Tool, NewTool } from '../types';
import { assign, setup, fromPromise } from 'xstate';
import { fetchToolsMock, createToolMock } from '../services/toolsService';

const initialNewTool: NewTool = {
  name: '',
  category: '',
  shortDescription: '',
  fullDetail: '',
  toolImages: [],
  tags: [],
  links: [],
};

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
      newTool: NewTool;
    },
    events: {} as
      | { type: 'FETCH_TOOLS'; tools: Tool[] }
      | { type: 'ADD_TOOL'; tool: NewTool }
      | { type: 'UPDATE_TOOL'; tool: Tool }
      | { type: 'DELETE_TOOL'; id: string }
      | { type: 'INCREMENT_VIEW'; id: string }
      | { type: 'INCREMENT_CLICK'; id: string }
      | { type: 'CHANGE_FIELD'; field: keyof NewTool; value: NewTool[keyof NewTool] }
      | { type: 'SUBMIT_TOOL' },
  },
  actors: {
    fetchTools: fromPromise(() => fetchToolsMock()),
    createTool: fromPromise(({ input }) => createToolMock(input as NewTool)),
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
    changeField: assign(({ context, event }) => {
      if (event.type !== 'CHANGE_FIELD') return context;
        return {
          ...context,
          newTool: {
            ...context.newTool,
            [event.field]: event.value,
          },
        };
    }),
    addTool: assign(({ context, event }) => {
      // when coming from invoke onDone, event has shape { type: 'done.invoke...', output: Tool }
      const tool = (event as unknown as { output: Tool }).output;
      return {
        ...context,
        newTool: initialNewTool,                            // reset form
        tools: [tool, ...context.tools],
      };
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;

      const toolToUpdate = context.tools.find((tool) => tool._id === event.tool._id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, ...event.tool };
      return {
        tools: context.tools.map((tool) => tool._id === event.tool._id ? updatedTool : tool),
        recentTools: context.recentTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool._id === event.tool._id ? updatedTool : tool),
      };
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;

      const toolToDelete = context.tools.find((tool) => tool._id === event.id);
      if (!toolToDelete) return context;

      return {
        tools: context.tools.filter((tool) => tool._id !== event.id),
        recentTools: context.recentTools.filter((tool) => tool._id !== toolToDelete._id),
        popularTools: context.popularTools.filter((tool) => tool._id !== toolToDelete._id),
        trendingTools: context.trendingTools.filter((tool) => tool._id !== toolToDelete._id),
      };
    }),
    incrementView: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_VIEW') return context;

      const toolToUpdate = context.tools.find((tool) => tool._id === event.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, views: toolToUpdate.views + 1 };
      return {
        tools: context.tools.map((tool) => tool._id === event.id ? updatedTool : tool),
        recentTools: context.recentTools.map((tool) => tool._id === event.id ? updatedTool : tool),
        popularTools: context.popularTools.map((tool) => tool._id === event.id ? updatedTool : tool),
        trendingTools: context.trendingTools.map((tool) => tool._id === event.id ? updatedTool : tool),
      };
    }),
    incrementClick: assign(({ context, event }) => {
      if (event.type !== 'INCREMENT_CLICK') return context;

      const toolToUpdate = context.tools.find((tool) => tool._id === event.id);
      if (!toolToUpdate) return context;

      const updatedTool = { ...toolToUpdate, clicks: toolToUpdate.clicks + 1 };
      return {
        tools: context.tools.map((tool) => tool._id === event.id ? updatedTool : tool),
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
    tools: [],
    recentTools: [],
    popularTools: [],
    trendingTools: [],
    newTool: initialNewTool,
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
        CHANGE_FIELD: { actions: 'changeField' },
        SUBMIT_TOOL: { target: 'creatingTool' }, 
        UPDATE_TOOL: { actions: 'updateTool' },
        DELETE_TOOL: { actions: 'deleteTool' },
        INCREMENT_VIEW: { actions: 'incrementView' },
        INCREMENT_CLICK: { actions: 'incrementClick' },
      },
    },
    creatingTool: {
      invoke: {
        src: 'createTool',
        input: ({ context }) => context.newTool,
        onDone: {
          target: 'idle',
          actions: 'addTool',
        },
      }
    }
  },
});
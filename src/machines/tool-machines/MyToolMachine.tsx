import { assign, setup, fromPromise } from "xstate";
import type { Tool } from "../../types";
import { fetchUserTools } from "../../services/tools.service";

const myToolMachine = setup({
  types: {
    context: {} as {
      tools: Tool[];
      error: string | null;
    },
    events: {} as
      | { type: 'USER_AUTHENTICATED' }
      | { type: 'USER_LOGGED_OUT' }
      | { type: 'FETCH_TOOLS' }
      | { type: 'ADD_TOOL'; tool: Tool }
      | { type: 'UPDATE_TOOL'; tool: Tool }
      | { type: 'DELETE_TOOL'; _id: string }
  },
  actors: {
    fetchUserTools: fromPromise(async () => {
      const tools = await fetchUserTools();
      return tools;
    }),
  },
  actions: {
    assignTools: assign(({ context, event }) => {
      const tools = (event as unknown as { output: Tool[] }).output;
      return {
        ...context,
        tools,
        error: null,
      };
    }),
    setError: assign(({ context, event }) => {
      const error = (event as unknown as { error: Error | unknown }).error;
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch tools';
      return {
        ...context,
        error: errorMessage,
      };
    }),
    clearTools: assign(() => ({
      tools: [],
      error: null,
    })),
    addTool: assign(({ context, event }) => {
      if (event.type !== 'ADD_TOOL') return context;
      return {
        ...context,
        tools: [event.tool, ...context.tools],
      };
    }),
    updateTool: assign(({ context, event }) => {
      if (event.type !== 'UPDATE_TOOL') return context;
      return {
        ...context,
        tools: context.tools.map((tool) => 
          tool._id === event.tool._id ? event.tool : tool
        ),
      };
    }),
    deleteTool: assign(({ context, event }) => {
      if (event.type !== 'DELETE_TOOL') return context;
      return {
        ...context,
        tools: context.tools.filter((tool) => tool._id !== event._id),
      };
    }),
  },
}).createMachine({
  id: 'myToolMachine',
  initial: 'idle',
  context: {
    tools: [],
    error: null,
  },
  states: {
    idle: {
      // Machine stays here until user logs in
      entry: 'clearTools',
      on: {
        USER_AUTHENTICATED: {
          target: 'loading',
        },
      },
    },
    loading: {
      invoke: {
        src: 'fetchUserTools',
        onDone: {
          target: 'loaded',
          actions: 'assignTools',
        },
        onError: {
          target: 'error',
          actions: 'setError',
        },
      },
    },
    loaded: {
      on: {
        USER_LOGGED_OUT: {
          target: 'idle',
          actions: 'clearTools',
        },
        FETCH_TOOLS: {
          target: 'loading',
        },
        ADD_TOOL: {
          actions: 'addTool',
        },
        UPDATE_TOOL: {
          actions: 'updateTool',
        },
        DELETE_TOOL: {
          actions: 'deleteTool',
        },
      },
    },
    error: {
      on: {
        USER_LOGGED_OUT: {
          target: 'idle',
          actions: 'clearTools',
        },
        FETCH_TOOLS: {
          target: 'loading',
        },
      },
    },
  },
});

export default myToolMachine;
import { fromPromise, setup, assign } from "xstate";
import { searchTools, type SearchedTool } from "../../services/tools.service";

const searchToolMachine = setup({
  types: {
    context: {} as {
      query: string;
      results: SearchedTool[];
      error: string | null;
      showDropdown: boolean;
    },
    events: {} as
      | { type: 'CHANGE_QUERY'; query: string }
      | { type: 'SEARCH' }
      | { type: 'RESET' }
      | { type: 'SHOW_DROPDOWN' }
      | { type: 'HIDE_DROPDOWN' }
  },
  actors: {
    searchTools: fromPromise(async ({ input }: { input: string }) => {
      const results = await searchTools(input);
      return results;
    }),
  },
  actions: {
    assignResults: assign(({ event }) => {
      const results = (event as unknown as { output: SearchedTool[] }).output;
      return { 
        results: results || [],
        error: null,
        showDropdown: true,
      };
    }),
    setError: assign(({ event }) => {
      const error = (event as unknown as { error: Error | unknown }).error;
      const errorMessage = error instanceof Error ? error.message : 'An error occurred';
      return { 
        error: errorMessage,
        results: [],
        showDropdown: true,
      };
    }),
    clearError: assign(({ context }) => ({ ...context, error: null })),
    clearQuery: assign(() => ({ 
      query: '', 
      results: [], 
      error: null,
      showDropdown: false,
    })),
    clearResults: assign(({ context }) => ({ 
      ...context, 
      results: [],
      showDropdown: false,
    })),
    changeQuery: assign(({ context, event }) => {
      if (event.type !== 'CHANGE_QUERY') return context;
      return { ...context, query: event.query, error: null };
    }),
    showDropdown: assign(({ context }) => ({ ...context, showDropdown: true })),
    hideDropdown: assign(({ context }) => ({ ...context, showDropdown: false })),
  },
  guards: {
    isValidQuery: ({ event }) => {
      if (event.type !== 'CHANGE_QUERY') return false;
      return event.query.trim().length > 0;
    },
    isEmptyQuery: ({ event }) => {
      if (event.type !== 'CHANGE_QUERY') return false;
      return !event.query.trim();
    },
  },
}).createMachine({
  id: 'searchToolMachine',
  initial: 'idle',
  context: {
    query: '',
    results: [],
    error: null,
    showDropdown: false,
  },
  states: {
    idle: {
      entry: 'clearError',
      on: {
        CHANGE_QUERY: [
          {
            guard: 'isEmptyQuery',
            actions: ['changeQuery', 'clearResults'],
          },
          {
            guard: 'isValidQuery',
            actions: 'changeQuery',
            target: 'debouncing',
          },
        ],
        RESET: {
          actions: 'clearQuery',
        },
        SHOW_DROPDOWN: {
          actions: 'showDropdown',
        },
        HIDE_DROPDOWN: {
          actions: 'hideDropdown',
        },
      },
    },
    debouncing: {
      after: {
        300: {
          target: 'searching',
        },
      },
      on: {
        CHANGE_QUERY: [
          {
            guard: 'isEmptyQuery',
            actions: ['changeQuery', 'clearResults'],
            target: 'idle',
          },
          {
            guard: 'isValidQuery',
            actions: 'changeQuery',
            target: 'debouncing',
          },
        ],
        RESET: {
          actions: 'clearQuery',
          target: 'idle',
        },
      },
    },
    searching: {
      invoke: {
        src: 'searchTools',
        input: ({ context }) => context.query.trim(),
        onDone: {
          target: 'idle',
          actions: 'assignResults',
        },
        onError: {
          target: 'idle',
          actions: 'setError',
        },
      },
      on: {
        CHANGE_QUERY: [
          {
            guard: 'isEmptyQuery',
            actions: ['changeQuery', 'clearResults'],
            target: 'idle',
          },
          {
            guard: 'isValidQuery',
            actions: 'changeQuery',
            target: 'debouncing',
          },
        ],
        RESET: {
          actions: 'clearQuery',
          target: 'idle',
        },
      },
    },
  },
});

export default searchToolMachine;
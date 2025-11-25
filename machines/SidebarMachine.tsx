import { setup, assign } from 'xstate';

export const sidebarMachine = setup({
  types: {
    context: {} as {
      isDarkMode: boolean;
      isSettingsOpen: boolean;
    },
    input: {} as {
      isDarkMode?: boolean;
      isSettingsOpen?: boolean;
    },
    events: {} as
      | { type: 'TOGGLE_DARK_MODE' }
      | { type: 'TOGGLE_SETTINGS' }
      | { type: 'CLOSE_SETTINGS' },
  },
  actions: {
    toggleDarkMode: assign(({ context }) => {
      const newDarkMode = !context.isDarkMode;
      // Toggle dark class on document root
      if (typeof document !== 'undefined') {
        if (newDarkMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
      return { isDarkMode: newDarkMode };
    }),
    toggleSettings: assign(({ context }) => ({
      isSettingsOpen: !context.isSettingsOpen,
    })),
    closeSettings: assign(() => ({
      isSettingsOpen: false,
    })),
  },
}).createMachine({
  id: 'sidebar',
  initial: 'idle',
  context: ({ input }) => ({
    isDarkMode: input?.isDarkMode ?? false,
    isSettingsOpen: input?.isSettingsOpen ?? false,
  }),
  states: {
    idle: {
      on: {
        TOGGLE_DARK_MODE: {
          actions: 'toggleDarkMode',
        },
        TOGGLE_SETTINGS: {
          actions: 'toggleSettings',
        },
        CLOSE_SETTINGS: {
          actions: 'closeSettings',
        },
      },
    },
  },
});
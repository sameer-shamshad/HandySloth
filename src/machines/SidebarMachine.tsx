import { setup, assign } from 'xstate';

const DARK_MODE_STORAGE_KEY = 'darkMode';

const getInitialDarkMode = () => {
  if (typeof window === 'undefined') return false;

  const storedPreference = window.localStorage.getItem(DARK_MODE_STORAGE_KEY);
  if (storedPreference !== null) {
    return storedPreference === 'true';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches;
};

const applyDarkModePreference = (isDark: boolean) => {
  if (typeof document !== 'undefined') {
    document.documentElement.classList.toggle('dark', isDark);
  }

  if (typeof window !== 'undefined') {
    window.localStorage.setItem(DARK_MODE_STORAGE_KEY, String(isDark));
  }
};

const initialDarkMode = getInitialDarkMode();
applyDarkModePreference(initialDarkMode);

// const toggleSidebar = async (isOpen: boolean) => {
//   if (typeof document === 'undefined') return;
//   const sidebar = document.getElementById('sidebar');
//   if (!sidebar) return;

//   if (isOpen)
//     sidebar.classList.add('active');
//   else
//     sidebar.classList.remove('active');
// };

export const sidebarMachine = setup({
  types: {
    context: {} as {
      isDarkMode: boolean;
      isSettingsOpen: boolean;
      isSidebarOpen: boolean;
    },
    input: {} as {
      isDarkMode?: boolean;
      isSettingsOpen?: boolean;
      isSidebarOpen?: boolean;
    },
    events: {} as
      | { type: 'TOGGLE_DARK_MODE' }
      | { type: 'TOGGLE_SETTINGS' }
      | { type: 'CLOSE_SETTINGS' }
      | { type: 'TOGGLE_SIDEBAR' }
      | { type: 'CLOSE_SIDEBAR' },
  },
  actions: {
    toggleDarkMode: assign(({ context }) => {
      const nextDarkMode = !context.isDarkMode;
      applyDarkModePreference(nextDarkMode);

      return {
        isDarkMode: nextDarkMode,
      };
    }),
    toggleSettings: assign(({ context }) => ({
      isSettingsOpen: !context.isSettingsOpen,
    })),
    closeSettings: assign(() => ({
      isSettingsOpen: false,
    })),
    toggleSidebar: assign(({ context }) => {
      const nextSidebarOpen = !context.isSidebarOpen;
      // toggleSidebar(nextSidebarOpen);
      return {
        isSidebarOpen: nextSidebarOpen,
      };
    }),
    closeSidebar: assign(() => {
      // toggleSidebar(false);
      return {
        isSidebarOpen: false,
      };
    }),
  },
}).createMachine({
  id: 'sidebar',
  initial: 'idle',
  context: {
    isDarkMode: initialDarkMode,
    isSettingsOpen: false,
    isSidebarOpen: false,
  },
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
        TOGGLE_SIDEBAR: {
          actions: 'toggleSidebar',
        },
        CLOSE_SIDEBAR: {
          actions: 'closeSidebar',
        },
      },
    },
  },
});
import { useEffect } from 'react';
import { useMachine } from '@xstate/react';
import { NavLink } from 'react-router-dom';
import { sidebarMachine } from '../../machines/SidebarMachine';
import SettingsMenu from './SettingsMenu';

interface NavItem {
  label: string;
  icon: string;
  to: string;
  invert?: boolean;
}

const Sidebbar = () => {
  
  const getInitialDarkMode = () => {
    if (typeof window === 'undefined') return false;
    const savedMode = localStorage.getItem('darkMode');
    if (savedMode !== null) {
      return savedMode === 'true';
    }
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  };

  const [state, send] = useMachine(sidebarMachine, {
    input: {
      isDarkMode: getInitialDarkMode(),
      isSettingsOpen: false,
    },
  });
  
  const isDarkMode = state.context.isDarkMode;
  const isSettingsOpen = state.context.isSettingsOpen;

  // Apply dark mode class on mount
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Save dark mode preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('darkMode', isDarkMode.toString());
    }
  }, [isDarkMode]);

  const navItems: NavItem[] = [
    { label: 'Home', icon: 'home', to: '/', invert: false },
    { label: 'Dashboard', icon: 'dashboard', to: '/dashboard', invert: false },
    { label: 'Trending', icon: 'trending_up', to: '/trending', invert: false },
    { label: 'Popular', icon: 'format_quote', to: '/popular', invert: true },
    { label: 'Category', icon: 'grid_view', to: '/category', invert: false },
    { label: 'Submit/Advertise', icon: 'send', to: '/submit', invert: false },
    { label: 'Contact Us', icon: 'chat', to: '/contact', invert: false },
  ];

  return (
    <aside className="flex flex-col h-screen w-64 bg-main-color dark:bg-secondary-bg border-r border-group-bg p-6
      2xl:flex-row 2xl:w-full 2xl:h-[80px] 2xl:items-center"
    >
      {/* Logo Section */}
      <div className="flex items-center gap-3 p-6 border-b border-group-bg">
        <div className="w-10 h-10 rounded-full bg-shadow-color flex items-center justify-center">
          <SlothIcon />
        </div>
        <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black-color'}`}>HandySloth</span>
      </div>

      {/* Navigation Items */}
      <nav className="gap-4 flex flex-col 2xl:flex-row 2xl:items-center 2xl:gap-0">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `w-full flex items-center gap-3 px-4 py-2 rounded-lg 2xl:w-max transition-colors ${
                isActive
                  ? 'bg-shadow-color text-black-color dark:bg-secondary-bg dark:text-primary-color'
                  : 'text-gray-500! hover:bg-shadow-color'
              }`
            }
          >
            <span className={`material-symbols-outlined ${item.invert ? 'rotate-180' : ''}`}>{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Bottom Controls */}
      <div className="
          relative gap-3 flex items-center justify-between border-t border-group-bg mt-auto
          [&>button]:bg-primary-bg [&>button]:dark:bg-main-color! [&>button]:text-black-color! 
          [&>button]:font-medium [&>button]:hover:opacity-90 [&>button]:transition-opacity [&>button]:rounded-lg
          2xl:ml-auto
        "
      >
        <button
          className="flex-1"
          onClick={() => {
            console.log('Connect clicked');
          }}
        >
          <span className="material-symbols-outlined">network_node</span>
          <span>Connect</span>
        </button>

          <button
            className="rounded-lg"
            onClick={() => send({ type: 'TOGGLE_SETTINGS' })}
          >
            <span className="material-symbols-outlined text-[20px]!">settings</span>
          </button>
          {
            isSettingsOpen && (
              <SettingsMenu
                isDarkMode={isDarkMode}
                onToggleDarkMode={() => send({ type: 'TOGGLE_DARK_MODE' })}
                onClose={() => send({ type: 'CLOSE_SETTINGS' })}
              />
            )
          }
      </div>
    </aside>
  );
};

// Icon Components
const SlothIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="12" r="10" fill="currentColor" opacity="0.3" />
    <circle cx="9" cy="9" r="1.5" fill="currentColor" />
    <circle cx="15" cy="9" r="1.5" fill="currentColor" />
    <path d="M8 14C8 14 10 16 12 16C14 16 16 14 16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default Sidebbar;

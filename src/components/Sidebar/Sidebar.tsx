// import "./Sidebar.css";
import { useEffect } from 'react';
import SettingsMenu from './SettingsMenu';
import { useMachine } from '@xstate/react';
import { NavLink } from 'react-router-dom';
import { sidebarMachine } from '../../machines/SidebarMachine';
import { useModal } from '../../context/ModalProvider';
import AuthModal from '../AuthModal';

interface NavItem {
  label: string;
  icon: string;
  to: string;
  invert?: boolean;
}

const Sidebar = () => {
  const { openModal } = useModal();
  
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
      // isSidebarOpen: false,
      isSettingsOpen: false,
    },
  });
  
  const isDarkMode = state.context.isDarkMode;
  const isSidebarOpen = state.context.isSidebarOpen;
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
    <aside id='sidebar' className="flex items-center justify-between md:flex-col md:h-screen md:w-68
      bg-primary-bg md:bg-main-color md:dark:bg-primary-bg border-r border-group-bg px-4 py-2 sm:px-6 sm:pb-10 2xl:py-6
      2xl:flex-row 2xl:w-full 2xl:h-auto 2xl:items-center"
    >
      <button 
        type="button" 
        className="material-symbols-outlined md:invisible" 
        onClick={() => send({ type: 'TOGGLE_SIDEBAR' })}
      >menu</button>

      {/* Logo Section */}
      <div className="flex items-center gap-3 py-6 ml-12 md:ml-0 2xl:py-0">
        <div className="w-10 h-10 rounded-full bg-shadow-color flex items-center justify-center">
          <img 
            src="/src/assets/HandySloth Logo.png" 
            alt="HandySloth"
            className="w-full h-full object-contain"
          />
        </div>
        <span className={`hidden md:block text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black-color'}`}>HandySloth</span>
      </div>

      {/* Navigation Items */}
      <nav className={`fixed top-0 ${isSidebarOpen ? 'left-0' : '-left-full'} transition-left duration-300 w-full bg-transparent z-1 
        md:bg-transparent md:z-0 md:py-0 md:px-0
        md:relative md:left-0 gap-4 flex flex-col 2xl:flex-row 2xl:items-center 2xl:gap-0 2xl:ml-6`}
        onClick={() => send({ type: 'CLOSE_SIDEBAR' })}
      >
        <div className='w-[330px] md:w-full bg-main-color dark:bg-primary-bg md:bg-transparent py-6 px-4 h-screen md:px-0 md:h-auto md:py-0'>

          <div className="flex items-center gap-3 py-4 px-4 md:hidden">
            <div className="w-12 h-12 rounded-full bg-shadow-color flex items-center">
              <img 
                src="/src/assets/HandySloth Logo.png" 
                alt="HandySloth"
                className="w-full h-full object-contain"
              />
            </div>
            <span className={`text-lg font-semibold ${isDarkMode ? 'text-white' : 'text-black-color'}`}>HandySloth</span>
          </div>

          <div className="flex flex-col gap-2 2xl:flex-row 2xl:items-center 2xl:gap-0">
            {
              navItems.map((item) => (
                <NavLink
                  key={item.label}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    `w-full flex items-center gap-3 px-4 py-4 md:py-2 rounded-2xl 2xl:w-max transition-colors ${
                      isActive
                        ? 'bg-[#8fd7d7] dark:bg-[#080a13] text-black-color dark:text-primary-color'
                        : 'text-gray-500! hover:bg-shadow-color'
                    }`
                  }
                >
                  <span className={`material-symbols-outlined ${item.invert ? 'rotate-180' : ''}`}>{item.icon}</span>
                  <span className="text-sm font-medium">{item.label}</span>
                </NavLink>
              ))
            }
          </div>
        </div>
      </nav>

      {/* Bottom Controls */}
      <div className="
          relative gap-3 flex items-center md:mt-auto 2xl:mt-0
          [&>button]:bg-transparent [&>button]:text-gray-500! md:[&>button]:bg-primary-bg md:[&>button]:dark:bg-main-color! 
          md:[&>button]:text-black-color! 
          [&>button]:font-medium [&>button]:hover:opacity-90 [&>button]:transition-opacity [&>button]:rounded-lg
          2xl:ml-auto
        "
      >
        <button
          type="button"
          className="flex items-center justify-center md:gap-2 py-2! rounded-full! pl-4! pr-6!"
          onClick={() => {
            openModal({
              component: <AuthModal />,
              title: '',
              size: 'sm',
            });
          }}
        >
          <span className="material-symbols-outlined">network_node</span>
          <span className="hidden md:block">Connect</span>
        </button>

          <button
            type="button"
            className="rounded-lg! p-2!"
            onClick={() => send({ type: 'TOGGLE_SETTINGS' })}
          >
            <span className="material-symbols-outlined text-[20px]! align-middle">settings</span>
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

export default Sidebar;
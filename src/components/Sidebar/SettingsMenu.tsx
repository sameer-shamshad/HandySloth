import React, { useRef, useEffect } from 'react';
import { useAuth } from '../../context';

interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isDarkMode, onToggleDarkMode, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const { state: authState, send: authSend } = useAuth();

  const isAuthenticated = authState.matches('authenticated');

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [onClose]);

  return (
    <div
      ref={menuRef}
      className="absolute top-full right-0 w-41 md:bottom-full md:top-auto md:left-[80%] mb-2 md:w-56 bg-main-color rounded-sm shadow-lg 
      p-2 z-50 pb-4 2xl:left-[-38%] 2xl:top-full 2xl:mt-2 2xl:h-max
      "
    >
      {/* Dark Mode Toggle */}
      <button
        type="button"
        className="w-full! flex items-center justify-between border-b border-gray-500 text-black-color! py-4! md:py-7! mb-2 rounded-none! bg-transparent! transition-colors"
        onClick={onToggleDarkMode}
      >
        <span className="text-sm font-medium text-black-color">Dark Mode</span>
        <div
          className={`relative w-11 h-6 ml-auto rounded-full transition-colors ${
            isDarkMode ? 'bg-white' : 'bg-gray-500'
          }`}
        >
          <div
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full transition-transform ${
              isDarkMode ? 'translate-x-5 bg-main-color' : 'translate-x-0 bg-white'
            }`}
          />
        </div>
      </button>

      {/* Profile */}
      <button
        type="button"
        className="w-full! flex items-center justify-start! gap-3 py-2! bg-transparent! transition-colors"
        onClick={() => {
          onClose();
        }}
        >
        <span className="material-symbols-outlined text-black-color">person</span>
        <span className="text-sm font-medium text-black-color">Profile</span>
      </button>

      {/* Disconnect */}
      <button
        type="button"
        disabled={!isAuthenticated}
        className="w-full! flex items-center justify-start! bg-transparent! mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => {
          authSend({ type: 'LOGOUT' });
          onClose();
        }}
      >
        <span className="material-symbols-outlined text-black-color">link_off</span>
        <span className="text-sm font-medium text-black-color">Disconnect</span>
      </button>
    </div>
  );
};

export default SettingsMenu;
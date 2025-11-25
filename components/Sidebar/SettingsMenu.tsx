import React, { useRef, useEffect } from 'react';

interface SettingsMenuProps {
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onClose: () => void;
}

const SettingsMenu: React.FC<SettingsMenuProps> = ({ isDarkMode, onToggleDarkMode, onClose }) => {
  const menuRef = useRef<HTMLDivElement>(null);

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
      className="absolute bottom-full left-[80%] mb-2 w-56 bg-main-color rounded-lg shadow-lg p-2 z-50 
        2xl:left-[-38%] 2xl:top-full 2xl:mt-2 2xl:h-40
      "
    >
      {/* Dark Mode Toggle */}
      <button
        className="w-full! flex items-center justify-between border-b border-gray-500 text-black-color! py-7! mb-2 rounded-none! bg-transparent! transition-colors"
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
        className="w-full! flex items-center justify-start! gap-3 bg-transparent! transition-colors"
        onClick={() => {
          console.log('Profile clicked');
          onClose();
        }}
      >
        <span className="material-symbols-outlined text-black-color">person</span>
        <span className="text-sm font-medium text-black-color">Profile</span>
      </button>

      {/* Disconnect */}
      <button
        className="w-full! flex items-center justify-start! bg-transparent! transition-colors text-left text-red-500"
        onClick={() => {
          console.log('Disconnect clicked');
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
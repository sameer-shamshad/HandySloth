import { useMachine } from '@xstate/react';
import ToolList from '../Profile/ToolList';
import { useEffect, useRef, useCallback } from 'react';
import searchToolMachine from '../../machines/tool-machines/SearchToolMachine';

interface SearchBarProps {
  className?: string;
}

const SearchBar = ({ className = '' }: SearchBarProps) => {
  const [state, send] = useMachine(searchToolMachine);
  const { query, results, error, showDropdown } = state.context;

  const dropdownRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const isLoading = state.matches('searching') || state.matches('debouncing');

  // Position dropdown relative to input
  useEffect(() => {
    if (showDropdown && searchInputRef.current && dropdownRef.current && containerRef.current) {
      const inputRect = searchInputRef.current.getBoundingClientRect();
      dropdownRef.current.style.top = `${inputRect.height}px`;
      dropdownRef.current.style.width = `${inputRect.width}px`;
    }
  }, [showDropdown, results]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        send({ type: 'HIDE_DROPDOWN' });
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [send]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    send({ type: 'CHANGE_QUERY', query: e.target.value });
  };

  const handleInputFocus = () => {
    if (results.length > 0) {
      send({ type: 'SHOW_DROPDOWN' });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      send({ type: 'HIDE_DROPDOWN' });
      searchInputRef.current?.blur();
    }
  };

  // Handle tool click from ToolList - close dropdown and clear query
  const handleToolClick = useCallback(() => {
    send({ type: 'RESET' });
  }, [send]);

  return (
    <div ref={containerRef} className={`relative flex-1 ${className}`}>
      <input
        type="search"
        value={query}
        ref={searchInputRef}
        onKeyDown={handleKeyDown}
        placeholder="Search tools"
        onFocus={handleInputFocus}
        onChange={handleInputChange}
        className="rounded-full text-primary-color outline-0 w-full
          bg-primary-bg hidden xl:block px-8 py-3 text-lg outline-none shadow-[0_0_20px_0_rgba(0,0,0,0.1)]"
      />

      {showDropdown && (
        <div ref={dropdownRef} className="absolute z-50 mt-1 bg-transparent">
          {isLoading ? (
            <div className="px-4 py-8 text-center text-secondary-color bg-primary-bg rounded-lg shadow-[0_0_20px_0_rgba(0,0,0,0.1)] border border-border-color">
              Searching...
            </div>
          ) : error ? (
            <div className="px-4 py-8 text-center text-red-500 bg-primary-bg rounded-lg shadow-[0_0_20px_0_rgba(0,0,0,0.1)] border border-border-color">
              {error}
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-8 text-center text-secondary-color bg-primary-bg rounded-lg shadow-[0_0_20px_0_rgba(0,0,0,0.1)] border border-border-color">
              No tools found
            </div>
          ) : (
            <div className="bg-primary-bg rounded-lg shadow-[0_0_20px_0_rgba(0,0,0,0.1)] border border-border-color overflow-hidden">
              <ToolList tools={results} clickable={true} onToolClick={handleToolClick} />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;


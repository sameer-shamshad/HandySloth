import "bootstrap";
import { useState, memo, useEffect } from 'react';
import type { Tool } from '../../types';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthProvider';
import { bookmarkTool, removeBookmark } from '../../services/tools.service';

const ToolCard = memo(({ tool, tag }: {tool: Tool, tag: string }) => {
  const navigate = useNavigate();
  const { state: authState } = useAuth();
  const userId = authState.context.user?._id;

  const [isBookmarked, setIsBookmarked] = useState<boolean>(() => {
    return tool?.bookmarks?.includes(userId || '') || false;
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const isAuthenticated = authState.matches('authenticated');

  // Sync bookmark state when tool or user changes
  useEffect(() => {
    if (userId && Array.isArray(tool?.bookmarks)) {
      setIsBookmarked(tool.bookmarks.includes(userId));
    } else {
      setIsBookmarked(false);
    }
  }, [tool.bookmarks, userId]);

  const handleBookmark = async (e: React.MouseEvent) => {
    e.stopPropagation();
    
    // Only allow bookmarking if user is authenticated
    if (!isAuthenticated || !userId) {
      return;
    }

    // Prevent action if already loading
    if (isLoading) {
      return;
    }

    setIsLoading(true);
    const previousBookmarkState = isBookmarked;

    // Optimistically update UI
    setIsBookmarked(!isBookmarked);

    try {
      const updatedTool = previousBookmarkState
        ? await removeBookmark(tool._id)
        : await bookmarkTool(tool._id);
      
      // Sync with API response
      if (updatedTool && Array.isArray(updatedTool.bookmarks)) {
        setIsBookmarked(updatedTool.bookmarks.includes(userId));
      }
    } catch (error) {
      // Revert optimistic update on error
      setIsBookmarked(previousBookmarkState);
      console.error('Failed to update bookmark:', error);
      // Optionally show a toast/notification here
    } finally {
      setIsLoading(false);
    }
  };

  const handleLinkClick = (e: React.MouseEvent) => {
    e.stopPropagation();
  };

  return (
    <div 
      onClick={() => navigate(`/tool/${tool._id}`)}
      className="relative flex flex-col gap-4 rounded-2xl bg-[#E2E2FF] p-6 dark:bg-secondary-bg cursor-pointer"
    >
      <div className="flex gap-3 pt-3">
        <img src={tool.logo} alt={tool.name} className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg object-cover shadow-[0_0_50px_1px_#A9ECEC] dark:shadow-[0_0_30px_1px_#A9ECEC4D]" />
        <div>
          <p className="text-base font-semibold text-primary-color">{tool.name}</p>
          <p className="text-[11px] uppercase tracking-wide text-secondary-color mt-1">{tool.category.join(', ')}</p>
          <p className="text-xs text-secondary-color font-maven-pro my-1">{tool.shortDescription}</p>
        </div>
        <span className="absolute -top-3 left-0 rounded-md bg-main-color w-14 text-center py-1 text-sm font-medium text-black-color">
          {tag}
        </span>

        {isAuthenticated && (
          <button 
            type="button"
            onClick={handleBookmark}
            disabled={isLoading}
            className='h-max! w-max! p-1! text-primary-color ml-auto bg-transparent! disabled:opacity-50 disabled:cursor-not-allowed'
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark tool'}
          >
            {
              isBookmarked ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isLoading ? "opacity-50" : ""} viewBox="0 0 16 16">
                  <path d="M2 2v13.5a.5.5 0 0 0 .74.439L8 13.069l5.26 2.87A.5.5 0 0 0 14 15.5V2a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" className={isLoading ? "opacity-50" : ""} viewBox="0 0 16 16">
                  <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1z"/>
                </svg>
              )
            }
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-3 text-xs font-medium mt-auto">
        {[
          { label: 'Telegram', url: tool.links.telegram },
          { label: 'X', url: tool.links.x },
          { label: 'Website', url: tool.links.website },
        ].map((link) => (
          <a
            href={link.url}
            key={link.label}
            onClick={handleLinkClick}
            className={`w-full font-extralight! flex-1 text-center rounded-full shadow-[0_0_90px_0.1px_#A9ECEC] dark:shadow-none border-2 border-main-color dark:border-none px-4 lg:px-2 py-1 md:py-2 bg-primary-bg 
            text-primary-color drop-shadow-sm shadow-main-color${link.url === '' ? ' pointer-events-none opacity-50' : ''}`}
          >
            {link.label}
          </a>
        ))}
      </div>
    </div>
  );
});

export const ToolCardSkeleton = () => {
  return (
    <div className="relative flex flex-col gap-4 rounded-2xl bg-[#E2E2FF] p-6 dark:bg-secondary-bg animate-pulse">
      <div className="flex gap-3 pt-3 w-full">
        <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-lg bg-primary-color/20" />
        <div className="flex-1 space-y-2">
          <div className="h-4 w-1/2 rounded bg-primary-color/30" />
          <div className="h-3 w-1/3 rounded bg-primary-color/20" />
          <div className="h-3 w-3/4 rounded bg-primary-color/10" />
        </div>
        <span className="absolute -top-3 left-0 rounded-md bg-main-color/50 w-14 py-2 text-sm font-medium text-black-color/0">
          &nbsp;
        </span>
        <div className="h-5 w-5 ml-auto rounded bg-primary-color/20" />
      </div>
      <div className="grid grid-cols-3 gap-3 text-xs font-medium mt-auto w-full">
        {[0, 1, 2].map((slot) => (
          <div
            key={slot}
            className="h-8 rounded-full bg-primary-color/10 border-2 border-main-color/40"
          />
        ))}
      </div>
    </div>
  );
};

export default ToolCard;
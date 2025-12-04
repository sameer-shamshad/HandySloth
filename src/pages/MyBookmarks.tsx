import { useEffect, useState } from 'react';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchBookmarkedToolsThunk } from '../store/features/userReducer';
import { fetchToolsByIds } from '../services/tools.service';
import type { Tool } from '../types';
import { useAuth } from '../hooks/useAuth';

const MyBookmarksPage = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { bookmarkedTools: bookmarkedToolIds, isLoadingBookmarks } = useAppSelector((state) => state.user);
    const [tools, setTools] = useState<Tool[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    // Fetch bookmarked tool IDs if user is authenticated but IDs haven't been fetched
    useEffect(() => {
        if (isAuthenticated && bookmarkedToolIds.length === 0 && !isLoadingBookmarks) {
            dispatch(fetchBookmarkedToolsThunk());
        }
    }, [isAuthenticated, bookmarkedToolIds.length, isLoadingBookmarks, dispatch]);

    // Fetch full tools by IDs when IDs are available
    useEffect(() => {
        const fetchTools = async () => {
            if (bookmarkedToolIds.length === 0) {
                setTools([]);
                return;
            }

            setIsLoading(true);
            try {
                const fullTools = await fetchToolsByIds(bookmarkedToolIds);
                setTools(fullTools);
            } catch (error) {
                console.error('Failed to fetch bookmarked tools by IDs:', error);
                setTools([]);
            } finally {
                setIsLoading(false);
            }
        };

        fetchTools();
    }, [bookmarkedToolIds]);

    return (
      <div className='h-full'>
          <h3 className='pb-4 text-xl font-medium text-primary-color'>My Bookmarks</h3>
          {isLoading ? (
              <div>Loading...</div>
          ) : (
              <ToolsGrid tools={tools} tag="index" />
          )}
      </div>
    );
};

export default MyBookmarksPage;
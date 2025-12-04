import { useEffect } from 'react';
import ToolsGrid from '../components/Tools/ToolsGrid';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { fetchBookmarkedToolsThunk } from '../store/features/userReducer';
import { useAuth } from '../hooks/useAuth';

const MyBookmarksPage = () => {
    const dispatch = useAppDispatch();
    const { isAuthenticated } = useAuth();
    const { bookmarkedTools, isLoadingBookmarks } = useAppSelector((state) => state.user);

    // Fetch bookmarked tools if user is authenticated but tools haven't been fetched
    useEffect(() => {
        if (isAuthenticated && bookmarkedTools.length === 0 && !isLoadingBookmarks) {
            dispatch(fetchBookmarkedToolsThunk());
        }
    }, [isAuthenticated, bookmarkedTools.length, isLoadingBookmarks, dispatch]);

    return (
      <div className='h-full'>
          <h3 className='pb-4 text-xl font-medium text-primary-color'>My Bookmarks</h3>
          <ToolsGrid tools={bookmarkedTools} tag="index" />
      </div>
    );
};

export default MyBookmarksPage;


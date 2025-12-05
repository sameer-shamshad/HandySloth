import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkSessionThunk } from '../store/features/AuthReducer';
import { clearUserData } from '../store/features/userReducer';

/**
 * Component to check user session on app load
 * Replaces AuthMachine's initial session checking behavior
 */
export const SessionChecker = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);
  const { tools, bookmarkedTools } = useAppSelector((state) => state.user);

  // Check session on mount if we have a token
  useEffect(() => {
    if (accessToken && !isAuthenticated && !isLoading) {
      dispatch(checkSessionThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  // Clear user data if not authenticated and no tokens exist
  useEffect(() => {
    const refreshToken = localStorage.getItem('refreshToken');
    
    if (!isAuthenticated && !accessToken && !refreshToken) {
      // Clear user data if not authenticated and no tokens exist
      if (tools.length > 0 || bookmarkedTools.length > 0) {
        dispatch(clearUserData());
      }
    }
  }, [isAuthenticated, accessToken, tools.length, bookmarkedTools.length, dispatch]);

  return <>{children}</>;
};


import { useEffect, type ReactNode } from 'react';
import { useAppDispatch, useAppSelector } from '../store/hooks';
import { checkSessionThunk } from '../store/features/AuthReducer';

/**
 * Component to check user session on app load
 * Replaces AuthMachine's initial session checking behavior
 */
export const SessionChecker = ({ children }: { children: ReactNode }) => {
  const dispatch = useAppDispatch();
  const { accessToken, isLoading, isAuthenticated } = useAppSelector((state) => state.auth);

  // Check session on mount if we have a token
  useEffect(() => {
    if (accessToken && !isAuthenticated && !isLoading) {
      dispatch(checkSessionThunk());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount

  return <>{children}</>;
};


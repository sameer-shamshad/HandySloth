import { useAppSelector, useAppDispatch } from '../store/hooks';
import { logoutThunk } from '../store/features/AuthReducer';

/**
 * Redux-based auth hook to replace XState AuthMachine usage
 */
export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const logout = () => {
    dispatch(logoutThunk());
  };

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    accessToken: auth.accessToken,
    refreshToken: auth.user?.refreshToken || null,
    logout,
  };
};


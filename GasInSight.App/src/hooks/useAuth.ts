import { useEffect } from 'react';
import { useAppSelector } from './useAppSelector';
import { useAppDispatch } from './useAppDispatch';
import { setUser } from '../store/slices/authSlice';
import { authApi } from '../store/api/authApi';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const { data: currentUser, isLoading } = authApi.useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated,
  });

  useEffect(() => {
    if (currentUser && !user) {
      dispatch(setUser(currentUser));
    }
  }, [currentUser, dispatch, user]);

  return {
    isAuthenticated,
    user,
    isLoading,
  };
};

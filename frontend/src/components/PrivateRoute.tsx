import { Navigate, Outlet } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import type { RootState } from '../app/store';
import { hydrateAuth } from '../features/auth/authSlice';
import authService from '../features/auth/authService';

const PrivateRoute = () => {
  const dispatch = useDispatch();
  const { user, isHydrated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (!isHydrated) {
      dispatch(hydrateAuth() as any);
    }
  }, [dispatch, isHydrated]);

  // Wait for hydration before making a decision
  if (!isHydrated) {
    return null; // or a spinner if you want
  }

  // Check if user is authenticated
  const storedUser = authService.getStoredUser();
  const isAuthenticated = user && storedUser && user.token === storedUser.token;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default PrivateRoute; 
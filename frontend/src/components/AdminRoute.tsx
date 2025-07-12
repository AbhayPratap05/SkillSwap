import { Navigate, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';

const AdminRoute = () => {
  const { user } = useSelector((state: RootState) => state.auth);

  return user?.isAdmin ? <Outlet /> : <Navigate to="/" />;
};

export default AdminRoute; 
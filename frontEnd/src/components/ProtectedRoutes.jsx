import { Navigate, Outlet } from 'react-router-dom';
import { UseApp } from '../context/AppContext';

const ProtectedRoutes = () => {
  const { isAuthenticated } = UseApp()

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoutes;
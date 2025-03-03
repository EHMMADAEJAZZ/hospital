import { Navigate, Outlet } from 'react-router-dom';
import { useApp } from '../context/AppContext';


const ProtectedRoutes = () => {
  const { isAuthenticated} = useApp();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  

  return <Outlet />;
};

export default ProtectedRoutes;
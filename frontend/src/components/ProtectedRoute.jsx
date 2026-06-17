import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // User not logged in, redirect to login page
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // User logged in but does not have required role, redirect to their dashboard or home
    const redirectPath = user.role === 'ADMIN' ? '/admin/dashboard' 
                       : user.role === 'DOCTOR' ? '/doctor/dashboard' 
                       : '/patient/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  // User is authenticated and authorized
  return <Outlet />;
};

export default ProtectedRoute;

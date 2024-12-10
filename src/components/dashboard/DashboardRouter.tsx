import { Navigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

export default function DashboardRouter() {
  const { user } = useAuth();

  if (!user || !user.role) {
    return null;
  }

  switch (user.role.toLowerCase()) {
    case 'admin':
      return <Navigate to="/admin" replace />;
    case 'hod':
      return <Navigate to="/hod" replace />;
    case 'lecturer':
      return <Navigate to="/lecturer" replace />;
    case 'representative':
      return <Navigate to="/representative" replace />;
    case 'student':
      return <Navigate to="/student" replace />;
    default:
      return <Navigate to="/not-found" replace />;
  }
}
import { Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { User } from './types/user';

interface ProtectedRouteProps {
  children: React.ReactNode | ((props: { user: User }) => JSX.Element);
}

export default function ProtectedRoute({ children }: ProtectedRouteProps): JSX.Element {
  const { isAuthenticated, isLoading, user } = useAuth();

  if (isLoading) return <div>Loading...</div>;
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (typeof children === 'function' && user) return children({ user });
  return <>{children}</>;
}
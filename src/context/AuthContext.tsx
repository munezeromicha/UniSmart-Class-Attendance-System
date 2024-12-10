import { ReactNode, useEffect, useState } from 'react';
import { AuthContext } from '../hooks/useAuth';
import { User } from '../types/user';
import ApiService from '../services/api';
import { useNavigate } from 'react-router-dom';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      console.log('Making login API call...');
      const response = await ApiService.login(email, password);
      
      console.log('API Response:', response);

      if (response.error) {
        throw new Error(response.error);
      }

      // Handle nested structure
      console.log(response.data,'data from login')
      const userData = (response.data as { user: User; token: string }).user;
      const token = (response.data as { user: User; token: string }).token;

      if (!userData || !token) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      setUser(userData);

      console.log('User data:', userData);
      if (userData.role) {
        console.log('Redirecting to role:', userData.role);
        redirectBasedOnRole(userData.role);
      }
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const redirectBasedOnRole = (role: string) => {
    console.log('Attempting to redirect to:', role.toLowerCase());
    switch (role.toLowerCase()) {
      case 'admin':
        navigate('/admin', { replace: true });
        break;
      case 'hod':
        navigate('/hod', { replace: true });
        break;
      case 'lecturer':
        navigate('/lecturer', { replace: true });
        break;
      case 'class_rep':
        navigate('/class_rep', { replace: true });
        break;
      case 'student':
        navigate('/student', { replace: true });
        break;
      default:
        navigate('/not-found', { replace: true });
    }
  };

  const logout = async () => {
    try {
      await ApiService.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    setUser(null)
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const response = await ApiService.checkAuth();
        if (response.data) {
          
          setUser(response.data as User);
          console.log(response.data as User, 'user data tooo0000')
        }
      } catch (error) {
        console.error('Check auth error:', error);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  };

  
  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      isLoading,
      login,
      logout,
      checkAuth
    }}>
      {children}
    </AuthContext.Provider>
  );
}
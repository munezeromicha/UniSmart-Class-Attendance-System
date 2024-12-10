import { Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';

export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const { theme } = useTheme();
  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };


  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <nav className={`
      shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
      dark:shadow-[0_2px_15px_-3px_rgba(255,255,255,0.07),0_10px_20px_-2px_rgba(255,255,255,0.04)]
      ${theme === 'dark' ? 'bg-background-dark text-white' : 'bg-background-light text-gray-800'}
      sticky top-0 z-50
    `}>
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
              UniSmart Class attendance System
            </h2>
          </div>
          
          <div className="flex items-center">
            {isAuthenticated && user ? (
              <>
                <span className={`mr-4 ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}>
                  {getGreeting()}, {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className={`bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className={`bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
              >
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
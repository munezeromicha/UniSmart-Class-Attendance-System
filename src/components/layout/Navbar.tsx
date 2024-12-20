import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import { FaSun, FaMoon, FaTimes, FaBars, FaUser } from "react-icons/fa";
import { useState } from 'react';
import Logo from "../../assets/Logo/UR-logo.png";

export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const getGreeting = (): string => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning";
    if (hour < 17) return "Good Afternoon";
    return "Good Evening";
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav
      className={`
      shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]
      dark:shadow-[0_2px_15px_-3px_rgba(255,255,255,0.07),0_10px_20px_-2px_rgba(255,255,255,0.04)]
      ${
        theme === "dark"
          ? "bg-background-dark text-white"
          : "bg-background-light text-gray-800"
      }
      sticky top-0 z-50
    `}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-2">
              <img src={Logo} alt="UniSmart Logo" className="h-14 w-auto" />
              <span className={`text-xl font-bold hidden md:block ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                UniSmart Class Attendance System
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
              aria-label="Toggle theme"
            >
              {theme === "dark" ? 
                <FaSun className="w-5 h-5 text-yellow-400" /> : 
                <FaMoon className="w-5 h-5 text-gray-600" />
              }
            </button>

            {isAuthenticated && user && (
              <>
                <div className="relative">
                  <button
                    onClick={() => setShowProfile(!showProfile)}
                    className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
                    aria-label="Toggle profile menu"
                  >
                    <FaUser className="w-5 h-5" />
                  </button>
                  
                  {showProfile && (
                    <div className={`absolute right-0 mt-2 w-80 rounded-md shadow-lg py-1
                      ${theme === "dark" ? "bg-background-dark" : "bg-background-light"}
                      `}>
                      <div className="px-4 py-2 text-sm">
                        <p className="font-medium">{user.firstName} {user.lastName}</p>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-gray-500">Role: {user.role}</p>
                      </div>
                    </div>
                  )}
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isMenuOpen ? 
                <FaTimes className="w-6 h-6" /> : 
                <FaBars className="w-6 h-6" />
              }
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className={`md:hidden py-2 ${theme === "dark" ? "bg-gray-800" : "bg-white"}`}>
            <div className="space-y-2 px-4">
              {isAuthenticated && user ? (
                <>
                  <div className="py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                      {getGreeting()},
                    </p>
                    <p className="font-medium">{user.firstName} {user.lastName}</p>
                    <p className="text-sm text-gray-500">{user.email}</p>
                    <p className="text-sm text-gray-500">Role: {user.role}</p>
                  </div>
                  <div className="py-2">
                    <button
                      onClick={toggleTheme}
                      className="flex items-center w-full px-2 py-2 text-sm rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                    >
                      {theme === "dark" ? 
                        <><FaSun className="w-5 h-5 mr-2 text-yellow-400" /> Light Mode</> : 
                        <><FaMoon className="w-5 h-5 mr-2" /> Dark Mode</>
                      }
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition-colors duration-200"
                    >
                      Logout
                    </button>
                  </div>
                </>
              ) : (
                <Link
                  to="/login"
                  className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition-colors duration-200"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

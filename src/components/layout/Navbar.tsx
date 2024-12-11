import { Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
import ThemeToggle from "../../pages/ThemeToggle";
import { useState } from "react";

export default function Navbar() {
  const { logout, isAuthenticated, user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { theme } = useTheme();
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
      ${theme === "dark" ? "bg-background-dark text-white" : "bg-background-light text-gray-800"}
      sticky top-0 z-50
    `}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          {/* Logo section */}
          <div className="flex items-center">
            <Link
              to="/"
              className={`text-xl font-bold ${theme === "dark" ? "text-white" : "text-gray-800"} 
              sm:text-lg md:text-xl`}
            >
              UniSmart Class attendance System
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md"
            >
              {isMenuOpen ? (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated && user ? (
              <>
                <span className={`mr-4 ${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                  {getGreeting()}, {user.firstName} {user.lastName}
                </span>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
              >
                Login
              </Link>
            )}
            <ThemeToggle />
          </div>
        </div>

        {/* Mobile menu dropdown */}
        <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden pb-4`}>
          {isAuthenticated && user ? (
            <div className="flex flex-col space-y-4">
              <span className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>
                {getGreeting()}, {user.firstName} {user.lastName}
              </span>
              <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded w-full"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded block text-center"
            >
              Login
            </Link>
          )}
          <div className="mt-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  );
}

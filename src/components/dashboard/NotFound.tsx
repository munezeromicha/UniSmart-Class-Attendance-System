import { Link } from 'react-router-dom';
import { useTheme } from '../../context/ThemeContext';

export default function NotFound() {
  const { theme } = useTheme();
  return (
    <div className={`min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 ${theme === 'dark' ? 'bg-background-dark' : 'bg-background-light'}`}>
      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 text-center">
          <h2 className={`text-6xl font-bold ${theme === 'dark' ? 'text-white' : 'text-indigo-600'}`}>404</h2>
          <p className={`mt-2 text-2xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Page not found</p>
          <p className={`mt-2 text-gray-600 ${theme === 'dark' ? 'text-white' : 'text-gray-600'}`}>Sorry, we couldn't find the page you're looking for.</p>
          <div className="mt-6">
            <Link
              to="/"
              className={`inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm ${theme === 'dark' ? 'text-white' : 'text-indigo-600'} bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
            >
              Go back home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
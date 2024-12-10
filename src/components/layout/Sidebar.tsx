import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

interface MenuItem {
  label: string;
  path: string;
  icon: JSX.Element;
}

export default function Sidebar() {
  const { user } = useAuth();
  const location = useLocation();

  const getMenuItems = (): MenuItem[] => {
    switch (user?.role) {
      case 'admin':
        return [
          {
            label: 'Dashboard',
            path: '/admin',
            icon: <HomeIcon className="w-5 h-5" />,
          },
          {
            label: 'Manage HODs',
            path: '/admin/hods',
            icon: <UsersIcon className="w-5 h-5" />,
          },
        ];
      case 'hod':
        return [
          {
            label: 'Dashboard',
            path: '/hod',
            icon: <HomeIcon className="w-5 h-5" />,
          },
          {
            label: 'Manage Staff',
            path: '/hod/staff',
            icon: <UsersIcon className="w-5 h-5" />,
          },
        ];
      // Add cases for other roles
      default:
        return [];
    }
  };

  const menuItems = getMenuItems();

  return (
    <div className="h-screen w-64 bg-indigo-800 text-white fixed left-0 top-0">
      <div className="p-4">
        <h2 className="text-xl font-bold">School System</h2>
      </div>
      <nav className="mt-8">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <Link
                to={item.path}
                className={`
                  flex items-center px-4 py-2 text-sm
                  ${location.pathname === item.path
                    ? 'bg-indigo-900'
                    : 'hover:bg-indigo-700'}
                `}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

// You'll need to create these icon components or import them from a library like heroicons
function HomeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  );
}

function UsersIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  );
}
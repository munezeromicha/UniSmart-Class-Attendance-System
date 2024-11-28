import { Fragment } from 'react';
import { Disclosure } from '@headlessui/react';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import { Link, Outlet } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const navigation = [
  { name: 'Dashboard', href: '/' },
  { name: 'Classes', href: '/classes' },
  { name: 'Attendance', href: '/attendance' },
  { name: 'Reports', href: '/reports' },
];


export default function Layout() {
  const { theme } = useTheme(); 
const dashboardStyles = {
  backgroundColor: theme === 'dark' ? '#222222' : '#f9fafb',
  color: theme === 'dark' ? '#ffffff' : '#000000', 
};

const qrFgColor = theme === 'dark' ? '#0f0f0f' : '#6366F1'; 
  return (
    <div className="min-h-screen bg-gray-100" style={dashboardStyles}>
      <Disclosure as="nav" style={{backgroundColor:qrFgColor }}>
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <h1 className="text-white text-xl font-bold">UniSmart</h1>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-10 flex items-baseline space-x-4">
                      {navigation.map((item) => (
                        <Link
                          key={item.name}
                          to={item.href}
                          className="text-white hover:bg-primary-700 px-3 py-2 rounded-md"
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="md:hidden">
                  <Disclosure.Button className="text-white">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="h-6 w-6" />
                    ) : (
                      <Bars3Icon className="h-6 w-6" />
                    )}
                  </Disclosure.Button>
                </div>
              </div>
            </div>

            <Disclosure.Panel className="md:hidden">
              <div className="space-y-1 px-2 pb-3 pt-2">
                {navigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    className="text-white block px-3 py-2 rounded-md"
                  >
                    {item.name}
                  </Link>
                ))}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
    </div>
  );
}
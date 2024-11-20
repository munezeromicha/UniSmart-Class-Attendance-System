import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AcademicCapIcon,
  UserCircleIcon,
  UserIcon,
  Cog6ToothIcon,
  ArrowRightOnRectangleIcon 
} from '@heroicons/react/24/outline';
import QRCodeScanner from '../../components/QRCode/QRCodeScanner';
import AttendanceRecord from '../attendance/AttendanceRecord';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';

const StudentDashboard = () => {
  const [activeTab, setActiveTab] = useState('scanner');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Logged out successfully');
      navigate('/login');
    } catch (error) {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <AcademicCapIcon className="h-8 w-8 text-indigo-600 mr-2" />
              <h1 className="text-xl font-bold text-gray-900">Student Dashboard</h1>
            </div>
            
            {/* Profile Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-3 focus:outline-none group"
                >
                  <span className="text-gray-700">Welcome, {user?.email}</span>
                  <div className="relative">
                    <UserCircleIcon className="h-10 w-10 text-gray-400 hover:text-indigo-600 transition-colors duration-200" />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                    <div className="py-1" role="menu">
                      <button
                        onClick={() => {
                          navigate('/profile');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <UserIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Your Profile
                      </button>
                      <button
                        onClick={() => {
                          navigate('/settings');
                          setIsDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                        role="menuitem"
                      >
                        <Cog6ToothIcon className="h-5 w-5 mr-2 text-gray-400" />
                        Settings
                      </button>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-700 hover:bg-red-50 flex items-center"
                        role="menuitem"
                      >
                        <ArrowRightOnRectangleIcon className="h-5 w-5 mr-2 text-red-400" />
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Tabs */}
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('scanner')}
                  className={`${
                    activeTab === 'scanner'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Scan QR Code
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`${
                    activeTab === 'history'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Attendance History
                </button>
              </nav>
            </div>
          </div>

          {/* Tab Content */}
          <div className="mt-6">
            {activeTab === 'scanner' && <QRCodeScanner />}
            {activeTab === 'history' && <AttendanceRecord />}
          </div>

          {/* Summary Cards */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Total Classes</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {/* {user?.totalClasses || 0} */} 0%
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Attendance Rate</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {/* {user?.attendanceRate || '0%'} */} 0%
                </dd>
              </div>
            </div>
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <dt className="text-sm font-medium text-gray-500">Absences</dt>
                <dd className="mt-1 text-3xl font-semibold text-gray-900">
                  {/* {user?.absences || 0} */} 0%
                </dd>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Click Outside Handler */}
      {isDropdownOpen && (
        <div
          className="fixed inset-0 z-10"
          onClick={() => setIsDropdownOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default StudentDashboard;
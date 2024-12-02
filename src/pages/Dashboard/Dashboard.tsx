import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import QRCodeGenerator from '../../components/QRCode/QRCodeGenerator';
import AttendanceRecord from '../attendance/AttendanceRecord';
import Reports from '../../components/report/Report';
import { useAuth } from '../../context/AuthContext';
import { FaGraduationCap, FaUser, FaGear, FaRightFromBracket } from 'react-icons/fa6';
import { useTheme } from '../../context/ThemeContext';


const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('qr');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
const { theme } = useTheme(); 
const dashboardStyles = {
  backgroundColor: theme === 'dark' ? '#0f0f0f' : '#f9fafb',
  color: theme === 'dark' ? '#ffffff' : '#000000', 
};
const saveChanges= theme === 'dark' ? '#272727' : '#4F46E5'
  return (
    
    <div className="min-h-screen bg-gray-100" style={dashboardStyles}>
      <nav className="bg-white shadow-lg "style={dashboardStyles}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <FaGraduationCap className="h-8 w-8  mr-2" />
              <h1 className="text-xl font-bold">UniSmart Dashboard</h1>
            </div>

            {/* User Avatar Dropdown */}
            <div className="flex items-center">
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center space-x-2 focus:outline-none"
                >
                  <span className="text-gray-700 mr-2"></span>
                  <div className="h-10 w-10 rounded-full  flex items-center justify-center text-white" style={{backgroundColor:saveChanges}}>
                    {<FaUser className="h-8 w-8" />}
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                  <div 
                    className="py-1" 
                    role="menu" 
                    aria-orientation="vertical"
                  >
                    <button
                      role="menuitem"
                      onClick={() => navigate('/profile')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                      <FaUser className="mr-2" />
                      Profile
                    </button>
                    <button
                      role="menuitem"
                      onClick={() => navigate('/settings')}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                    >
                       <FaGear className="mr-2" />
                      Settings
                    </button>
                    <div className="border-t border-gray-100"></div>
                    <button
                      role="menuitem"
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-sm text-red-700 hover:bg-red-50 w-full text-left"
                    >
                      <FaRightFromBracket className="mr-2" />
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
          <div className="mb-4">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('qr')}
                  className={`${
                    activeTab === 'qr'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Generate QR Code
                </button>
                <button
                  onClick={() => setActiveTab('attendance')}
                  className={`${
                    activeTab === 'attendance'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Attendance Records
                </button>
                <button
                  onClick={() => setActiveTab('reports')}
                  className={`${
                    activeTab === 'reports'
                      ? 'border-indigo-500 text-indigo-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                >
                  Reports
                </button>
              </nav>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'qr' && <QRCodeGenerator classId="CS101" sessionId="001" />}
            {activeTab === 'attendance' && <AttendanceRecord />}
            {activeTab === 'reports' && <Reports />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
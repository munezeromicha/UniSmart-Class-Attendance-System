import { useState, useEffect } from 'react';
import InviteUser from '../auth/InviteUser';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'lecturer' | 'representative';
  class?: string;
  status: 'active' | 'disabled';
  department: string;
}

interface AttendanceRecord {
  id: string;
  date: string;
  module: string;
  class: string;
  lecturer: string;
  status: 'pending' | 'approved' | 'rejected';
  file: string;
}

export default function HodDashboard() {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('lecturers');
  const [staff, setStaff] = useState<Staff[]>([]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>([]);
  const [classes] = useState(['Level 1', 'Level 2', 'Level 3', 'Level 4']);
  const { user } = useAuth();
  const [departments] = useState([
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Law",
  ]);

  const themeStyles = {
    container: `min-h-screen w-full ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`,
    text: `${theme === 'dark' ? 'text-white' : 'text-gray-900'}`,
    secondaryText: `${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`,
    card: `${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} shadow rounded-lg`,
    tabButton: (isActive: boolean) => `
      px-4 py-2 rounded-lg transition-colors
      ${isActive 
        ? 'bg-blue-500 text-white' 
        : theme === 'dark'
          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }
    `
  };

  useEffect(() => {
    fetchStaff();
    fetchAttendanceRecords();
  }, []);

  const fetchStaff = async () => {
    try {
      const response = await fetch(`/api/departments/${user?.department}/staff`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStaff(data);
    } catch (error) {
      console.error('Failed to fetch staff:', error);
      toast.error('Failed to fetch staff members');
    }
  };

  const fetchAttendanceRecords = async () => {
    try {
      const response = await fetch(`/api/departments/${user?.department}/attendance-records`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setAttendanceRecords(data);
    } catch (error) {
      console.error('Failed to fetch attendance records:', error);
      toast.error('Failed to fetch attendance records');
    }
  };

  const toggleStaffStatus = async (staffId: string, newStatus: 'active' | 'disabled') => {
    try {
      await fetch(`/api/staff/${staffId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ status: newStatus })
      });
      fetchStaff();
      toast.success('Staff status updated successfully');
    } catch (error) {
      console.error('Failed to update staff status:', error);
      toast.error('Failed to update staff status');
    }
  };

  const downloadAttendanceRecord = async (recordId: string, filename: string) => {
    try {
      const response = await fetch(`/api/attendance-records/${recordId}/download`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success('File downloaded successfully');
    } catch (error) {
      console.error('Failed to download file:', error);
      toast.error('Failed to download file');
    }
  };

  return (
    <div className={themeStyles.container}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ToastContainer theme={theme === 'dark' ? 'dark' : 'light'} />
        
        <div className="mb-6">
          <h1 className={`text-2xl font-bold ${themeStyles.text}`}>
            Head of Department Dashboard
          </h1>
          <p className={themeStyles.secondaryText}>
            Department: {user?.department}
          </p>
        </div>

        <div className="flex space-x-4 mb-6">
          {['lecturers', 'representatives', 'staff', 'records'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={themeStyles.tabButton(activeTab === tab)}
            >
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </button>
          ))}
        </div>

        <div className={`${themeStyles.card} p-6`}>
          {activeTab === 'lecturers' && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeStyles.text}`}>Invite Lecturer</h2>
              <InviteUser 
                departments={departments} 
                role="LECTURER"
              />
            </div>
          )}

          {activeTab === 'representatives' && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeStyles.text}`}>Invite Class Representative</h2>
              <InviteUser 
                departments={departments}
                classes={classes}
                role="CLASS_REP"
              />
            </div>
          )}

          {activeTab === 'staff' && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeStyles.text}`}>Manage Staff</h2>
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {staff.map((member) => (
                  <div key={member.id} className="py-4 flex items-center justify-between">
                    <div>
                      <h3 className={`text-lg font-medium ${themeStyles.text}`}>
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className={themeStyles.secondaryText}>{member.email}</p>
                      <p className={themeStyles.secondaryText}>
                        {member.role.charAt(0).toUpperCase() + member.role.slice(1)}
                        {member.class && ` - ${member.class}`}
                      </p>
                    </div>
                    <button
                      onClick={() => toggleStaffStatus(member.id, member.status === 'active' ? 'disabled' : 'active')}
                      className={`px-4 py-2 rounded-md text-sm font-medium ${
                        member.status === 'active'
                          ? 'bg-red-600 text-white hover:bg-red-700'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {member.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'records' && (
            <div>
              <h2 className={`text-xl font-semibold mb-4 ${themeStyles.text}`}>Attendance Records</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead>
                    <tr>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Date</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Module</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Class</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Lecturer</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Status</th>
                      <th className={`px-6 py-3 text-left text-xs font-medium ${themeStyles.secondaryText} uppercase tracking-wider`}>Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                    {attendanceRecords.map((record) => (
                      <tr key={record.id}>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>
                          {new Date(record.date).toLocaleDateString()}
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>{record.module}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>{record.class}</td>
                        <td className={`px-6 py-4 whitespace-nowrap ${themeStyles.text}`}>{record.lecturer}</td>
                        <td className={`px-6 py-4 whitespace-nowrap`}>
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                            ${record.status === 'approved' 
                              ? 'bg-green-100 text-green-800' 
                              : record.status === 'rejected'
                                ? 'bg-red-100 text-red-800'
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                            {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
                          </span>
                        </td>
                        <td className={`px-6 py-4 whitespace-nowrap`}>
                          <button
                            onClick={() => downloadAttendanceRecord(record.id, `attendance-${record.date}.xlsx`)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            Download
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
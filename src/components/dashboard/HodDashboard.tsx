import { useState, useEffect } from 'react';
import InviteUser from '../auth/InviteUser';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../context/ThemeContext';
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

export default function HodDashboard() {
  const { theme } = useTheme();
  const [staff, setStaff] = useState<Staff[]>([]);
  const [classes] = useState(['Level 1', 'Level 2', 'Level 3', 'Level 4']);
  const { user } = useAuth();
  const [departments] = useState([
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Law",
  ]);


  useEffect(() => {
    fetchStaff();
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
    } catch (error) {
      console.error('Failed to update staff status:', error);
    }
  };

  return (
    <div className={`min-h-screen w-full ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Invite Lecturer</h2>
            <InviteUser 
              departments={departments} 
              role="LECTURER"
            />
          </div>
          <div>
            <h2 className="text-2xl font-bold mb-4">Invite Class Representative</h2>
            <InviteUser 
              departments={departments}
              classes={classes}
              role="CLASS_REP"
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Manage Staff</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {staff.map((member) => (
                <li key={member.id} className="px-6 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-lg font-medium">
                        {member.firstName} {member.lastName}
                      </h3>
                      <p className="text-sm text-gray-500">{member.email}</p>
                      <p className="text-sm text-gray-500">
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
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
    </div>

  );
}
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import InviteUser from '../auth/InviteUser';
import { useTheme } from '../../context/ThemeContext';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
}

export default function RepresentativeDashboard() {
  const { theme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const { user } = useAuth();
  const [departments] = useState([
    "Computer Science",
    "Engineering",
    "Business",
    "Medicine",
    "Law",
  ]);

  useEffect(() => {
    fetchClassmates();
  }, []);

  const fetchClassmates = async () => {
    try {
      const response = await fetch(`/api/classes/${user?.class}/students`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Failed to fetch classmates:', error);
    }
  };

  return (
    <div className={`min-h-screen w-full ${
      theme === 'dark' 
        ? 'bg-gray-900 text-white' 
        : 'bg-gray-50 text-gray-900'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
        <h1 className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Class Representative Dashboard</h1>
        <p className={`text-gray-600 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
          Class: {user?.class} | Department: {user?.department}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Invite Students</h2>
          <InviteUser
            role="STUDENT"
            departments={departments}
            classes={[user?.class || '']}
          />
        </div>

        <div>
          <h2 className={`text-xl font-semibold mb-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>Class Members</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <li key={student.id} className="px-6 py-4">
                  <div>
                    <h3 className={`text-sm font-medium ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{student.email}</p>
                    <p className={`text-sm ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
                      Reg No: {student.registrationNumber}
                    </p>
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
import { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import InviteUser from '../auth/InviteUser';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
}

export default function RepresentativeDashboard() {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Class Representative Dashboard</h1>
        <p className="text-gray-600">
          Class: {user?.class} | Department: {user?.department}
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Invite Students Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Invite Students</h2>
          <InviteUser
            role="student"
            departments={departments}
            classes={[user?.class || '']}
          />
        </div>

        {/* View Classmates Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Class Members</h2>
          <div className="bg-white shadow overflow-hidden sm:rounded-md">
            <ul className="divide-y divide-gray-200">
              {students.map((student) => (
                <li key={student.id} className="px-6 py-4">
                  <div>
                    <h3 className="text-sm font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </h3>
                    <p className="text-sm text-gray-500">{student.email}</p>
                    <p className="text-sm text-gray-500">
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
  );
}
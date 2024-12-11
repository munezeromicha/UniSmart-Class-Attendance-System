import { useState, useEffect } from "react";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../context/ThemeContext";
interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  registrationNumber: string;
  class: string;
}

export interface User {
  id: string;
  firstName: string;
  email: string;
  department?: string;
  role: string;
}

export default function LecturerDashboard() {
  const { theme } = useTheme();
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [classes, setClasses] = useState<string[]>([]);
  const { user } = useAuth();

  useEffect(() => {
    fetchClasses();
  }, []);

  useEffect(() => {
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  const fetchClasses = async () => {
    try {
      const response = await fetch(`/api/lecturer/classes`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setClasses(data);
    } catch (error) {
      console.error("Failed to fetch classes:", error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await fetch(`/api/classes/${selectedClass}/students`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error("Failed to fetch students:", error);
    }
  };

  return (
    <div
      className={`min-h-screen w-full ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <h1 className={`text-2xl font-bold text-gray-900 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            Welcome, {user?.firstName} {user?.lastName}
          </h1>
          <p
            className={`text-gray-600 ${
              theme === "dark" ? "text-white" : "text-gray-900"
            }`}
          >
            Department: {user?.department}
          </p>
        </div>

        <div
          className={`shadow rounded-lg p-6           ${
            theme === "dark"
              ? "bg-gray-800 shadow-[0_4px_20px_-2px_rgba(0,0,0,0.3)]"
              : "bg-white shadow-[0_4px_20px_-2px_rgba(0,0,0,0.1)]"
          }`}
        >
          <div className="mb-6">
            <label
              className={`block text-sm font-medium text-gray-700 ${
                theme === "dark" ? "text-white" : "text-gray-900"
              }`}
            >
              Select Class
            </label>
            <select
              aria-label="Select Class"
              className={`mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md ${
                theme === "dark"
                  ? "bg-gray-800 text-white"
                  : "bg-white text-gray-900"
              }`}
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
            >
              <option value="">Select a class</option>
              {classes.map((cls) => (
                <option key={cls} value={cls}>
                  {cls}
                </option>
              ))}
            </select>
          </div>

          {selectedClass && (
            <div>
              <h2 className="text-xl font-semibold mb-4">
                Students in {selectedClass}
              </h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Registration Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {students.map((student) => (
                      <tr key={student.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {student.firstName} {student.lastName}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {student.registrationNumber}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-500">
                            {student.email}
                          </div>
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

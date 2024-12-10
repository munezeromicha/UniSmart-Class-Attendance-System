import { useAuth } from '../../hooks/useAuth';

export default function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Welcome, {user?.firstName}</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h2 className="text-lg font-semibold text-gray-900 mb-2">Your Information</h2>
            <div className="space-y-2">
              <p className="text-sm text-gray-600">
                <span className="font-medium">Name:</span> {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Email:</span> {user?.email}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Registration Number:</span> {user?.registrationNumber}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Department:</span> {user?.department}
              </p>
              <p className="text-sm text-gray-600">
                <span className="font-medium">Class:</span> {user?.class}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
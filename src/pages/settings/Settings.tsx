import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useTheme } from '../../context/ThemeContext';

const Settings = () => {
  const { user, updateUserProfile } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    notifications: true,
    theme: 'light',
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { theme, setTheme } = useTheme(); 

  useEffect(() => {
    const fetchUser = async () => {
      const localstorageUser = localStorage.getItem('user');
      let userId: string | undefined;

      if (localstorageUser) {
        try {
          const parsedUser = JSON.parse(localstorageUser);
          userId = parsedUser._id;
        } catch (err) {
          console.error('Error parsing user from localStorage:', err);
          setError('Invalid user data in localStorage');
          setLoading(false);
          return;
        }
      } else {
        setError('No user found in localStorage');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch(`http://localhost:5000/api/auth/user/${userId}`); // Replace with your API URL
        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }
        const data = await response.json();
        setFormData({
          fullName: data.data.fullName || '',
          email: data.data.email || '',
          notifications: data.data.notifications || true,
          theme: data.data.theme || 'light',
        });
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []); // Run only on component mount

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const localstorageUser = localStorage.getItem('user');
      let userId: string | undefined;

      if (localstorageUser) {
        const parsedUser = JSON.parse(localstorageUser);
        userId = parsedUser._id;
      } else {
        setError('No user found in localStorage');
        setLoading(false);
        return;
      }

      const response = await fetch(`http://localhost:5000/api/auth/user/update/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error('Failed to update user data');
      }

      const updatedData = await response.json();
     toast.success("profile updated successfully")
      setFormData({
        ...formData,
        fullName: updatedData.data.fullName,
        email: updatedData.data.email,
      });
      setTheme(formData.theme); 
    } catch (err: any) {
      console.error('Failed to update settings:', err);
      setError(err.message || 'Failed to update settings');
    } finally {
      setLoading(false);
    }
  };
  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedTheme = e.target.value;
    setFormData({ ...formData, theme: selectedTheme }); // Update local state
    setTheme(selectedTheme); // Update context state
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  const dashboardStyles = {
    backgroundColor: theme === 'dark' ? '#0f0f0f' : '#f9fafb',
    color: theme === 'dark' ? '#ffffff' : '#000000', 
  };
  const qrFgColor = theme === 'dark' ? '#272727' : '#ffffff'; 
  const saveChanges= theme === 'dark' ? '#272727' : '#4F46E5'
  return (
    

    <div className="min-h-screen bg-gray-100" style={dashboardStyles}>
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6" style={dashboardStyles}>
            <h2 className="text-lg font-medium leading-6 text-gray-900 mb-4" style={dashboardStyles}>Account Settings</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700" style={dashboardStyles}>Name</label>
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Name"
                style={{backgroundColor:qrFgColor}}/>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700" style={dashboardStyles}>Email</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Email"
                  style={{backgroundColor:qrFgColor}}/>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  checked={formData.notifications}
                  onChange={(e) => setFormData({ ...formData, notifications: e.target.checked })}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  id="notifications"
                  aria-label="Enable email notifications"
                  style={{backgroundColor:qrFgColor}}/>
                <label className="ml-2 block text-sm text-gray-700" style={dashboardStyles}>Enable email notifications</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700"style={dashboardStyles}>Theme</label>
                <select
                  value={formData.theme}
                  onChange={handleThemeChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                  aria-label="Theme"
                  style={{backgroundColor:qrFgColor}}>
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
style={{backgroundColor:saveChanges}}>
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;

import { useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../hooks/useAuth';

interface InviteUserProps {
  departments: string[];
  classes?: string[];
  role: string;
}

type InvitationData = {
  email: string;
  role: string;
  department: string;
  school?: string;
  class?: string;
}

export default function InviteUser({ departments, classes }: InviteUserProps) {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<InvitationData>({
    email: '',
    role: '',
    department: '',
    school: '',
    class: ''
  });

  const schools = ['ICT', 'ENG', 'SABE'];

  const rolePermissions = {
    'ADMIN': ['HOD'],
    'HOD': ['LECTURER', 'CLASS_REP'],
    'CLASS_REP': ['STUDENT']
  };

  const getAllowedRoles = () => {
    if (!user?.role) return [];
    return rolePermissions[user.role.toUpperCase() as keyof typeof rolePermissions] || [];
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      let inviteData: InvitationData;

      // Format data based on role being invited
      switch (formData.role) {
        case 'HOD':
          inviteData = {
            email: formData.email,
            role: formData.role,
            school: formData.school,
            department: formData.department
          };
          break;

        case 'LECTURER':
          inviteData = {
            email: formData.email,
            role: formData.role,
            department: formData.department
          };
          break;

        case 'CLASS_REP':
          inviteData = {
            email: formData.email,
            role: formData.role,
            department: formData.department,
            class: formData.class
          };
          break;

        default:
          throw new Error('Invalid role selected');
      }

      const response = await fetch('http://localhost:5000/api/invitations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(inviteData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send invitation');
      }

      toast.success(`${formData.role.replace('_', ' ')} invitation sent successfully!`);
      setFormData({
        email: '',
        role: '',
        department: '',
        school: '',
        class: ''
      });
    } catch (error) {
      console.error('Invitation error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to send invitation');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Email
        </label>
        <input
          type="email"
          required
          value={formData.email}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          placeholder="Enter email address"
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Role
        </label>
        <select
          required
          value={formData.role}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => setFormData({ ...formData, role: e.target.value })}
          aria-label="Select role"
        >
          <option value="">Select Role</option>
          {getAllowedRoles().map((role) => (
            <option key={role} value={role}>
              {role.replace('_', ' ')}
            </option>
          ))}
        </select>
      </div>

      {/* School field - Only for HOD invitations */}
      {user?.role === 'ADMIN' && formData.role === 'HOD' && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            School
          </label>
          <select
            required
            value={formData.school}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={(e) => setFormData({ ...formData, school: e.target.value })}
            aria-label="Select school"
          >
            <option value="">Select School</option>
            {schools.map((school) => (
              <option key={school} value={school}>
                {school}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Department
        </label>
        <select
          required
          value={formData.department}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
          onChange={(e) => setFormData({ ...formData, department: e.target.value })}
          aria-label="Select department"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>
      </div>

      {/* Class field - Only for CLASS_REP invitations */}
      {formData.role === 'CLASS_REP' && classes && (
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Class
          </label>
          <select
            required
            value={formData.class}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md"
            onChange={(e) => setFormData({ ...formData, class: e.target.value })}
            aria-label="Select class"
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls} value={cls}>
                {cls}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 
          ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-700'}`}
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Sending Invitation...
          </>
        ) : (
          'Send Invitation'
        )}
      </button>
    </form>
  );
}
import { useForm } from '../../hooks/useForm';
import { useToast } from '../../context/ToastContext';
import Input from '../common/Input';
import Button from '../common/Button';
import { UserRole } from '../../types';

interface SignupFormProps {
  email: string;
  role: UserRole;
  department?: string;
  class?: string;
  onSuccess: () => void;
}

export default function SignupForm({ email, role, department, class: className, onSuccess }: SignupFormProps) {
  const { showToast } = useToast();

  const { values, errors, isSubmitting, handleChange, handleSubmit } = useForm({
    initialValues: {
      firstName: '',
      lastName: '',
      password: '',
      confirmPassword: '',
      registrationNumber: role === 'student' ? '' : undefined,
    },
    validationRules: {
      firstName: { required: true, minLength: 2 },
      lastName: { required: true, minLength: 2 },
      password: { required: true, minLength: 8 },
      confirmPassword: { required: true, match: 'password' },
      registrationNumber: role === 'student' ? { required: true } : undefined,
    },
    onSubmit: async (values: {
      firstName: string;
      lastName: string;
      password: string;
      confirmPassword: string;
      registrationNumber?: string;
    }) => {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...values,
            email,
            role,
            department,
            class: className,
          }),
        });

        if (!response.ok) {
          throw new Error('Signup failed');
        }

        showToast('Account created successfully!', 'success');
        onSuccess();
      } catch (error) {
        console.error(error);
        showToast('Failed to create account', 'error');
      }
    },
  });

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="First Name"
        name="firstName"
        value={values.firstName}
        onChange={handleChange('firstName')}
        error={errors.firstName}
        required
      />

      <Input
        label="Last Name"
        name="lastName"
        value={values.lastName}
        onChange={handleChange('lastName')}
        error={errors.lastName}
        required
      />

      {role === 'student' && (
        <Input
          label="Registration Number"
          name="registrationNumber"
          value={values.registrationNumber}
          onChange={handleChange('registrationNumber')}
          error={errors.registrationNumber}
          required
        />
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        readOnly
        disabled
      />

      {department && (
        <Input
          label="Department"
          value={department}
          readOnly
          disabled
        />
      )}

      {className && (
        <Input
          label="Class"
          value={className}
          readOnly
          disabled
        />
      )}

      <Input
        label="Password"
        type="password"
        name="password"
        value={values.password}
        onChange={handleChange('password')}
        error={errors.password}
        required
      />

      <Input
        label="Confirm Password"
        type="password"
        name="confirmPassword"
        value={values.confirmPassword}
        onChange={handleChange('confirmPassword')}
        error={errors.confirmPassword}
        required
      />

      <Button type="submit" loading={isSubmitting} fullWidth>
        Create Account
      </Button>
    </form>
  );
}
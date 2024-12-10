export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  department?: string;
  class?: string;
  role: 'ADMIN' | 'HOD' | 'LECTURER' | 'REPRESENTATIVE' | 'STUDENT';
  registrationNumber?: string;
}
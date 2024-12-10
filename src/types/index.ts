export type UserRole = 'admin' | 'hod' | 'lecturer' | 'representative' | 'student';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  class?: string;
  registrationNumber?: string;
}

export interface Department {
  id: string;
  name: string;
}

export interface Class {
  id: string;
  name: string;
  departmentId: string;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}
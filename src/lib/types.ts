// TypeScript interfaces for Employee ID Card App

export interface Employee {
  username: string;
  password: string;
  office: string;
  employeeNo: string;
  lastName: string;
  firstName: string;
  middleInitial: string;
  suffix: string;
  statusOfEmployment: string;
  position: string;
  nameOfContactPerson: string;
  contactNo: string;
  homeAddress: string;
  birthday: string;
  tin: string;
  gsis: string;
  pagIbig: string;
  philhealth: string;
  bloodType: string;
  photoUrl: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  employee?: Employee;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface SessionData {
  isAuthenticated: boolean;
  employee: Employee | null;
  loginTime: number;
}

// Google Sheets API response structure
export interface GoogleSheetsResponse {
  range: string;
  majorDimension: string;
  values: string[][];
}

// Employee ID Card display data
export interface EmployeeCardData {
  fullName: string;
  employeeNo: string;
  position: string;
  office: string;
  photoUrl: string;
  contactNo: string;
  bloodType: string;
  statusOfEmployment: string;
}

// Loading states
export interface LoadingState {
  isLoading: boolean;
  message?: string;
}

// Error types
export interface AppError {
  type: 'auth' | 'network' | 'api' | 'validation';
  message: string;
  details?: string;
}
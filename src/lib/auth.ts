import { Employee, SessionData } from './types';

const SESSION_KEY = 'employeeSession';
const SESSION_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

/**
 * Save employee session to localStorage
 * @param employee - Authenticated employee data
 */
export function saveSession(employee: Employee): void {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  const sessionData: SessionData = {
    isAuthenticated: true,
    employee,
    loginTime: Date.now(),
  };
  
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify(sessionData));
  } catch (error) {
    console.error('Error saving session:', error);
  }
}

/**
 * Get current session from localStorage
 * @returns SessionData or null if no valid session
 */
export function getSession(): SessionData | null {
  if (typeof window === 'undefined') return null; // Skip on server-side
  
  try {
    const sessionJson = localStorage.getItem(SESSION_KEY);
    if (!sessionJson) return null;
    
    const sessionData: SessionData = JSON.parse(sessionJson);
    
    // Check if session is expired
    if (Date.now() - sessionData.loginTime > SESSION_DURATION) {
      clearSession();
      return null;
    }
    
    return sessionData;
  } catch (error) {
    console.error('Error getting session:', error);
    clearSession(); // Clear corrupted session
    return null;
  }
}

/**
 * Clear current session from localStorage
 */
export function clearSession(): void {
  if (typeof window === 'undefined') return; // Skip on server-side
  
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch (error) {
    console.error('Error clearing session:', error);
  }
}

/**
 * Check if user is currently authenticated
 * @returns boolean
 */
export function isAuthenticated(): boolean {
  const session = getSession();
  return session?.isAuthenticated === true && session.employee !== null;
}

/**
 * Get current authenticated employee
 * @returns Employee or null
 */
export function getCurrentEmployee(): Employee | null {
  const session = getSession();
  return session?.employee || null;
}

/**
 * Validate login credentials format
 * @param username - Username to validate
 * @param password - Password to validate
 * @returns Validation result with error messages
 */
export function validateCredentials(username: string, password: string): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  // Username validation
  if (!username || username.trim().length === 0) {
    errors.push('Username is required');
  } else if (username.length < 3) {
    errors.push('Username must be at least 3 characters long');
  }
  
  // Password validation
  if (!password || password.trim().length === 0) {
    errors.push('Password is required');
  } else if (password.length < 3) {
    errors.push('Password must be at least 3 characters long');
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Format employee full name
 * @param employee - Employee data
 * @returns Formatted full name
 */
export function getFullName(employee: Employee): string {
  const parts = [
    employee.firstName,
    employee.middleInitial ? `${employee.middleInitial}.` : '',
    employee.lastName,
    employee.suffix,
  ].filter(part => part && part.trim().length > 0);
  
  return parts.join(' ').trim();
}

/**
 * Format employee display data for ID card
 * @param employee - Employee data
 * @returns Formatted employee card data
 */
export function formatEmployeeCardData(employee: Employee) {
  return {
    fullName: getFullName(employee),
    employeeNo: employee.employeeNo,
    position: employee.position,
    office: employee.office,
    photoUrl: employee.photoUrl,
    contactNo: employee.contactNo,
    bloodType: employee.bloodType,
    statusOfEmployment: employee.statusOfEmployment,
    birthday: employee.birthday,
    homeAddress: employee.homeAddress,
    tin: employee.tin,
    gsis: employee.gsis,
    pagIbig: employee.pagIbig,
    philhealth: employee.philhealth,
  };
}

/**
 * Session timeout warning (for future implementation)
 * @returns Minutes until session expires
 */
export function getSessionTimeRemaining(): number {
  const session = getSession();
  if (!session) return 0;
  
  const elapsed = Date.now() - session.loginTime;
  const remaining = SESSION_DURATION - elapsed;
  
  return Math.max(0, Math.ceil(remaining / (60 * 1000))); // Return minutes
}
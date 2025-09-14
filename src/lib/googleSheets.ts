import { Employee, GoogleSheetsResponse } from './types';

// Google Sheets API configuration
const GOOGLE_SHEETS_API_KEY = process.env.GOOGLE_SHEETS_API_KEY;
const GOOGLE_SHEET_ID = process.env.GOOGLE_SHEET_ID;
const GOOGLE_SHEET_NAME = process.env.GOOGLE_SHEET_NAME || 'Employees';

// Column mapping based on the spreadsheet structure
const COLUMN_MAPPING = {
  USERNAME: 0,
  PASSWORD: 1,
  OFFICE: 2,
  EMPLOYEE_NO: 3,
  LAST_NAME: 4,
  FIRST_NAME: 5,
  MIDDLE_INITIAL: 6,
  SUFFIX: 7,
  STATUS_OF_EMPLOYMENT: 8,
  POSITION: 9,
  NAME_OF_CONTACT_PERSON: 10,
  CONTACT_NO: 11,
  HOME_ADDRESS: 12,
  BIRTHDAY: 13,
  TIN: 14,
  GSIS: 15,
  PAG_IBIG: 16,
  PHILHEALTH: 17,
  BLOODTYPE: 18,
  PHOTOURL: 19,
};

/**
 * Convert Google Drive sharing link to direct image URL
 * @param shareUrl - Google Drive sharing URL
 * @returns Direct image URL
 */
export function convertGoogleDriveUrl(shareUrl: string): string {
  if (!shareUrl) return '';
  
  try {
    // Handle different Google Drive URL formats
    let fileId = '';
    
    // Format: https://drive.google.com/file/d/FILE_ID/view?usp=sharing
    if (shareUrl.includes('/file/d/')) {
      const match = shareUrl.match(/\/file\/d\/([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }
    
    // Format: https://drive.google.com/open?id=FILE_ID
    else if (shareUrl.includes('open?id=')) {
      const match = shareUrl.match(/id=([a-zA-Z0-9-_]+)/);
      if (match) fileId = match[1];
    }
    
    // If already a direct URL, return as is
    else if (shareUrl.includes('googleusercontent.com') || shareUrl.includes('uc?id=')) {
      return shareUrl;
    }
    
    // Convert to direct image URL
    if (fileId) {
      return `https://drive.google.com/uc?id=${fileId}&export=view`;
    }
    
    return shareUrl; // Return original if can't parse
  } catch (error) {
    console.error('Error converting Google Drive URL:', error);
    return shareUrl;
  }
}

/**
 * Parse raw Google Sheets data into Employee objects
 * @param rawData - Raw data from Google Sheets API
 * @returns Array of Employee objects
 */
function parseEmployeeData(rawData: string[][]): Employee[] {
  if (!rawData || rawData.length <= 1) return [];
  
  // Skip header row and parse data
  const employees: Employee[] = rawData.slice(1).map((row) => {
    // Ensure all columns exist with fallback values
    const safeRow = Array(20).fill('').map((_, i) => row[i] || '');
    
    return {
      username: safeRow[COLUMN_MAPPING.USERNAME]?.trim() || '',
      password: safeRow[COLUMN_MAPPING.PASSWORD]?.trim() || '',
      office: safeRow[COLUMN_MAPPING.OFFICE]?.trim() || '',
      employeeNo: safeRow[COLUMN_MAPPING.EMPLOYEE_NO]?.trim() || '',
      lastName: safeRow[COLUMN_MAPPING.LAST_NAME]?.trim() || '',
      firstName: safeRow[COLUMN_MAPPING.FIRST_NAME]?.trim() || '',
      middleInitial: safeRow[COLUMN_MAPPING.MIDDLE_INITIAL]?.trim() || '',
      suffix: safeRow[COLUMN_MAPPING.SUFFIX]?.trim() || '',
      statusOfEmployment: safeRow[COLUMN_MAPPING.STATUS_OF_EMPLOYMENT]?.trim() || '',
      position: safeRow[COLUMN_MAPPING.POSITION]?.trim() || '',
      nameOfContactPerson: safeRow[COLUMN_MAPPING.NAME_OF_CONTACT_PERSON]?.trim() || '',
      contactNo: safeRow[COLUMN_MAPPING.CONTACT_NO]?.trim() || '',
      homeAddress: safeRow[COLUMN_MAPPING.HOME_ADDRESS]?.trim() || '',
      birthday: safeRow[COLUMN_MAPPING.BIRTHDAY]?.trim() || '',
      tin: safeRow[COLUMN_MAPPING.TIN]?.trim() || '',
      gsis: safeRow[COLUMN_MAPPING.GSIS]?.trim() || '',
      pagIbig: safeRow[COLUMN_MAPPING.PAG_IBIG]?.trim() || '',
      philhealth: safeRow[COLUMN_MAPPING.PHILHEALTH]?.trim() || '',
      bloodType: safeRow[COLUMN_MAPPING.BLOODTYPE]?.trim() || '',
      photoUrl: convertGoogleDriveUrl(safeRow[COLUMN_MAPPING.PHOTOURL]?.trim() || ''),
    };
  });
  
  return employees.filter(emp => emp.username && emp.password); // Only return valid entries
}

/**
 * Fetch employee data from Google Sheets
 * @returns Promise<Employee[]>
 */
export async function fetchEmployeeData(): Promise<Employee[]> {
  if (!GOOGLE_SHEETS_API_KEY || !GOOGLE_SHEET_ID) {
    throw new Error('Google Sheets API configuration is missing. Please check your environment variables.');
  }
  
  try {
    const range = `${GOOGLE_SHEET_NAME}!A:T`; // A to T covers all 20 columns
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values/${range}?key=${GOOGLE_SHEETS_API_KEY}`;
    
    const response = await fetch(url);
    
    if (!response.ok) {
      if (response.status === 403) {
        throw new Error('Access denied. Please check your API key and sheet permissions.');
      } else if (response.status === 404) {
        throw new Error('Sheet not found. Please check your Sheet ID and sheet name.');
      }
      throw new Error(`Google Sheets API error: ${response.status} ${response.statusText}`);
    }
    
    const data: GoogleSheetsResponse = await response.json();
    
    if (!data.values || data.values.length === 0) {
      throw new Error('No data found in the specified sheet range.');
    }
    
    return parseEmployeeData(data.values);
  } catch (error) {
    console.error('Error fetching employee data:', error);
    throw error;
  }
}

/**
 * Find employee by username and password
 * @param username - Employee username
 * @param password - Employee password
 * @returns Promise<Employee | null>
 */
export async function authenticateEmployee(username: string, password: string): Promise<Employee | null> {
  try {
    const employees = await fetchEmployeeData();
    
    const employee = employees.find(
      (emp) => 
        emp.username.toLowerCase() === username.toLowerCase() && 
        emp.password === password
    );
    
    return employee || null;
  } catch (error) {
    console.error('Error authenticating employee:', error);
    throw error;
  }
}

/**
 * Demo employee data for testing when Google Sheets is not configured
 */
export const DEMO_EMPLOYEES: Employee[] = [
  {
    username: 'john.doe',
    password: 'demo123',
    office: 'Main Office',
    employeeNo: 'EMP001',
    lastName: 'Doe',
    firstName: 'John',
    middleInitial: 'M',
    suffix: '',
    statusOfEmployment: 'Regular',
    position: 'Software Developer',
    nameOfContactPerson: 'Jane Smith',
    contactNo: '+1-555-0123',
    homeAddress: '123 Main St, Anytown, USA 12345',
    birthday: '1990-05-15',
    tin: '123-456-789',
    gsis: 'GSIS123456',
    pagIbig: 'PAGIBIG789',
    philhealth: 'PH123456789',
    bloodType: 'A+',
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3504af9e-1fd2-4a97-ab3d-466cd2cffe51.png',
  },
  {
    username: 'jane.smith',
    password: 'demo456',
    office: 'Branch Office',
    employeeNo: 'EMP002',
    lastName: 'Smith',
    firstName: 'Jane',
    middleInitial: 'A',
    suffix: '',
    statusOfEmployment: 'Regular',
    position: 'Project Manager',
    nameOfContactPerson: 'Bob Johnson',
    contactNo: '+1-555-0456',
    homeAddress: '456 Oak Ave, Somewhere, USA 67890',
    birthday: '1988-08-22',
    tin: '987-654-321',
    gsis: 'GSIS654321',
    pagIbig: 'PAGIBIG456',
    philhealth: 'PH987654321',
    bloodType: 'B+',
    photoUrl: 'https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/e70e705f-f0e1-4eaa-8064-e13d5feccba9.png',
  },
];

/**
 * Get demo authentication for testing
 */
export function authenticateDemoEmployee(username: string, password: string): Employee | null {
  return DEMO_EMPLOYEES.find(
    (emp) => 
      emp.username.toLowerCase() === username.toLowerCase() && 
      emp.password === password
  ) || null;
}
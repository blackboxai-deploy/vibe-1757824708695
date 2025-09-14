import { NextRequest, NextResponse } from 'next/server';
import { fetchEmployeeData, DEMO_EMPLOYEES } from '@/lib/googleSheets';
import { ApiResponse, Employee } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    let employees: Employee[] = [];

    try {
      // Try to fetch from Google Sheets
      employees = await fetchEmployeeData();
    } catch (error) {
      console.warn('Google Sheets fetch failed, using demo data:', error);
      // Fallback to demo data
      employees = DEMO_EMPLOYEES;
    }

    // If username is provided, filter for specific employee
    if (username) {
      const employee = employees.find(emp => 
        emp.username.toLowerCase() === username.toLowerCase()
      );

      if (!employee) {
        return NextResponse.json({
          success: false,
          message: 'Employee not found',
        } as ApiResponse, { status: 404 });
      }

      // Remove password from response
      const { password: _, ...safeEmployee } = employee;

      return NextResponse.json({
        success: true,
        data: safeEmployee,
      } as ApiResponse<Employee>, { status: 200 });
    }

    // Return all employees (without passwords)
    const safeEmployees = employees.map(emp => {
      const { password: _, ...empWithoutPassword } = emp;
      return empWithoutPassword;
    });

    return NextResponse.json({
      success: true,
      data: safeEmployees,
      message: `Found ${safeEmployees.length} employees`,
    } as ApiResponse<Employee[]>, { status: 200 });

  } catch (error) {
    console.error('Error fetching employee data:', error);
    
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch employee data',
      message: 'Employee service is temporarily unavailable. Please try again later.',
    } as ApiResponse, { status: 500 });
  }
}

// Health check endpoint
export async function HEAD() {
  return new NextResponse(null, { 
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
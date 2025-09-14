import { NextRequest, NextResponse } from 'next/server';
import { authenticateEmployee, authenticateDemoEmployee } from '@/lib/googleSheets';
import { LoginCredentials, AuthResponse } from '@/lib/types';

export async function POST(request: NextRequest) {
  try {
    const body: LoginCredentials = await request.json();
    const { username, password } = body;

    // Validate request body
    if (!username || !password) {
      return NextResponse.json({
        success: false,
        message: 'Username and password are required',
      } as AuthResponse, { status: 400 });
    }

    // Attempt authentication
    let employee = null;
    
    try {
      // Try Google Sheets authentication first
      employee = await authenticateEmployee(username, password);
    } catch (error) {
      console.warn('Google Sheets authentication failed, trying demo mode:', error);
      
      // Fallback to demo authentication
      employee = authenticateDemoEmployee(username, password);
    }

    if (!employee) {
      return NextResponse.json({
        success: false,
        message: 'Invalid username or password. Please check your credentials and try again.',
      } as AuthResponse, { status: 401 });
    }

    // Successful authentication
    // Remove password from employee data before sending to client
    const { password: _, ...employeeWithoutPassword } = employee;
    
    return NextResponse.json({
      success: true,
      message: 'Login successful',
      employee: employeeWithoutPassword,
    } as AuthResponse, { status: 200 });

  } catch (error) {
    console.error('Authentication error:', error);
    
    return NextResponse.json({
      success: false,
      message: 'Authentication service is temporarily unavailable. Please try again later.',
    } as AuthResponse, { status: 500 });
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Authentication endpoint. Use POST method to login.',
    endpoints: {
      login: 'POST /api/auth/login',
    },
    demoCredentials: [
      { username: 'john.doe', password: 'demo123' },
      { username: 'jane.smith', password: 'demo456' },
    ],
  }, { status: 200 });
}
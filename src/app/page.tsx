'use client';

import React, { useState, useEffect } from 'react';
import LoginForm from '@/components/LoginForm';
import EmployeeCard from '@/components/EmployeeCard';
import { LoadingOverlay } from '@/components/LoadingSpinner';
import { Employee, LoginCredentials } from '@/lib/types';
import { saveSession, getSession, clearSession, isAuthenticated } from '@/lib/auth';

export default function HomePage() {
  const [currentEmployee, setCurrentEmployee] = useState<Employee | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  // Initialize session on component mount
  useEffect(() => {
    const initializeSession = async () => {
      try {
        if (isAuthenticated()) {
          const session = getSession();
          if (session?.employee) {
            setCurrentEmployee(session.employee);
          }
        }
      } catch (error) {
        console.error('Session initialization error:', error);
        clearSession(); // Clear corrupted session
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
  }, []);

  const handleLogin = async (credentials: LoginCredentials) => {
    setIsAuthenticating(true);
    setLoginError(null);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (data.success && data.employee) {
        // Save session and update state
        saveSession(data.employee);
        setCurrentEmployee(data.employee);
        setLoginError(null);
      } else {
        setLoginError(data.message || 'Login failed. Please try again.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setLoginError('Network error. Please check your connection and try again.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleLogout = () => {
    clearSession();
    setCurrentEmployee(null);
    setLoginError(null);
  };

  // Show loading screen during initialization
  if (isInitializing) {
    return <LoadingOverlay message="Initializing application..." isVisible={true} />;
  }

  // Show employee card if authenticated
  if (currentEmployee) {
    return (
      <EmployeeCard 
        employee={currentEmployee} 
        onLogout={handleLogout}
      />
    );
  }

  // Show login form if not authenticated
  return (
    <>
      <LoginForm
        onLogin={handleLogin}
        isLoading={isAuthenticating}
        error={loginError}
      />
      <LoadingOverlay 
        message="Signing you in..." 
        isVisible={isAuthenticating} 
      />
    </>
  );
}
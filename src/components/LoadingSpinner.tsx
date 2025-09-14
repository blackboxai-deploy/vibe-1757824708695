'use client';

import React from 'react';

interface LoadingSpinnerProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function LoadingSpinner({ 
  message = 'Loading...', 
  size = 'md',
  className = '' 
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  const containerSizeClasses = {
    sm: 'gap-2 text-sm',
    md: 'gap-3 text-base',
    lg: 'gap-4 text-lg'
  };

  return (
    <div className={`flex flex-col items-center justify-center ${containerSizeClasses[size]} ${className}`}>
      <div className={`${sizeClasses[size]} animate-spin`}>
        <div className="border-4 border-blue-200 border-t-blue-600 rounded-full w-full h-full"></div>
      </div>
      {message && (
        <p className="text-gray-600 font-medium text-center">{message}</p>
      )}
    </div>
  );
}

// Overlay spinner for full-page loading
export function LoadingOverlay({ message = 'Loading...', isVisible = true }: {
  message?: string;
  isVisible?: boolean;
}) {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 shadow-xl">
        <LoadingSpinner message={message} size="lg" />
      </div>
    </div>
  );
}

// Inline loading state
export function InlineLoader({ message, className }: {
  message?: string;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center p-4 ${className || ''}`}>
      <LoadingSpinner message={message} size="sm" />
    </div>
  );
}
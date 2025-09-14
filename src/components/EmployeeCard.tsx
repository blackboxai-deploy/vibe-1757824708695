'use client';

import React from 'react';
import Image from 'next/image';
import { Employee } from '@/lib/types';
import { formatEmployeeCardData } from '@/lib/auth';

interface EmployeeCardProps {
  employee: Employee;
  onLogout: () => void;
}

export default function EmployeeCard({ employee, onLogout }: EmployeeCardProps) {
  const cardData = formatEmployeeCardData(employee);

  const handlePrintCard = () => {
    // Placeholder function for print functionality
    alert('Print functionality will be implemented in a future update.');
  };

  const handleDownloadPDF = () => {
    // Placeholder function for PDF download functionality
    alert('PDF download functionality will be implemented in a future update.');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <div className="bg-blue-600 w-8 h-8 rounded-full flex items-center justify-center mr-3">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-4 0V5a2 2 0 014 0v1" />
                </svg>
              </div>
              <h1 className="text-xl font-semibold text-gray-900">Employee ID System</h1>
            </div>
            <button
              onClick={onLogout}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Digital Employee ID Card</h2>
          <p className="text-gray-600">Welcome back, {cardData.fullName}</p>
        </div>

        {/* ID Card */}
        <div className="bg-white rounded-xl shadow-2xl overflow-hidden mx-auto max-w-2xl">
          {/* Card Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-6 py-4">
            <div className="flex items-center justify-between text-white">
              <div>
                <h3 className="text-lg font-semibold">EMPLOYEE ID CARD</h3>
                <p className="text-blue-100 text-sm">{employee.office}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-blue-100">Employee No.</p>
                <p className="text-lg font-bold">{cardData.employeeNo}</p>
              </div>
            </div>
          </div>

          {/* Card Body */}
          <div className="px-6 py-6">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Photo */}
              <div className="flex-shrink-0 mx-auto md:mx-0">
                <div className="w-32 h-40 bg-gray-200 rounded-lg overflow-hidden border-2 border-gray-300 shadow-md">
                  {cardData.photoUrl ? (
                    <Image
                      src={cardData.photoUrl}
                      alt={`${cardData.fullName} Photo`}
                      width={128}
                      height={160}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to placeholder on error
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const parent = target.parentElement;
                        if (parent) {
                          parent.innerHTML = `
                            <div class="w-full h-full bg-gray-300 flex items-center justify-center">
                              <svg class="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                          `;
                        }
                      }}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7-7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Employee Information */}
              <div className="flex-1 space-y-4">
                <div>
                  <h4 className="text-2xl font-bold text-gray-900">{cardData.fullName}</h4>
                  <p className="text-lg text-blue-600 font-semibold">{cardData.position}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 font-medium">Employment Status</p>
                    <p className="text-gray-900">{cardData.statusOfEmployment}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Blood Type</p>
                    <p className="text-gray-900">{cardData.bloodType || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Contact Number</p>
                    <p className="text-gray-900">{cardData.contactNo || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Birthday</p>
                    <p className="text-gray-900">{cardData.birthday || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-700 text-base">Personal Information</h5>
                  <div>
                    <p className="text-gray-500 font-medium">Home Address</p>
                    <p className="text-gray-900">{employee.homeAddress || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 font-medium">Emergency Contact</p>
                    <p className="text-gray-900">{employee.nameOfContactPerson || 'N/A'}</p>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h5 className="font-semibold text-gray-700 text-base">Government IDs</h5>
                  <div className="space-y-2">
                    <div>
                      <span className="text-gray-500 font-medium">TIN:</span>
                      <span className="text-gray-900 ml-2">{employee.tin || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">GSIS:</span>
                      <span className="text-gray-900 ml-2">{employee.gsis || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">PAG-IBIG:</span>
                      <span className="text-gray-900 ml-2">{employee.pagIbig || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 font-medium">PhilHealth:</span>
                      <span className="text-gray-900 ml-2">{employee.philhealth || 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-center gap-4 mt-8">
          <button
            onClick={handleDownloadPDF}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Download PDF
          </button>
          
          <button
            onClick={handlePrintCard}
            className="inline-flex items-center px-6 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print ID Card
          </button>
        </div>

        {/* Footer Info */}
        <div className="text-center mt-8 text-sm text-gray-500">
          <p>This is your official digital employee identification card.</p>
          <p className="mt-1">Keep your login credentials secure and do not share them with others.</p>
        </div>
      </div>
    </div>
  );
}
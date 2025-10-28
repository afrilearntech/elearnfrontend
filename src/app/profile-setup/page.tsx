'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfileSetup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    router.push('/who-are-you');
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] flex items-center justify-center p-4">
      <div className="w-full max-w-[742px] h-[811px] sm:h-[811px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#059669] p-6 text-white">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-white/20 border border-[#E5E7EB] rounded-full flex items-center justify-center">
              <Icon icon="material-symbols:person" className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Profile Setup
              </h1>
              <p className="text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Step 1 of 3 - Secure your account
              </p>
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full w-1/3"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-[73px] sm:pr-[68px] pt-[72px] space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Full Name
              </label>
            </div>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Enter your full name"
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:mail" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Email address
              </label>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              placeholder="Enter your email address"
              onChange={handleInputChange}
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:lock" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Password
              </label>
            </div>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              placeholder="Set a password"
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:lock" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Confirm Password
              </label>
            </div>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              placeholder="Confirm your password"
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#059669] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:from-[#1E3A8A] hover:to-[#047857] transition-all duration-200 shadow-lg mt-[67px]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Continue
          </button>
        </form>
      </div>
    </div>
  );
}

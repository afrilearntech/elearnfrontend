'use client';

import { useState } from 'react';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';

export default function TellUsAboutYourself() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    birthday: '',
    gender: '',
    institution: '',
    gradeLevel: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form submitted:', formData);
    
    const gradeNumber = parseInt(formData.gradeLevel);
    
    if (gradeNumber >= 1 && gradeNumber <= 5) {
      router.push('/dashboard/elementary');
    } else if (gradeNumber >= 6 && gradeNumber <= 10) {
      router.push('/dashboard');
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-[#EFF6FF] to-[#F0FDF4] flex items-center justify-center p-4">
      <div className="w-full max-w-[742px] min-h-[811px] bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-[#1E40AF] to-[#059669] p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-white/20 border border-[#E5E7EB] rounded-full flex items-center justify-center">
                <Icon icon="material-symbols:person" className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Tell us about yourself!
                </h1>
                <p className="text-sm opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Step 3 of 3 - This helps us personalize your learning
                </p>
              </div>
            </div>
            <div className="text-sm font-semibold" style={{ fontFamily: 'Poppins, sans-serif' }}>
              100%
            </div>
          </div>
          
          <div className="w-full bg-white/20 rounded-full h-2">
            <div className="bg-white h-2 rounded-full w-full"></div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-4 sm:px-[73px] sm:pr-[68px] pt-[72px] space-y-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:calendar-month" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                When's your Birthday?
              </label>
            </div>
            <div className="relative">
              <input
                type="date"
                name="birthday"
                value={formData.birthday}
                onChange={handleInputChange}
                className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:person" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Gender
              </label>
            </div>
            <div className="relative">
              <select
                name="gender"
                value={formData.gender}
                onChange={handleInputChange}
                className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none bg-white"
                style={{ fontFamily: 'Poppins, sans-serif' }}
              >
                <option value="">Select your gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
              <Icon icon="material-symbols:keyboard-arrow-down" className="absolute right-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:school" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Name of Institution
              </label>
            </div>
            <input
              type="text"
              name="institution"
              value={formData.institution}
              onChange={handleInputChange}
              placeholder="Enter the name of your school"
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Icon icon="material-symbols:school" className="w-4 h-4 text-gray-600" />
              <label className="text-sm font-medium text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                Grade/Level
              </label>
            </div>
            <input
              type="text"
              name="gradeLevel"
              value={formData.gradeLevel}
              onChange={handleInputChange}
              placeholder="Enter your grade level"
              className="w-full sm:w-[601px] h-[57px] px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              style={{ fontFamily: 'Poppins, sans-serif' }}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-[#1E40AF] to-[#059669] text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 hover:from-[#1E3A8A] hover:to-[#047857] transition-all duration-200 shadow-lg mt-[67px]"
            style={{ fontFamily: 'Poppins, sans-serif' }}
          >
            Finish Setup
          </button>
        </form>
      </div>
    </div>
  );
}

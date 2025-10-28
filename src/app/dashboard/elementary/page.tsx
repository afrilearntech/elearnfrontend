'use client';

import { useState } from 'react';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';

export default function ElementaryDashboard() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleMenuClose = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />
      
      <div className="flex">
        <ElementarySidebar 
          activeItem="home" 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMenuClose}
        />
        
        <main className="flex-1 lg:ml-0 bg-gradient-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE]">
          <div className="p-4 lg:p-8">
            {/* Welcome Banner */}
            <div className="bg-white rounded-2xl shadow-lg h-[140px] mt-8 mr-8 ml-8">
              <div className="h-full flex flex-col justify-center px-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Welcome back, Emma! ✨
                </h1>
                <p className="text-base lg:text-lg text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Ready for another magical learning adventure?
                </p>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

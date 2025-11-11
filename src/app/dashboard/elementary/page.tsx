'use client';

import { useState } from 'react';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import ElementaryStatsCards from '@/components/elementary/ElementaryStatsCards';
import ContinueLearningSection from '@/components/elementary/ContinueLearningSection';
import MagicChallengesSection from '@/components/elementary/MagicChallengesSection';
import ExploreSubjectsSection from '@/components/elementary/ExploreSubjectsSection';
import RecentAdventuresSection from '@/components/elementary/RecentAdventuresSection';

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
        
        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px]">
          <div className="p-4 lg:p-8">
            {/* Welcome Banner */}
            <div className="bg-white/60 rounded-2xl shadow-lg h-[140px] mt-8 sm:mx-8 mx-4">
              <div className="h-full flex flex-col justify-center px-6 sm:px-8">
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Welcome back, Emma! ✨
                </h1>
                <p className="text-base lg:text-lg text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Ready for another magical learning adventure?
                </p>
              </div>
            </div>

            {/* Progress/Stats Section */}
            <div className="sm:mx-8 mx-4">
              <ElementaryStatsCards />
            </div>

            <div className="flex flex-col lg:flex-row lg:gap-[24px] mt-8 sm:mx-8 mx-4">
              {/* Continue Learning Section */}
              <ContinueLearningSection />

              {/* Today's Magic Challenges */}
              <MagicChallengesSection />
            </div>

            {/* Explore Magical Subjects */}
            <div className="sm:mx-8 mx-4">
              <ExploreSubjectsSection />
            </div>

            {/* Recent Adventures */}
            <div className="sm:mx-8 mx-4">
              <RecentAdventuresSection />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';

export default function SubjectLessonDetail() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />
      <div className="flex">
        <ElementarySidebar activeItem="subjects" isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMenuClose} />

        <main className="flex-1 bg-gradient-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE]">
          <div className="p-4 lg:p-8">
            {/* Header progress card */}
            <div className="bg-white/60 rounded-xl shadow-md px-6 py-4 ml-8 mr-8 h-[187px] flex flex-col justify-between border" style={{ borderColor: 'rgba(59, 130, 246, 0.3)' }}>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-[55px] h-[60px] rounded-lg bg-gradient-to-r from-[#3B82F6] to-[#10B981] flex items-center justify-center">
                    <Image src="/settings.png" alt="settings" width={27} height={32} />
                  </div>
                  <div>
                    <h2 className="text-[25px] font-normal text-[#9333EA]" style={{ fontFamily: 'Poppins, sans-serif' }}>Fun with Science!</h2>
                    <p className="text-[15px] font-normal text-[#4B5563]" style={{ fontFamily: 'Poppins, sans-serif' }}>Lesson 3: Amazing Chemical Reactions</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span className="inline-flex items-center justify-center w-[108px] h-[34px] rounded-full bg-[#10B981]/20 text-[#10B981] text-[14px]" style={{ fontFamily: 'Poppins, sans-serif' }}>Lesson 3 of 8</span>
                  <button className="w-[164px] h-[40px] rounded-full bg-[#F97316] text-white text-[14px] flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <Icon icon="mdi:arrow-left" width={18} height={18} />
                    Back to Subjects
                  </button>
                </div>
              </div>
              <div className="mt-3">
                <div className="h-[13px] w-full bg-gray-200 rounded-full">
                  <div className="h-[13px] rounded-full bg-gradient-to-r from-[#10B981] to-[#3B82F6]" style={{ width: '40%' }}></div>
                </div>
                <div className="text-[12px] text-[#4B5563] mt-1 text-center" style={{ fontFamily: 'Poppins, sans-serif' }}>3 of 8 lessons completed</div>
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_360px] gap-6 mt-6 ml-8 mr-8">
              {/* Main video/content */}
              <div>
                <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="px-6 py-3 bg-gradient-to-r from-[#EC4899] to-[#6366F1] text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    <div className="text-[16px] font-semibold">Watch & Learn!</div>
                    <div className="text-[12px] opacity-90">Get ready for an exciting science experiment!</div>
                  </div>
                  <div className="relative h-[280px] w-full bg-gray-100">
                    <Image src="/grade3.png" alt="lesson" fill className="object-cover" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 bg-white rounded-full flex items-center justify-center shadow-lg">
                        <Icon icon="mdi:play" width={28} height={28} className="text-[#F59E0B]" />
                      </div>
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-2" style={{ fontFamily: 'Poppins, sans-serif' }}>Inside the Science Laboratory 🧪</h3>
                    <p className="text-[13px] text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      This video takes us inside a science lab. We will see tools like test tubes, beakers, and microscopes. We learn what scientists do in the lab, how they mix liquids, and how to stay safe by wearing gloves and coats. It’s a fun way to see how science helps us learn new things!
                    </p>
                    <div className="flex items-center gap-4 mt-4">
                      <button className="flex-1 h-10 rounded-lg bg-gradient-to-r from-[#10B981] to-[#3B82F6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Icon icon="mdi:chevron-right-circle" /> Next Lesson
                      </button>
                      <button className="flex-1 h-10 rounded-lg bg-gradient-to-r from-[#FB923C] to-[#EF4444] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <Icon icon="mdi:clipboard-text" /> Try Quiz
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right sidebar widgets */}
              <div className="space-y-4">
                <div className="bg-white rounded-xl shadow-md p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Icon icon="mdi:trophy" className="text-[#F59E0B]" />
                    <h4 className="text-[14px] font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>Your Badges</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Video Master','Quiz Whiz','Fast Learner'].map((b, i) => (
                      <div key={b} className="bg-gray-50 rounded-lg h-16 flex flex-col items-center justify-center">
                        <div className={`w-8 h-8 rounded-full ${i===0?'bg-[#F59E0B]':i===1?'bg-[#3B82F6]':'bg-[#8B5CF6]'} flex items-center justify-center text-white`}>
                          <Icon icon={i===0?'mdi:star':'mdi:crown'} width={16} height={16} />
                        </div>
                        <span className="text-[10px] mt-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>This Week</h4>
                  <div className="text-[10px] text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Lessons Completed <span className="float-right">5/8</span></div>
                  <div className="h-2 bg-gray-200 rounded-full mb-2">
                    <div className="h-2 rounded-full bg-[#3B82F6]" style={{ width: '62%' }}></div>
                  </div>
                  <div className="text-[10px] text-gray-600 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>Quiz Score <span className="float-right">92%</span></div>
                  <div className="h-2 bg-gray-200 rounded-full">
                    <div className="h-2 rounded-full bg-[#EF4444]" style={{ width: '92%' }}></div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-4">
                  <h4 className="text-[14px] font-semibold text-gray-900 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>Quick Actions</h4>
                  <div className="space-y-2">
                    <button className="w-full h-10 rounded-lg bg-[#F472B6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Icon icon="mdi:content-save" /> Save for Later
                    </button>
                    <button className="w-full h-10 rounded-lg bg-[#3B82F6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Icon icon="mdi:share" /> Share with Friends
                    </button>
                    <button className="w-full h-10 rounded-lg bg-[#8B5CF6] text-white text-sm flex items-center justify-center gap-2" style={{ fontFamily: 'Poppins, sans-serif' }}>
                      <Icon icon="mdi:help-circle" /> Ask for Help
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}



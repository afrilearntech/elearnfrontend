'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';

export default function SubjectsLessonsPage() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);

  const cards = [
    { id: 1, title: 'Fun with Numbers!', subtitle: 'Learn counting and basic math with colorful animations', tag: 'Math', time: '15 min', img: '/grade1.png', border: 'border-[#60A5FA]', playColor: '#3B82F6' },
    { id: 2, title: 'Story Time Adventures', subtitle: 'Join magical stories with talking animals and heroes', tag: 'Reading', time: '20 min', img: '/grade2.png', border: 'border-[#F472B6]', playColor: '#EC4899' },
    { id: 3, title: 'Amazing Experiments', subtitle: 'Discover cool science with fun experiments', tag: 'Science', time: '20 min', img: '/grade3.png', border: 'border-[#34D399]', playColor: '#16A34A' },
    { id: 4, title: 'ABC Song Party', subtitle: 'Sing and dance with the alphabet letters', tag: 'Reading', time: '20 min', img: '/grade4.png', border: 'border-[#A78BFA]', playColor: '#A855F7' },
    { id: 5, title: 'Shapes & Colors', subtitle: 'Learn about different shapes and bright colors', tag: 'Math', time: '20 min', img: '/grade5.png', border: 'border-[#FB923C]', playColor: '#F59E0B' },
    { id: 6, title: 'Animal Friends', subtitle: 'Meet cute animals and learn about nature', tag: 'Science', time: '20 min', img: '/grade6.png', border: 'border-[#22D3EE]', playColor: '#10B981' },
  ];

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />

      <div className="flex">
        <ElementarySidebar activeItem="subjects" isMobileMenuOpen={isMobileMenuOpen} onMobileMenuClose={handleMenuClose} />

        <main className="flex-1 bg-gradient-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE]">
          <div className="p-4 lg:p-8">
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 bg-white/60 rounded-xl px-4 py-3 w-full max-w-[980px] ml-8">
              <button className="px-3 py-1.5 rounded-lg bg-[#E5E7EB] text-gray-700 text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>All Subjects</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#D1FAE5] text-[#065F46] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Math</button>
              <button className="px-3 py-1.5 rounded-lg bg-[#DBEAFE] text-[#1E40AF] text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>Reading</button>
            </div>

            {/* Grid of lesson cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mt-6 ml-8 mr-8">
              {cards.map(card => (
                <Link href={`/subjects/${card.id}`} key={card.id} className={`bg-white rounded-xl shadow-md overflow-hidden border ${card.border}`}>
                  {/* Thumbnail */}
                  <div className="relative h-[160px] w-full">
                    <Image src={card.img} alt={card.title} fill className="object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow">
                        <Icon icon="mdi:play" width={22} height={22} style={{ color: card.playColor }} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="text-[16px] font-semibold text-gray-900 mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>{card.title}</h3>
                    <p className="text-[12px] text-gray-600 mb-3" style={{ fontFamily: 'Poppins, sans-serif' }}>{card.subtitle}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] px-2 py-0.5 rounded-lg bg-gray-100 text-gray-700" style={{ fontFamily: 'Poppins, sans-serif' }}>{card.tag}</span>
                      <span className="text-[10px] text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>{card.time}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}



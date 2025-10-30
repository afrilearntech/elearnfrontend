'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Icon } from '@iconify/react';

interface ElementaryNavbarProps {
  onMenuToggle: () => void;
}

export default function ElementaryNavbar({ onMenuToggle }: ElementaryNavbarProps) {
  return (
    <nav className="bg-gradient-to-r from-[#3AB0FF] to-[#00D68F] w-full h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 sticky top-0 z-50">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
          <Image
            src="/moe.png"
            alt="Ministry of Education Logo"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
        <div>
          <h1 className="text-[18px] font-semibold text-[#111827]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Ministry of Education
          </h1>
          <p className="text-[14px] font-normal text-[#6B7280]" style={{ fontFamily: 'Poppins, sans-serif' }}>
            Liberia eLearning
          </p>
        </div>
      </div>
      
      <button
        onClick={onMenuToggle}
        className="lg:hidden p-2 text-white hover:text-gray-100"
      >
        <Icon icon="material-symbols:menu" className="w-6 h-6" />
      </button>
    </nav>
  );
}

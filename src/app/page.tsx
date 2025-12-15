import Image from 'next/image';
import { Icon } from '@iconify/react';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-r from-[#EFF6FF] to-[#F0FDF4] flex items-center justify-center p-4">
      <div className="w-full max-w-[742px] min-h-[632px] bg-white rounded-2xl shadow-xl p-4 sm:p-8 text-center">
        <div className="mb-6">
          <Image
            src="/moe.png"
            alt="Ministry of Education Logo"
            width={120}
            height={120}
            className="mx-auto rounded-full"
            priority
          />
        </div>
        
        <h1 className="text-xl sm:text-[30px] font-bold text-[#1F2937] mb-4" style={{ fontFamily: 'Andika, sans-serif' }}>
          Welcome to Liberia eLearn!
        </h1>
        
        <p className="text-sm sm:text-[15px] text-[#4B5563] mb-8 leading-relaxed px-4 sm:pl-[95px] sm:pr-[100px] mt-[21px]" style={{ fontFamily: 'Andika, sans-serif' }}>
          Your gateway to quality education. Access courses, connect with teachers, and unlock your potential with our comprehensive learning platform.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mb-8 justify-center">
          <div className="flex flex-row items-center gap-3">
            <Image
              src="/re1.png"
              alt="Interactive Courses Icon"
              width={19}
              height={24}
              className="w-[19px] h-6"
            />
            <div className="text-center">
              <div className="text-[13px] text-[#374151]" style={{ fontFamily: 'Andika, sans-serif' }}>Interactive Courses</div>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-3">
            <Image
              src="/re2.png"
              alt="Expert Teachers Icon"
              width={19}
              height={24}
              className="w-[19px] h-6"
            />
            <div className="text-center">
              <div className="text-[13px] text-[#374151]" style={{ fontFamily: 'Andika, sans-serif' }}>Expert Teachers</div>
            </div>
          </div>
          
          <div className="flex flex-row items-center gap-3">
            <Image
              src="/re3.png"
              alt="Certified Learning Icon"
              width={19}
              height={24}
              className="w-[19px] h-6"
            />
            <div className="text-center">
              <div className="text-[13px] text-[#374151]" style={{ fontFamily: 'Andika, sans-serif' }}>Certified Learning</div>
            </div>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-8 sm:mt-20">
          <Link href="/profile-setup">
          <button className="w-full max-w-[305px] h-[50px] bg-linear-to-r from-[#1E40AF] to-[#059669] text-white font-semibold px-6 rounded-full flex items-center justify-center gap-3 hover:from-[#1E3A8A] hover:to-[#047857] transition-all duration-200">
            <Icon icon="logos:google-icon" className="w-5 h-5" />
            Continue with Google
          </button>
          </Link>
          
          <Link href="/profile-setup">
            <button className="w-full max-w-[305px] h-[50px] bg-linear-to-r from-[#1E40AF] to-[#059669] text-white font-semibold px-6 rounded-full flex items-center justify-center gap-3 hover:from-[#1E3A8A] hover:to-[#047857] transition-all duration-200">
              <Icon icon="material-symbols:mail" className="w-5 h-5" />
              Continue with Email
            </button>
          </Link>
        </div>

        {/* Login Link */}
        <div className="mt-6">
          <p className="text-base text-gray-600 mb-2" style={{ fontFamily: 'Andika, sans-serif' }}>
            Already have an account?{' '}
            <Link 
              href="/sign-in"
              className="text-lg font-semibold text-blue-600 hover:text-blue-700 underline"
              style={{ fontFamily: 'Andika, sans-serif' }}
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

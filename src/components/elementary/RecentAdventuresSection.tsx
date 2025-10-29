'use client';

import Image from 'next/image';
import Card from '@/components/ui/Card';

interface Adventure {
  title: string;
  subtitle: string;
  icon: string;
  iconSize: { width: number; height: number };
  iconBgColor: string;
  timestamp: string;
}

interface RecentAdventuresSectionProps {
  adventures?: Adventure[];
}

export default function RecentAdventuresSection({
  adventures = [
    {
      title: "Completed 'Counting to 100' lesson",
      subtitle: 'Earned 50 stars',
      icon: '/trophy-yellow.png',
      iconSize: { width: 20, height: 20 },
      iconBgColor: 'bg-yellow-100',
      timestamp: '2 hours ago'
    },
    {
      title: "Played 'Letter Match' game",
      subtitle: 'Perfect score!',
      icon: '/game-controller-green.png',
      iconSize: { width: 20, height: 20 },
      iconBgColor: 'bg-green-100',
      timestamp: 'Yesterday'
    }
  ]
}: RecentAdventuresSectionProps) {
  return (
    <div className="mt-8 mx-8 mb-8">
      <div className="bg-white/60 rounded-lg shadow-md py-6 px-8">
        <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
          Recent Adventures
        </h2>
        <div className="space-y-3">
          {adventures.map((adventure, index) => (
            <Card
              key={index}
              className={`${
                index === 0
                  ? 'bg-gradient-to-r from-[#FEFCE8] to-[#FEF9C3]'
                  : index === 1
                  ? 'bg-gradient-to-r from-[#F0FDF4] to-[#DCFCE7]'
                  : adventure.iconBgColor
              } border-0 shadow-md w-full h-[80px]`}
              padding="md"
            >
              <div className="flex items-center space-x-4 h-full">
                <div className={`w-10 h-10 lg:w-12 lg:h-12 rounded-lg ${adventure.iconBgColor.replace('100', '200')} flex items-center justify-center shrink-0`}>
                  <div className={`${index === 0 ? 'w-12 h-12 rounded-full bg-[#FACC15] flex items-center justify-center' : index === 1 ? 'w-12 h-12 rounded-full bg-[#4ADE80] flex items-center justify-center' : ''}`}>
                    <Image
                      src={index === 0 ? '/trophy.png' : index === 1 ? '/whitep.png' : adventure.icon}
                      alt={adventure.title}
                      width={index === 0 ? 18 : index === 1 ? 20 : adventure.iconSize.width}
                      height={index === 0 ? 24 : index === 1 ? 16 : adventure.iconSize.height}
                      className="object-contain"
                    />
                  </div>
                </div>
                <div className="flex-1">
                  <h3
                    className={`${index === 0 ? 'text-[16px] font-semibold text-[#A16207]' : index === 1 ? 'text-[16px] font-semibold text-[#15803D]' : 'text-base lg:text-lg font-medium text-gray-900'} mb-1`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {adventure.title}
                  </h3>
                  <p
                    className={`${index === 0 ? 'text-[16px] text-[#CA8A04]' : index === 1 ? 'text-[16px] text-[#16A34A]' : 'text-sm lg:text-base text-gray-600'}`}
                    style={{ fontFamily: 'Poppins, sans-serif' }}
                  >
                    {adventure.subtitle} • {adventure.timestamp}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}


'use client';

import Card from '@/components/ui/Card';
import { Icon } from '@iconify/react';

interface TopPerformerProps {
  title: string;
  subtitle: string;
  icon?: string;
}

export default function TopPerformer({ 
  title, 
  subtitle, 
  icon = 'material-symbols:trophy' 
}: TopPerformerProps) {
  return (
    <Card className="bg-gradient-to-r from-[#1E40AF] to-[#059669] text-white w-full lg:w-[280px] h-auto lg:h-[132px] lg:ml-[112px] p-3">
      <div className="text-center h-full flex flex-col justify-center">
        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-2">
          <Icon icon={icon} className="w-6 h-6 text-white" />
        </div>
        <h3 className="text-base font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {title}
        </h3>
        <p className="text-xs opacity-90" style={{ fontFamily: 'Poppins, sans-serif' }}>
          {subtitle}
        </p>
      </div>
    </Card>
  );
}

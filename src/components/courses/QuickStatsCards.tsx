import { Icon } from '@iconify/react';

interface QuickStatsCardsProps {
  stats?: {
    activeCourses: number;
    avgGrade: number;
    studyTime: string;
    badgesEarned: number;
  };
}

export function QuickStatsCards({
  stats = {
    activeCourses: 6,
    avgGrade: 87,
    studyTime: '24h',
    badgesEarned: 12
  }
}: QuickStatsCardsProps) {
  const statsData = [
    {
      icon: 'mdi:file-document-outline',
      value: stats.activeCourses,
      label: 'Active Courses',
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      icon: 'mdi:chart-line',
      value: `${stats.avgGrade}%`,
      label: 'Avg Grade',
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      icon: 'mdi:clock-outline',
      value: stats.studyTime,
      label: 'Study Time',
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      icon: 'mdi:trophy-outline',
      value: stats.badgesEarned,
      label: 'Badges Earned',
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
          <div className={`w-12 h-12 rounded-lg ${stat.bgColor} flex items-center justify-center mb-4`}>
            <Icon icon={stat.icon} className={`w-6 h-6 ${stat.color}`} />
          </div>
          <div className={`text-2xl font-bold ${stat.color} mb-1`} style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stat.value}
          </div>
          <div className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
            {stat.label}
          </div>
        </div>
      ))}
    </div>
  );
}

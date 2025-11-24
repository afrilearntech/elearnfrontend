'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import QuickActions from '@/components/dashboard/QuickActions';
import TopPerformer from '@/components/dashboard/TopPerformer';
import { getDashboard } from '@/lib/api/dashboard';
import { ApiClientError } from '@/lib/api/client';
import { showErrorToast, formatErrorMessage } from '@/lib/toast';
import Spinner from '@/components/ui/Spinner';

export default function Dashboard() {
  const router = useRouter();
  const [dashboardData, setDashboardData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/profile-setup');
        return;
      }

      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Error parsing user data:', e);
        }
      }

      setIsLoading(true);
      try {
        const data = await getDashboard(token);
        setDashboardData(data);
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load dashboard data';
        showErrorToast(formatErrorMessage(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, [router]);

  if (isLoading || !dashboardData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  const quickStats = [
    { icon: 'material-symbols:book', label: 'Courses', value: dashboardData.quick_stats?.total_courses?.toString() || '0', color: 'bg-blue-100' },
    { icon: 'material-symbols:check-circle', label: 'Completed', value: dashboardData.quick_stats?.completed_courses?.toString() || '0', color: 'bg-green-100' },
    { icon: 'material-symbols:schedule', label: 'In Progress', value: dashboardData.quick_stats?.in_progress_courses?.toString() || '0', color: 'bg-yellow-100' }
  ];

  const getProgressColor = (index: number) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500'];
    return colors[index % colors.length];
  };

  const getProgressTextColor = (index: number) => {
    const colors = ['text-blue-600', 'text-green-600', 'text-purple-600', 'text-red-600'];
    return colors[index % colors.length];
  };

  const getIconBgColor = (index: number) => {
    const colors = ['#DBEAFE', '#DCFCE7', '#F3E8FF', '#FEE2E2'];
    return colors[index % colors.length];
  };

  const courses = dashboardData.continue_learning && dashboardData.continue_learning.length > 0
    ? dashboardData.continue_learning.map((course: any, index: number) => ({
        title: course.title || 'Untitled Course',
        subtitle: course.subtitle || '',
        progress: course.progress || 0,
        timeLeft: course.time_left || '',
        icon: course.icon || 'material-symbols:book',
        iconColor: course.icon_color || 'bg-blue-100',
        progressColor: course.progress_color || getProgressColor(index)
      }))
    : [];

  const activities = dashboardData.recent_activities && dashboardData.recent_activities.length > 0
    ? dashboardData.recent_activities.map((activity: any) => ({
        id: activity.id || '',
        icon: activity.icon || 'material-symbols:check-circle',
        title: activity.title || '',
        subtitle: activity.subtitle || '',
        timestamp: activity.timestamp || '',
        points: activity.points,
        iconColor: activity.icon_color || 'bg-green-100'
      }))
    : [];

  const upcomingTasks = dashboardData.upcoming && dashboardData.upcoming.length > 0
    ? dashboardData.upcoming.map((task: any) => ({
        id: task.id || '',
        title: task.title || '',
        dueDate: task.due_date || '',
        priority: (task.priority || 'medium') as 'high' | 'medium' | 'low'
      }))
    : [];

  const quickActions = [
    { id: '1', icon: 'material-symbols:book', label: 'Browse Courses' },
    { id: '2', icon: 'material-symbols:chat', label: 'Join Discussion' },
    { id: '3', icon: 'material-symbols:trending-up', label: 'View Progress' },
    { id: '4', icon: 'material-symbols:download', label: 'Download Materials' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        user={{ 
          name: user?.name || 'Student', 
          role: user?.role || 'Student', 
          initials: user?.name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'ST' 
        }}
        notifications={3}
        messages={0}
        activeLink="dashboard"
      />

      {/* Main Content Area */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto space-y-[24px]">
          {/* Top Row Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[33px]">
            {/* Left Column - Quick Stats, Upcoming, and Quick Actions */}
            <div className="space-y-[24px]">
              <StatsCard title="Quick Stats" stats={quickStats} />
              <UpcomingTasks title="Upcoming" tasks={upcomingTasks} />
              <QuickActions title="Quick Actions" actions={quickActions} />
            </div>
            {/* Right Column - Welcome Banner and Three Cards */}
            <div className="lg:col-span-2 space-y-6">
              <WelcomeBanner 
                userName={user?.name?.split(' ')[0] || 'Student'}
                message={`Continue your learning journey. You have ${dashboardData.assignments_due_this_week || 0} assignment${dashboardData.assignments_due_this_week !== 1 ? 's' : ''} due this week.`}
                buttonText="View Assignments"
              />
              
              {/* Three Stats Cards Row - Directly below Welcome Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[286px_24px_286px_24px_286px] gap-4 lg:gap-0">
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                  Overall Progress
                </h3>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Image
                    src="/res4.png"
                    alt="Overall Progress Icon"
                    width={16}
                    height={24}
                    className="w-4 h-6"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                    Completed
                  </span>
                  <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {dashboardData.overall_progress_percent || 0}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: `${dashboardData.overall_progress_percent || 0}%` }}></div>
                </div>
              </div>
            </div>
            <div></div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                  Study Streak
                </h3>
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Image
                    src="/res5.png"
                    alt="Study Streak Icon"
                    width={14}
                    height={24}
                    className="w-[14px] h-6"
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Andika, sans-serif', color: '#F97316' }}>
                  {dashboardData.streaks?.current_study_streak_days || 0}
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                  Days in a row
                </div>
              </div>
            </div>
            <div></div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                  Points Earned
                </h3>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Image
                    src="/res6.png"
                    alt="Points Earned Icon"
                    width={18}
                    height={24}
                    className="w-[18px] h-6"
                  />
                </div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Andika, sans-serif', color: '#059669' }}>
                  {(dashboardData.streaks?.points_this_month || 0).toLocaleString()}
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                  This month
                </div>
              </div>
            </div>
              </div>
              
              {/* Continue Learning Section */}
              <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-[904px] h-auto lg:h-[378px] mt-[32px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                    Continue Learning
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" style={{ fontFamily: 'Andika, sans-serif' }}>
                    View All
                  </button>
                </div>
                
                {/* Course Cards Grid */}
                {courses.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {courses.map((course: any, index: number) => (
                      <div key={index} className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-[415px] h-auto lg:h-[126px] relative">
                    <div className="flex items-start space-x-3">
                          <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: getIconBgColor(index), border: '1px solid #E5E7EB' }}>
                        <Image
                              src={index === 0 ? "/res11.png" : index === 1 ? "/res12.png" : index === 2 ? "/res13.png" : "/res14.png"}
                              alt={`${course.title} Icon`}
                          width={15}
                          height={28}
                          className="w-[15px] h-7"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Andika, sans-serif' }}>
                              {course.title}
                        </h4>
                            {course.subtitle && (
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                                {course.subtitle}
                        </p>
                            )}
                      </div>
                    </div>
                        {course.timeLeft && (
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon icon="material-symbols:schedule" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Andika, sans-serif' }}>
                              {course.timeLeft}
                      </span>
                    </div>
                        )}
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex justify-end mb-0.5">
                            <span className={`text-xs font-medium ${getProgressTextColor(index)}`} style={{ fontFamily: 'Andika, sans-serif' }}>
                              {course.progress}% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                            <div className={`h-1.5 ${getProgressColor(index)} rounded-full`} style={{ width: `${course.progress}%` }}></div>
                    </div>
                  </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                      No courses available. Start learning to see your progress here!
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-[31px]">
              <TopPerformer 
                show={dashboardData.student_ranking?.show || false}
                title={dashboardData.student_ranking?.title}
                subtitle={dashboardData.student_ranking?.subtitle}
                rank={dashboardData.student_ranking?.rank}
                icon="material-symbols:trophy"
              />
            </div>

            {/* Center Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recent Activity */}
              <ActivityFeed title="Recent Activity" activities={activities} />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

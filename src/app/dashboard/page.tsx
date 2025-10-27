'use client';

import Image from 'next/image';
import { Icon } from '@iconify/react';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import WelcomeBanner from '@/components/dashboard/WelcomeBanner';
import StatsCard from '@/components/dashboard/StatsCard';
import ProgressCard from '@/components/dashboard/ProgressCard';
import ActivityFeed from '@/components/dashboard/ActivityFeed';
import UpcomingTasks from '@/components/dashboard/UpcomingTasks';
import QuickActions from '@/components/dashboard/QuickActions';
import TopPerformer from '@/components/dashboard/TopPerformer';

export default function Dashboard() {
  // Sample data - in a real app, this would come from an API
  const quickStats = [
    { icon: 'material-symbols:book', label: 'Courses', value: '8', color: 'bg-blue-100' },
    { icon: 'material-symbols:check-circle', label: 'Completed', value: '24', color: 'bg-green-100' },
    { icon: 'material-symbols:schedule', label: 'In Progress', value: '12', color: 'bg-yellow-100' }
  ];

  const courses = [
    {
      title: 'Mathematics Grade 10',
      subtitle: 'Algebra & Geometry',
      progress: 85,
      timeLeft: '2h 30m left',
      icon: 'material-symbols:calculate',
      iconColor: 'bg-blue-100',
      progressColor: 'bg-blue-500'
    },
    {
      title: 'Chemistry Grade 10',
      subtitle: 'Organic Chemistry',
      progress: 62,
      timeLeft: '4h 15m left',
      icon: 'material-symbols:science',
      iconColor: 'bg-green-100',
      progressColor: 'bg-green-500'
    },
    {
      title: 'English Literature',
      subtitle: 'Modern Literature',
      progress: 91,
      timeLeft: '1h 45m left',
      icon: 'material-symbols:description',
      iconColor: 'bg-purple-100',
      progressColor: 'bg-purple-500'
    },
    {
      title: 'Social Studies',
      subtitle: 'World History',
      progress: 43,
      timeLeft: '3h 20m left',
      icon: 'material-symbols:public',
      iconColor: 'bg-red-100',
      progressColor: 'bg-red-500'
    }
  ];

  const activities = [
    {
      id: '1',
      icon: 'material-symbols:check-circle',
      title: "Completed 'Introduction to Algebra' lesson",
      subtitle: 'Mathematics',
      timestamp: '2 hours ago',
      points: 50,
      iconColor: 'bg-green-100'
    },
    {
      id: '2',
      icon: 'material-symbols:play-circle',
      title: "Started 'Chemical Reactions' video",
      subtitle: 'Chemistry',
      timestamp: '5 hours ago',
      iconColor: 'bg-blue-100'
    },
    {
      id: '3',
      icon: 'material-symbols:star',
      title: "Earned 'Quick Learner' badge",
      subtitle: 'Achievement',
      timestamp: 'Yesterday',
      points: 100,
      iconColor: 'bg-yellow-100'
    },
    {
      id: '4',
      icon: 'material-symbols:description',
      title: "Submitted 'Essay on Modern Literature'",
      subtitle: 'English Literature',
      timestamp: '2 days ago',
      iconColor: 'bg-purple-100'
    }
  ];

  const upcomingTasks = [
    { id: '1', title: 'Math Quiz', dueDate: 'Due in 2 days', priority: 'high' as const },
    { id: '2', title: 'Science Project', dueDate: 'Due in 5 days', priority: 'medium' as const },
    { id: '3', title: 'English Essay', dueDate: 'Due in 1 week', priority: 'low' as const }
  ];

  const quickActions = [
    { id: '1', icon: 'material-symbols:book', label: 'Browse Courses' },
    { id: '2', icon: 'material-symbols:chat', label: 'Join Discussion' },
    { id: '3', icon: 'material-symbols:trending-up', label: 'View Progress' },
    { id: '4', icon: 'material-symbols:download', label: 'Download Materials' }
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar 
        user={{ name: 'Sarah Johnson', role: 'Student', initials: 'SJ' }}
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
                userName="John"
                message="Continue your learning journey. You have 3 assignments due this week."
                buttonText="View Assignments"
              />
              
              {/* Three Stats Cards Row - Directly below Welcome Banner */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[286px_24px_286px_24px_286px] gap-4 lg:gap-0">
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                  <span className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Completed
                  </span>
                  <span className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    72%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="h-2 bg-blue-500 rounded-full" style={{ width: '72%' }}></div>
                </div>
              </div>
            </div>
            <div></div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#F97316' }}>
                  15
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  Days in a row
                </div>
              </div>
            </div>
            <div></div>
            <div className="bg-white rounded-lg shadow-md p-6 h-auto lg:h-[186px]">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
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
                <div className="text-3xl font-bold mb-1" style={{ fontFamily: 'Poppins, sans-serif', color: '#059669' }}>
                  2,450
                </div>
                <div className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                  This month
                </div>
              </div>
            </div>
              </div>
              
              {/* Continue Learning Section */}
              <div className="bg-white rounded-lg shadow-md p-6 w-full lg:w-[904px] h-auto lg:h-[378px] mt-[32px]">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-bold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    Continue Learning
                  </h3>
                  <button className="text-blue-600 hover:text-blue-700 text-sm font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    View All
                  </button>
                </div>
                
                {/* Course Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Mathematics Grade 10 */}
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-[415px] h-auto lg:h-[126px] relative">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DBEAFE', border: '1px solid #E5E7EB' }}>
                        <Image
                          src="/res11.png"
                          alt="Mathematics Icon"
                          width={15}
                          height={28}
                          className="w-[15px] h-7"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Mathematics Grade 10
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Algebra & Geometry
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon icon="material-symbols:schedule" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        2h 30m left
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex justify-end mb-0.5">
                        <span className="text-xs text-blue-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          85% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 bg-blue-500 rounded-full" style={{ width: '85%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Chemistry Grade 10 */}
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-[415px] h-auto lg:h-[126px] relative">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#DCFCE7', border: '1px solid #E5E7EB' }}>
                        <Image
                          src="/res12.png"
                          alt="Chemistry Icon"
                          width={15}
                          height={28}
                          className="w-[15px] h-7"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Chemistry Grade 10
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Organic Chemistry
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon icon="material-symbols:schedule" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        4h 15m left
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex justify-end mb-0.5">
                        <span className="text-xs text-green-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          62% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 bg-green-500 rounded-full" style={{ width: '62%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* English Literature */}
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-[415px] h-auto lg:h-[126px] relative">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#F3E8FF', border: '1px solid #E5E7EB' }}>
                        <Image
                          src="/res13.png"
                          alt="English Literature Icon"
                          width={15}
                          height={28}
                          className="w-[15px] h-7"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          English Literature
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Modern Literature
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon icon="material-symbols:schedule" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        1h 45m left
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex justify-end mb-0.5">
                        <span className="text-xs text-purple-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          91% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 bg-purple-500 rounded-full" style={{ width: '91%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Social Studies */}
                  <div className="bg-white border border-gray-200 rounded-lg px-4 py-3 w-full lg:w-[415px] h-auto lg:h-[126px] relative">
                    <div className="flex items-start space-x-3">
                      <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: '#FEE2E2', border: '1px solid #E5E7EB' }}>
                        <Image
                          src="/res14.png"
                          alt="Social Studies Icon"
                          width={15}
                          height={28}
                          className="w-[15px] h-7"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-base font-semibold text-gray-900" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          Social Studies
                        </h4>
                        <p className="text-sm text-gray-600" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          World History
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 mt-2">
                      <Icon icon="material-symbols:schedule" className="w-3 h-3 text-gray-500" />
                      <span className="text-xs text-gray-500" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        3h 20m left
                      </span>
                    </div>
                    <div className="absolute bottom-3 right-4 left-4">
                      <div className="flex justify-end mb-0.5">
                        <span className="text-xs text-red-600 font-medium" style={{ fontFamily: 'Poppins, sans-serif' }}>
                          43% complete
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div className="h-1.5 bg-red-500 rounded-full" style={{ width: '43%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column */}
            <div className="space-y-[31px]">
              <TopPerformer 
                title="Top Performer" 
                subtitle="Grade 10 Mathematics"
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

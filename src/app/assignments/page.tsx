'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Icon } from '@iconify/react';
import Image from 'next/image';
import ElementaryNavbar from '@/components/elementary/ElementaryNavbar';
import ElementarySidebar from '@/components/elementary/ElementarySidebar';
import { getKidsAssignments, KidsAssignment } from '@/lib/api/dashboard';
import { ApiClientError } from '@/lib/api/client';
import { showErrorToast, formatErrorMessage } from '@/lib/toast';
import Spinner from '@/components/ui/Spinner';

interface AssignmentCard extends KidsAssignment {
  displayStatus: 'pending' | 'due_soon' | 'overdue' | 'submitted';
  daysUntilDue: number;
  bgColor: string;
  borderColor: string;
  iconBg: string;
  icon: string;
  iconColor: string;
  badgeColor: string;
  badgeText: string;
  titleColor: string;
  isSubmitted: boolean;
}

const calculateDaysUntilDue = (dueDateString: string): number => {
  const dueDate = new Date(dueDateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  dueDate.setHours(0, 0, 0, 0);
  const diffTime = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const getStatusConfig = (assignment: KidsAssignment) => {
  const isSubmitted = assignment.status?.toLowerCase() === 'submitted';
  
  if (isSubmitted) {
    return {
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      icon: 'mdi:check-circle-outline',
      iconColor: '#22C55E',
      badgeColor: 'bg-green-100 text-green-700',
      badgeText: 'Submitted',
      titleColor: 'text-green-900',
      displayStatus: 'submitted' as const,
      daysUntilDue: calculateDaysUntilDue(assignment.due_at),
      isSubmitted: true,
    };
  }

  const daysUntilDue = calculateDaysUntilDue(assignment.due_at);
  let displayStatus: 'pending' | 'due_soon' | 'overdue' = 'pending';
  
  if (daysUntilDue < 0) {
    displayStatus = 'overdue';
  } else if (daysUntilDue === 0) {
    displayStatus = 'due_soon';
  } else if (daysUntilDue <= 3) {
    displayStatus = 'due_soon';
  }

  const configs = {
    pending: {
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      icon: 'mdi:clipboard-text-outline',
      iconColor: '#3B82F6',
      badgeColor: 'bg-blue-100 text-blue-700',
      badgeText: 'Not Submitted',
      titleColor: 'text-blue-900',
    },
    due_soon: {
      bgColor: 'bg-orange-50',
      borderColor: 'border-orange-200',
      iconBg: 'bg-orange-100',
      icon: 'mdi:clock-alert-outline',
      iconColor: '#F97316',
      badgeColor: 'bg-orange-100 text-orange-700',
      badgeText: daysUntilDue === 0 ? 'Due Today!' : `Due in ${daysUntilDue} day${daysUntilDue === 1 ? '' : 's'}`,
      titleColor: 'text-orange-900',
    },
    overdue: {
      bgColor: 'bg-red-50',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      icon: 'mdi:alert-circle-outline',
      iconColor: '#EF4444',
      badgeColor: 'bg-red-100 text-red-700',
      badgeText: 'Overdue',
      titleColor: 'text-red-900',
    },
  };

  return { ...configs[displayStatus], displayStatus, daysUntilDue, isSubmitted: false };
};

const getSubjectIcon = (assignmentType: string, title: string): string => {
  const type = assignmentType.toLowerCase();
  const name = title.toLowerCase();
  
  if (type.includes('essay') || name.includes('essay') || name.includes('writing')) {
    return 'mdi:pen';
  } else if (type.includes('math') || name.includes('math') || name.includes('numeracy')) {
    return 'mdi:calculator';
  } else if (type.includes('reading') || name.includes('reading') || name.includes('literacy') || name.includes('english')) {
    return 'mdi:book-open-variant';
  } else if (type.includes('science') || name.includes('science')) {
    return 'mdi:flask-outline';
  } else if (type.includes('art') || name.includes('art') || name.includes('creative')) {
    return 'mdi:palette-outline';
  } else if (type.includes('music') || name.includes('music')) {
    return 'mdi:music-note';
  } else if (type.includes('sport') || name.includes('sport') || name.includes('pe')) {
    return 'mdi:run';
  }
  return 'mdi:book-open-page-variant';
};

const formatDueDate = (dateString: string): string => {
  const date = new Date(dateString);
  const today = new Date();
  const diffTime = date.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays < 0) {
    return `${Math.abs(diffDays)} day${Math.abs(diffDays) === 1 ? '' : 's'} ago`;
  } else if (diffDays === 0) {
    return 'Today';
  } else if (diffDays === 1) {
    return 'Tomorrow';
  } else if (diffDays <= 7) {
    return `In ${diffDays} days`;
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

export default function MyAssignmentsPage() {
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [assignments, setAssignments] = useState<AssignmentCard[]>([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    due_soon: 0,
    overdue: 0,
    submitted: 0,
  });
  const [filter, setFilter] = useState<'all' | 'pending' | 'due_soon' | 'overdue' | 'submitted'>('all');

  useEffect(() => {
    const fetchAssignments = async () => {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        router.push('/login');
        return;
      }

      setIsLoading(true);
      try {
        const data = await getKidsAssignments(token);
        const assignmentsWithStatus = (data.assignments || []).map((assignment) => {
          const config = getStatusConfig(assignment);
          return {
            ...assignment,
            ...config,
          };
        });
        setAssignments(assignmentsWithStatus);
        // Use stats from API response
        if (data.stats) {
          setStats({
            total: data.stats.total || 0,
            pending: data.stats.pending || 0,
            due_soon: data.stats.due_soon || 0,
            overdue: data.stats.overdue || 0,
            submitted: data.stats.submitted || 0,
          });
        }
      } catch (error) {
        const errorMessage = error instanceof ApiClientError
          ? error.message
          : error instanceof Error
          ? error.message
          : 'Failed to load assignments';
        showErrorToast(formatErrorMessage(errorMessage));
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignments();
    

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        fetchAssignments();
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [router]);

  const handleMenuToggle = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const handleMenuClose = () => setIsMobileMenuOpen(false);

  const filteredAssignments = filter === 'all'
    ? assignments
    : filter === 'submitted'
    ? assignments.filter((assignment) => assignment.isSubmitted)
    : assignments.filter((assignment) => !assignment.isSubmitted && assignment.displayStatus === filter);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <ElementaryNavbar onMenuToggle={handleMenuToggle} />

      <div className="flex">
        <ElementarySidebar 
          activeItem="resources" 
          isMobileMenuOpen={isMobileMenuOpen}
          onMobileMenuClose={handleMenuClose} 
        />

        <main className="flex-1 bg-linear-to-br from-[#DBEAFE] via-[#F0FDF4] to-[#CFFAFE] sm:pl-[280px] lg:pl-[320px] overflow-x-hidden">
          <div className="p-4 lg:p-8 max-w-full">
            {/* Title Section */}
            <div className="sm:mx-8 mx-4 mb-6">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-[#9333EA] mb-2 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                My Assignments 📚
              </h1>
              <p className="text-sm sm:text-base lg:text-lg text-gray-600" style={{ fontFamily: 'Andika, sans-serif' }}>
                Complete your homework and earn stars! ⭐
              </p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4 sm:mx-8 mx-4 mb-6">
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-blue-200 min-w-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {stats.total}
                  </p>
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>Total</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-blue-200 min-w-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-blue-600 mb-1 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {stats.pending}
                  </p>
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>Pending</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-orange-200 min-w-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-orange-600 mb-1 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {stats.due_soon}
                  </p>
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>Due Soon</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-red-200 min-w-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-red-600 mb-1 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {stats.overdue}
                  </p>
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>Overdue</p>
                </div>
              </div>
              <div className="bg-white rounded-xl shadow-md p-3 sm:p-4 border-2 border-green-200 col-span-2 sm:col-span-1 min-w-0">
                <div className="text-center">
                  <p className="text-xl sm:text-2xl font-bold text-green-600 mb-1 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                    {stats.submitted}
                  </p>
                  <p className="text-xs text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>Submitted</p>
                </div>
              </div>
            </div>

            {/* Filter Buttons */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 sm:mx-8 mx-4 mb-6">
              <button
                onClick={() => setFilter('all')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
                  filter === 'all'
                    ? 'bg-[#60A5FA] text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:view-list" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">All Assignments</span>
                <span className="sm:hidden">All</span>
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
                  filter === 'pending'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:clipboard-text-outline" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                Pending
              </button>
              <button
                onClick={() => setFilter('due_soon')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
                  filter === 'due_soon'
                    ? 'bg-orange-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:clock-alert-outline" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                <span className="hidden sm:inline">Due Soon</span>
                <span className="sm:hidden">Due</span>
              </button>
              <button
                onClick={() => setFilter('overdue')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
                  filter === 'overdue'
                    ? 'bg-red-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:alert-circle-outline" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                Overdue
              </button>
              <button
                onClick={() => setFilter('submitted')}
                className={`px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-xs sm:text-sm font-medium flex items-center gap-1.5 sm:gap-2 transition-all whitespace-nowrap ${
                  filter === 'submitted'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
                style={{ fontFamily: 'Andika, sans-serif' }}
              >
                <Icon icon="mdi:check-circle-outline" width={16} height={16} className="sm:w-[18px] sm:h-[18px]" />
                Submitted
              </button>
            </div>

            {/* Assignment Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6 sm:mx-8 mx-4">
              {filteredAssignments.length > 0 ? (
                filteredAssignments.map((assignment, index) => {
                  const subjectIcon = getSubjectIcon(assignment.type, assignment.title);
                  
                  return (
                    <Link
                      href={`/assignments/${assignment.id}`}
                      key={assignment.id}
                      className={`bg-white rounded-xl shadow-lg overflow-hidden border-2 ${assignment.borderColor} transition-transform hover:scale-105 hover:shadow-xl w-full max-w-full block cursor-pointer`}
                    >
                      {/* Card Header with Gradient */}
                      <div className={`${assignment.bgColor} p-4 sm:p-5 border-b-2 ${assignment.borderColor}`}>
                        <div className="flex items-start justify-between mb-2 sm:mb-3 gap-2">
                          <div className={`w-10 h-10 sm:w-12 sm:h-12 ${assignment.iconBg} rounded-full flex items-center justify-center shrink-0`}>
                            <Icon 
                              icon={subjectIcon} 
                              width={20} 
                              height={20}
                              className="sm:w-6 sm:h-6"
                              style={{ color: assignment.iconColor }} 
                            />
                          </div>
                          <span className={`px-2 sm:px-3 py-1 rounded-full text-[10px] sm:text-xs font-semibold ${assignment.badgeColor} truncate max-w-[60%] sm:max-w-none`} style={{ fontFamily: 'Andika, sans-serif' }}>
                            {assignment.badgeText}
                          </span>
                        </div>
                        <h3 className={`text-base sm:text-lg font-bold ${assignment.titleColor} mb-2 truncate`} style={{ fontFamily: 'Andika, sans-serif' }}>
                          {assignment.title}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 truncate capitalize" style={{ fontFamily: 'Andika, sans-serif' }}>
                          {assignment.type}
                        </p>
                      </div>

                      {/* Card Body */}
                      <div className="p-4 sm:p-5">
                        <div className="flex items-center justify-between mb-3 sm:mb-4">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon icon="mdi:calendar-clock" width={16} height={16} className="sm:w-[18px] sm:h-[18px] text-gray-500 shrink-0" />
                            <span className="text-xs sm:text-sm text-gray-600 truncate" style={{ fontFamily: 'Andika, sans-serif' }}>
                              {formatDueDate(assignment.due_at)}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-2">
                          <div className="flex items-center gap-2 min-w-0">
                            <Icon icon="mdi:book-open-page-variant" width={14} height={14} className="sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                            <span className="text-[10px] sm:text-xs text-gray-500 truncate capitalize" style={{ fontFamily: 'Andika, sans-serif' }}>
                              {assignment.type}
                            </span>
                          </div>
                          <div
                            className={`px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0 flex items-center gap-1 ${
                              assignment.isSubmitted
                                ? 'bg-green-100 text-green-700'
                                : assignment.status === 'overdue'
                                ? 'bg-red-100 text-red-700'
                                : assignment.status === 'due_soon'
                                ? 'bg-orange-100 text-orange-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                            style={{ fontFamily: 'Andika, sans-serif' }}
                          >
                            {assignment.isSubmitted ? (
                              <>
                                <Icon icon="mdi:check-circle" width={16} height={16} />
                                <span>View</span>
                              </>
                            ) : (
                              <>
                                <Icon icon="mdi:play-circle" width={16} height={16} />
                                <span>Start</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-8 sm:py-12">
                  <div className="bg-white rounded-xl shadow-md p-6 sm:p-8 max-w-md mx-auto">
                    <Icon icon="mdi:clipboard-check-outline" width={48} height={48} className="sm:w-16 sm:h-16 mx-auto text-gray-300 mb-4" />
                    <p className="text-base sm:text-lg font-semibold text-gray-700 mb-2 px-4" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {filter === 'all' ? 'No Assignments Yet! 🎉' : `No ${filter === 'due_soon' ? 'due soon' : filter === 'submitted' ? 'submitted' : filter.replace('_', ' ')} assignments`}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 px-4" style={{ fontFamily: 'Andika, sans-serif' }}>
                      {filter === 'all' 
                        ? "Great job! You're all caught up. Check back later for new assignments!" 
                        : filter === 'submitted'
                        ? "You haven't submitted any assignments yet. Start working on them!"
                        : 'Try selecting a different filter to see more assignments.'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}


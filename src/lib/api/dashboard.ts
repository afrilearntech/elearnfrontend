import { apiRequest } from './client';

export interface QuickStats {
  total_courses: number;
  completed_courses: number;
  in_progress_courses: number;
}

export interface Streaks {
  current_study_streak_days: number;
  points_this_month: number;
}

export interface UpcomingItem {
  id: string;
  title: string;
  due_date: string;
  priority?: 'high' | 'medium' | 'low';
}

export interface ContinueLearningItem {
  id: string;
  title: string;
  subtitle?: string;
  progress?: number;
  time_left?: string;
  icon?: string;
  icon_color?: string;
  progress_color?: string;
}

export interface RecentActivity {
  id: string;
  title: string;
  subtitle?: string;
  timestamp: string;
  points?: number;
  icon?: string;
  icon_color?: string;
}

export interface StudentRanking {
  show: boolean;
  type?: string;
  title?: string;
  subtitle?: string;
  rank?: number;
}

export interface DashboardResponse {
  assignments_due_this_week: number;
  quick_stats: QuickStats;
  overall_progress_percent: number;
  student_ranking: StudentRanking;
  upcoming: UpcomingItem[];
  streaks: Streaks;
  continue_learning: ContinueLearningItem[];
  recent_activities: RecentActivity[];
}

export async function getDashboard(token: string): Promise<DashboardResponse> {
  return apiRequest<DashboardResponse>('/api-v1/dashboard/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}


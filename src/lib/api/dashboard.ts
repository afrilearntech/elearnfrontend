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
  return apiRequest<DashboardResponse>('/dashboard/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export interface ElementaryTodayChallenge {
  name: string;
  icon: string;
}

export interface ElementaryRecentActivity {
  type: string;
  description: string;
  created_at: string;
  metadata: {
    role?: string;
    [key: string]: any;
  };
}

export interface ElementaryContinueLearningItem {
  id?: number;
  name?: string;
  subject?: string;
  [key: string]: any;
}

export interface ElementaryDashboardResponse {
  lessons_completed: number;
  streaks_this_week: number;
  current_level: string;
  points_earned: number;
  todays_challenges: ElementaryTodayChallenge[];
  continue_learning: ElementaryContinueLearningItem[];
  recent_activities: ElementaryRecentActivity[];
}

export async function getElementaryDashboard(token: string): Promise<ElementaryDashboardResponse> {
  return apiRequest<ElementaryDashboardResponse>('/kids/dashboard/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export interface ElementarySubject {
  id: number;
  name: string;
  grade: string;
  thumbnail: string | null;
}

export interface ElementaryLesson {
  id: number;
  title: string;
  subject_id: number;
  subject_name: string;
  resource_type?: string;
  thumbnail: string | null;
  resource?: string | null;
}

export interface ElementarySubjectsAndLessonsResponse {
  subjects: ElementarySubject[];
  lessons: ElementaryLesson[];
}

export async function getElementarySubjectsAndLessons(token: string): Promise<ElementarySubjectsAndLessonsResponse> {
  return apiRequest<ElementarySubjectsAndLessonsResponse>('/kids/subjectsandlessons/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export interface KidsAssignment {
  id: number;
  title: string;
  type: string;
  due_at: string;
  status: string;
  instructions: string;
}

export interface KidsAssignmentsStats {
  total: number;
  pending: number;
  due_soon: number;
  overdue: number;
  submitted: number;
}

export interface KidsAssignmentsResponse {
  assignments: KidsAssignment[];
  stats: KidsAssignmentsStats;
}

export async function getKidsAssignments(token: string): Promise<KidsAssignmentsResponse> {
  return apiRequest<KidsAssignmentsResponse>('/kids/assignments/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export interface ProgressGardenSubject {
  id: number;
  name: string;
  thumbnail: string;
  percent_complete: number;
}

export interface ProgressGardenResponse {
  lessons_completed: number;
  longest_streak: number;
  level: string;
  points: number;
  subjects: ProgressGardenSubject[];
  rank_in_school: number | null;
  rank_in_district: number | null;
  rank_in_county: number | null;
}

export async function getProgressGarden(token: string): Promise<ProgressGardenResponse> {
  return apiRequest<ProgressGardenResponse>('/kids/progressgarden/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}


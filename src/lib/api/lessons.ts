import { apiRequest } from './client';

export interface LessonDetail {
  id: number;
  subject: number;
  topic: number;
  period: number;
  title: string;
  description: string;
  type: string;
  status: string;
  resource: string | null;
  created_by: number;
  duration_minutes: number;
  created_at: string;
  updated_at: string;
}

export async function getLessonById(id: number | string, token: string): Promise<LessonDetail> {
  return apiRequest<LessonDetail>(`/lessons/${id}/`, {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}


import { apiRequest } from './client';

export interface ProfileSetupRequest {
  email: string;
  phone: string;
  name: string;
  password: string;
  confirm_password: string;
}

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string;
  role: string;
}

export interface ProfileSetupResponse {
  token: string;
  user: User;
}

export async function profileSetup(
  data: ProfileSetupRequest
): Promise<ProfileSetupResponse> {
  return apiRequest<ProfileSetupResponse>('/api-v1/onboarding/profilesetup/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface UserRoleRequest {
  role: string;
}

export interface UserRoleResponse {
  role: string;
}

export async function setUserRole(
  data: UserRoleRequest,
  token: string
): Promise<UserRoleResponse> {
  return apiRequest<UserRoleResponse>('/api-v1/onboarding/userrole/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
}

export interface StudentLoginRequest {
  identifier: string;
  password: string;
}

export interface School {
  id: number;
  name: string;
  district_id: number;
  district_name: string;
  county_id: number;
  county_name: string;
}

export interface Student {
  id: number;
  grade: string;
  school: School;
}

export interface StudentLoginResponse {
  token: string;
  user: User;
  student: Student;
}

export async function studentLogin(
  data: StudentLoginRequest
): Promise<StudentLoginResponse> {
  return apiRequest<StudentLoginResponse>('/api-v1/auth/student/', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export interface AboutUserRequest {
  dob: string;
  gender: string;
  school_id?: number;
  school_name?: string;
  district_id: number;
  grade: string; 
}

export interface AboutUserResponse {
  message?: string;
  [key: string]: any;
}

export async function aboutUser(
  data: AboutUserRequest,
  token: string
): Promise<AboutUserResponse> {
  return apiRequest<AboutUserResponse>('/api-v1/onboarding/aboutuser/', {
    method: 'POST',
    headers: {
      'Authorization': `Token ${token}`,
    },
    body: JSON.stringify(data),
  });
}


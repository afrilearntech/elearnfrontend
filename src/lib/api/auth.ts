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


import { apiRequest } from './client';

export interface District {
  id: number;
  name: string;
  county_id: number;
  county_name: string;
}

export interface DistrictsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: District[];
}

export interface School {
  id: number;
  name: string;
  district_id: number;
  district_name: string;
  county_id: number;
  county_name: string;
}

export interface SchoolsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: School[];
}

export async function getDistricts(token: string): Promise<DistrictsResponse> {
  return apiRequest<DistrictsResponse>('/api-v1/lookup/districts/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
}

export async function getSchools(token: string, districtId?: number): Promise<SchoolsResponse> {
  const response = await apiRequest<SchoolsResponse>('/api-v1/lookup/schools/', {
    method: 'GET',
    headers: {
      'Authorization': `Token ${token}`,
    },
  });
  
  if (districtId) {
    const filteredResults = response.results.filter(school => school.district_id === districtId);
    return {
      ...response,
      results: filteredResults,
      count: filteredResults.length,
    };
  }
  
  return response;
}


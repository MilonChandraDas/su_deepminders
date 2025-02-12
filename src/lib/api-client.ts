import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export interface CrimeReport {
  id: number;
  title: string;
  description: string;
  districtId: number;
  latitude: number | null;
  longitude: number | null;
  postTime: string;
  crimeTime: string;
  postedById: number;
  district: {
    id: number;
    name: string;
  };
  postedBy: {
    id: number;
    email: string;
    profilePicture: string | null;
  };
  media: Array<{
    id: number;
    url: string;
    type: 'IMAGE' | 'VIDEO';
  }>;
  _count?: {
    comments: number;
    votes: number;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

export const crimeReportsApi = {
  create: (data: Partial<CrimeReport>) =>
    api.post<CrimeReport>('/crime-reports', data),

  list: (params?: { page?: number; limit?: number; districtId?: number }) =>
    api.get<PaginatedResponse<CrimeReport>>('/crime-reports', { params }),

  getById: (id: number) =>
    api.get<CrimeReport>(`/crime-reports/${id}`),

  update: (id: number, data: Partial<CrimeReport>) =>
    api.patch<CrimeReport>(`/crime-reports/${id}`, data),

  delete: (id: number) =>
    api.delete(`/crime-reports/${id}`),
};

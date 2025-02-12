import { CrimeReport } from '@prisma/client';
import axios from 'axios';

export const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/signin';
    }
    return Promise.reject(error);
  }
);

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

type CreateCrimeReportPayload = {
  title: string;
  description: string;
  districtId: string;
  fileId: string;
}

type VotePayload = {
  value: 1 | -1;
}

export const crimeReportsApi = {
  create: (data: CreateCrimeReportPayload) =>
    api.post<CrimeReport>('/crime-reports', data),

  list: (params?: { page?: number; limit?: number; districtId?: number }) =>
    api.get<PaginatedResponse<CrimeReport>>('/crime-reports', { params }),

  getById: (id: number) =>
    api.get<CrimeReport>(`/crime-reports/${id}`),

  update: (id: number, data: Partial<CrimeReport>) =>
    api.patch<CrimeReport>(`/crime-reports/${id}`, data),

  delete: (id: number) =>
    api.delete(`/crime-reports/${id}`),

  vote: (id: number, data: VotePayload) =>
    api.post<{ success: boolean }>(`/crime-reports/${id}/vote`, data),

  removeVote: (id: number) =>
    api.delete(`/crime-reports/${id}/vote`),
};

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { crimeReportsApi, type CrimeReport } from '@/lib/api-client';

export function useCrimeReports(params?: { page?: number; limit?: number; districtId?: number }) {
  return useQuery({
    queryKey: ['crime-reports', params],
    queryFn: () => crimeReportsApi.list(params).then(res => res.data),
  });
}

export function useCrimeReport(id: number) {
  return useQuery({
    queryKey: ['crime-report', id],
    queryFn: () => crimeReportsApi.getById(id).then(res => res.data),
  });
}

export function useCreateCrimeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: Partial<CrimeReport>) =>
      crimeReportsApi.create(data).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crime-reports'] });
    },
  });
}

export function useUpdateCrimeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<CrimeReport> }) =>
      crimeReportsApi.update(id, data).then(res => res.data),
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['crime-reports'] });
      queryClient.invalidateQueries({ queryKey: ['crime-report', data.id] });
    },
  });
}

export function useDeleteCrimeReport() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => crimeReportsApi.delete(id).then(res => res.data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['crime-reports'] });
    },
  });
}

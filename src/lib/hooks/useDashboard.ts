import { useQuery } from '@tanstack/react-query';
import sharedApi from '@/lib/api/shared.api';

export function useStatistik() {
  return useQuery({
    queryKey: ['dashboard', 'statistik'],
    queryFn: async () => {
      const res = await sharedApi.getStatistik();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useDashboardStatistik() {
  return useStatistik();
}

export function useDirektoriVerifikator() {
  return useQuery({
    queryKey: ['direktori-verifikator'],
    queryFn: async () => {
      const res = await sharedApi.getDirektoriVerifikator();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

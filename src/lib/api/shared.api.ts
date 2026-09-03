import apiClient from './client';
import type { ApiResponse, DashboardStatistik, DirektoriProdiGroup } from '@/types';

export const sharedApi = {
  getStatistik: async (): Promise<ApiResponse<DashboardStatistik>> => {
    return (await apiClient.get('/dashboard/statistik')) as unknown as ApiResponse<DashboardStatistik>;
  },

  getDashboardStatistik: async (): Promise<ApiResponse<DashboardStatistik>> => {
    return (await apiClient.get('/dashboard/statistik')) as unknown as ApiResponse<DashboardStatistik>;
  },

  getDirektoriVerifikator: async (): Promise<ApiResponse<DirektoriProdiGroup[]>> => {
    return (await apiClient.get('/direktori-verifikator')) as unknown as ApiResponse<DirektoriProdiGroup[]>;
  },
};

export default sharedApi;

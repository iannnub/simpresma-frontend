import apiClient from './client';
import type { ApiResponse, PaginatedData, Pengajuan } from '@/types';

export interface GetVerifikatorPengajuanParams {
  page?: number;
  status?: string;
}

export interface TolakPengajuanPayload {
  feedback_verifikator: string;
}

export const verifikatorApi = {
  getPengajuanList: async (
    params?: GetVerifikatorPengajuanParams
  ): Promise<ApiResponse<PaginatedData<Pengajuan>>> => {
    return (await apiClient.get('/verifikator/pengajuan', {
      params,
    })) as unknown as ApiResponse<PaginatedData<Pengajuan>>;
  },

  getPengajuanDetail: async (id: number): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.get(`/verifikator/pengajuan/${id}`)) as unknown as ApiResponse<Pengajuan>;
  },

  terimaPengajuan: async (
    id: number,
    data?: { feedback_verifikator?: string }
  ): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.post(`/verifikator/pengajuan/${id}/terima`, data || {})) as unknown as ApiResponse<Pengajuan>;
  },

  tolakPengajuan: async (
    id: number,
    data: TolakPengajuanPayload
  ): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.post(`/verifikator/pengajuan/${id}/tolak`, data)) as unknown as ApiResponse<Pengajuan>;
  },
};

export default verifikatorApi;

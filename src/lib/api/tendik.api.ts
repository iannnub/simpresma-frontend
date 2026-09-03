import apiClient from './client';
import type { ApiResponse, PaginatedData, Pengajuan } from '@/types';
import type { FinalisasiFormData } from '@/lib/schemas/finalisasi.schema';

export interface GetTendikPengajuanParams {
  page?: number;
  status?: string;
}

export const tendikApi = {
  getPengajuanList: async (
    params?: GetTendikPengajuanParams
  ): Promise<ApiResponse<PaginatedData<Pengajuan>>> => {
    return (await apiClient.get('/tendik/pengajuan', {
      params,
    })) as unknown as ApiResponse<PaginatedData<Pengajuan>>;
  },

  getPengajuanDetail: async (id: number): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.get(`/tendik/pengajuan/${id}`)) as unknown as ApiResponse<Pengajuan>;
  },

  finalisasiPengajuan: async (
    id: number,
    data: FinalisasiFormData
  ): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.post(`/tendik/pengajuan/${id}/finalisasi`, data)) as unknown as ApiResponse<Pengajuan>;
  },
};

export default tendikApi;

import apiClient from './client';
import type {
  ApiResponse,
  PaginatedData,
  Pengajuan,
  SubmitPengajuanPayload,
} from '@/types';

export interface GetPengajuanListParams {
  page?: number;
  status?: string;
}

export const mahasiswaApi = {
  getPengajuanList: async (
    params?: GetPengajuanListParams
  ): Promise<ApiResponse<PaginatedData<Pengajuan>>> => {
    return (await apiClient.get('/mahasiswa/pengajuan', {
      params,
    })) as unknown as ApiResponse<PaginatedData<Pengajuan>>;
  },

  getPengajuanDetail: async (id: number): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.get(`/mahasiswa/pengajuan/${id}`)) as unknown as ApiResponse<Pengajuan>;
  },

  submitPengajuan: async (
    data: SubmitPengajuanPayload
  ): Promise<ApiResponse<Pengajuan>> => {
    return (await apiClient.post('/mahasiswa/pengajuan', data)) as unknown as ApiResponse<Pengajuan>;
  },
};

export default mahasiswaApi;

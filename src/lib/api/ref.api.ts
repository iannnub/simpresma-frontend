import apiClient from './client';
import type {
  ApiResponse,
  Prodi,
  TingkatanLomba,
  TahapanLomba,
  BidangLomba,
  MatriksKonversi,
  MataKuliah,
} from '@/types';

export const refApi = {
  getProdi: async (): Promise<ApiResponse<Prodi[]>> => {
    return (await apiClient.get('/ref/prodi')) as unknown as ApiResponse<Prodi[]>;
  },

  getTingkatan: async (): Promise<ApiResponse<TingkatanLomba[]>> => {
    return (await apiClient.get('/ref/tingkatan')) as unknown as ApiResponse<TingkatanLomba[]>;
  },

  getTahapan: async (): Promise<ApiResponse<TahapanLomba[]>> => {
    return (await apiClient.get('/ref/tahapan')) as unknown as ApiResponse<TahapanLomba[]>;
  },

  getBidang: async (): Promise<ApiResponse<BidangLomba[]>> => {
    return (await apiClient.get('/ref/bidang')) as unknown as ApiResponse<BidangLomba[]>;
  },

  getMatriks: async (
    tingkatanId: number,
    tahapanId: number
  ): Promise<ApiResponse<MatriksKonversi | null>> => {
    return (await apiClient.get('/ref/matriks', {
      params: {
        tingkatan_id: tingkatanId,
        tahapan_id: tahapanId,
      },
    })) as unknown as ApiResponse<MatriksKonversi | null>;
  },

  getMataKuliah: async (
    bidangId: number,
    prodiId: number
  ): Promise<ApiResponse<MataKuliah[]>> => {
    return (await apiClient.get('/ref/mata-kuliah', {
      params: {
        bidang_id: bidangId,
        prodi_id: prodiId,
      },
    })) as unknown as ApiResponse<MataKuliah[]>;
  },
};

export default refApi;

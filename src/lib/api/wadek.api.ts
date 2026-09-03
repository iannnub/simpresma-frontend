import apiClient from './client';
import type {
  ApiResponse,
  MatriksItem,
  UpdateMatriksPayload,
  VerifikatorProdiItem,
  AssignVerifikatorPayload,
  BidangMataKuliahItem,
  AddBidangMKPayload,
} from '@/types';

export interface GetBidangMKFilters {
  bidang_id?: number;
  prodi_id?: number;
}

export const wadekApi = {
  // Matriks Konversi
  getMatriksList: async (): Promise<ApiResponse<MatriksItem[]>> => {
    return (await apiClient.get('/wadek/matriks')) as unknown as ApiResponse<MatriksItem[]>;
  },

  updateMatriks: async (
    id: number,
    data: UpdateMatriksPayload
  ): Promise<ApiResponse<MatriksItem>> => {
    return (await apiClient.put(`/wadek/matriks/${id}`, data)) as unknown as ApiResponse<MatriksItem>;
  },

  // Verifikator Prodi
  getVerifikatorList: async (): Promise<ApiResponse<VerifikatorProdiItem[]>> => {
    return (await apiClient.get('/wadek/verifikator')) as unknown as ApiResponse<VerifikatorProdiItem[]>;
  },

  assignVerifikator: async (
    data: AssignVerifikatorPayload
  ): Promise<ApiResponse<VerifikatorProdiItem>> => {
    return (await apiClient.post('/wadek/verifikator', data)) as unknown as ApiResponse<VerifikatorProdiItem>;
  },

  cabutVerifikator: async (id: number): Promise<ApiResponse<any>> => {
    return (await apiClient.delete(`/wadek/verifikator/${id}`)) as unknown as ApiResponse<any>;
  },

  // Mapping Bidang - Mata Kuliah
  getBidangMKList: async (
    filters?: GetBidangMKFilters
  ): Promise<ApiResponse<BidangMataKuliahItem[]>> => {
    return (await apiClient.get('/wadek/bidang-mata-kuliah', {
      params: filters,
    })) as unknown as ApiResponse<BidangMataKuliahItem[]>;
  },

  addBidangMK: async (
    data: AddBidangMKPayload
  ): Promise<ApiResponse<BidangMataKuliahItem>> => {
    return (await apiClient.post('/wadek/bidang-mata-kuliah', data)) as unknown as ApiResponse<BidangMataKuliahItem>;
  },

  deleteBidangMK: async (id: number): Promise<ApiResponse<any>> => {
    return (await apiClient.delete(`/wadek/bidang-mata-kuliah/${id}`)) as unknown as ApiResponse<any>;
  },
};

export default wadekApi;

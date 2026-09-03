import { useQuery } from '@tanstack/react-query';
import refApi from '@/lib/api/ref.api';

export function useProdi() {
  return useQuery({
    queryKey: ['ref', 'prodi'],
    queryFn: async () => {
      const res = await refApi.getProdi();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTingkatan() {
  return useQuery({
    queryKey: ['ref', 'tingkatan'],
    queryFn: async () => {
      const res = await refApi.getTingkatan();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useTahapan() {
  return useQuery({
    queryKey: ['ref', 'tahapan'],
    queryFn: async () => {
      const res = await refApi.getTahapan();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useBidang() {
  return useQuery({
    queryKey: ['ref', 'bidang'],
    queryFn: async () => {
      const res = await refApi.getBidang();
      return res.data;
    },
    staleTime: 10 * 60 * 1000,
  });
}

export function useMatriks(tingkatanId?: number | null, tahapanId?: number | null) {
  return useQuery({
    queryKey: ['ref', 'matriks', tingkatanId, tahapanId],
    queryFn: async () => {
      if (!tingkatanId || !tahapanId) return null;
      const res = await refApi.getMatriks(tingkatanId, tahapanId);
      return res.data;
    },
    enabled: Boolean(tingkatanId && tahapanId),
    staleTime: 5 * 60 * 1000,
  });
}

export function useMataKuliah(bidangId?: number | null, prodiId?: number | null) {
  return useQuery({
    queryKey: ['ref', 'mata-kuliah', bidangId, prodiId],
    queryFn: async () => {
      if (!bidangId || !prodiId) return [];
      const res = await refApi.getMataKuliah(bidangId, prodiId);
      return res.data;
    },
    enabled: Boolean(bidangId && prodiId),
    staleTime: 5 * 60 * 1000,
  });
}

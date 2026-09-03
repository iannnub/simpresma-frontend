import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import mahasiswaApi, { type GetPengajuanListParams } from '@/lib/api/mahasiswa.api';
import verifikatorApi, {
  type GetVerifikatorPengajuanParams,
  type TolakPengajuanPayload,
} from '@/lib/api/verifikator.api';
import tendikApi, { type GetTendikPengajuanParams } from '@/lib/api/tendik.api';
import type { SubmitPengajuanPayload } from '@/types';
import type { FinalisasiFormData } from '@/lib/schemas/finalisasi.schema';

// ==========================================
// Mahasiswa Hooks
// ==========================================

export function usePengajuanList(params?: GetPengajuanListParams) {
  return useQuery({
    queryKey: ['mahasiswa', 'pengajuan', params],
    queryFn: async () => {
      const res = await mahasiswaApi.getPengajuanList(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function usePengajuanDetail(id?: number | null) {
  return useQuery({
    queryKey: ['mahasiswa', 'pengajuan', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('ID pengajuan wajib disertakan');
      const res = await mahasiswaApi.getPengajuanDetail(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 60 * 1000,
  });
}

export function useSubmitPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: SubmitPengajuanPayload) => {
      const res = await mahasiswaApi.submitPengajuan(payload);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'statistik'] });
    },
  });
}

// ==========================================
// Verifikator Hooks
// ==========================================

export function useVerifikatorPengajuanList(params?: GetVerifikatorPengajuanParams) {
  return useQuery({
    queryKey: ['verifikator', 'pengajuan', params],
    queryFn: async () => {
      const res = await verifikatorApi.getPengajuanList(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useVerifikatorPengajuanDetail(id?: number | null) {
  return useQuery({
    queryKey: ['verifikator', 'pengajuan', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('ID pengajuan wajib disertakan');
      const res = await verifikatorApi.getPengajuanDetail(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useTerimaPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (args: number | { id: number; data?: { feedback_verifikator?: string } }) => {
      const id = typeof args === 'number' ? args : args.id;
      const data = typeof args === 'number' ? undefined : args.data;
      const res = await verifikatorApi.terimaPengajuan(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      const id = typeof variables === 'number' ? variables : variables.id;
      queryClient.invalidateQueries({ queryKey: ['verifikator', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['verifikator', 'pengajuan', 'detail', id] });
      queryClient.invalidateQueries({ queryKey: ['tendik', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'statistik'] });
    },
  });
}

export function useTolakPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: TolakPengajuanPayload }) => {
      const res = await verifikatorApi.tolakPengajuan(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['verifikator', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['verifikator', 'pengajuan', 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'statistik'] });
    },
  });
}

// ==========================================
// Tendik Hooks
// ==========================================

export function useTendikPengajuanList(params?: GetTendikPengajuanParams) {
  return useQuery({
    queryKey: ['tendik', 'pengajuan', params],
    queryFn: async () => {
      const res = await tendikApi.getPengajuanList(params);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useTendikPengajuanDetail(id?: number | null) {
  return useQuery({
    queryKey: ['tendik', 'pengajuan', 'detail', id],
    queryFn: async () => {
      if (!id) throw new Error('ID pengajuan wajib disertakan');
      const res = await tendikApi.getPengajuanDetail(id);
      return res.data;
    },
    enabled: Boolean(id),
    staleTime: 30 * 1000,
  });
}

export function useFinalisasiPengajuan() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: FinalisasiFormData }) => {
      const res = await tendikApi.finalisasiPengajuan(id, data);
      return res.data;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['tendik', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['tendik', 'pengajuan', 'detail', variables.id] });
      queryClient.invalidateQueries({ queryKey: ['mahasiswa', 'pengajuan'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'statistik'] });
    },
  });
}

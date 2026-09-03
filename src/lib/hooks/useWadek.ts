import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import wadekApi, { type GetBidangMKFilters } from '@/lib/api/wadek.api';
import type { UpdateMatriksPayload, AssignVerifikatorPayload, AddBidangMKPayload } from '@/types';

// ==========================================
// Matriks Hooks
// ==========================================

export function useMatriksList() {
  return useQuery({
    queryKey: ['wadek', 'matriks'],
    queryFn: async () => {
      const res = await wadekApi.getMatriksList();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useUpdateMatriks() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, data }: { id: number; data: UpdateMatriksPayload }) => {
      const res = await wadekApi.updateMatriks(id, data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wadek', 'matriks'] });
      queryClient.invalidateQueries({ queryKey: ['ref', 'matriks'] });
    },
  });
}

// ==========================================
// Verifikator Prodi Hooks
// ==========================================

export function useVerifikatorList() {
  return useQuery({
    queryKey: ['wadek', 'verifikator'],
    queryFn: async () => {
      const res = await wadekApi.getVerifikatorList();
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useAssignVerifikator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AssignVerifikatorPayload) => {
      const res = await wadekApi.assignVerifikator(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wadek', 'verifikator'] });
      queryClient.invalidateQueries({ queryKey: ['direktori-verifikator'] });
    },
  });
}

export function useCabutVerifikator() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await wadekApi.cabutVerifikator(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wadek', 'verifikator'] });
      queryClient.invalidateQueries({ queryKey: ['direktori-verifikator'] });
    },
  });
}

// ==========================================
// Mapping Bidang - Mata Kuliah Hooks
// ==========================================

export function useBidangMKList(filters?: GetBidangMKFilters) {
  return useQuery({
    queryKey: ['wadek', 'bidang-mata-kuliah', filters],
    queryFn: async () => {
      const res = await wadekApi.getBidangMKList(filters);
      return res.data;
    },
    staleTime: 60 * 1000,
  });
}

export function useAddBidangMK() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: AddBidangMKPayload) => {
      const res = await wadekApi.addBidangMK(data);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wadek', 'bidang-mata-kuliah'] });
      queryClient.invalidateQueries({ queryKey: ['ref', 'mata-kuliah'] });
    },
  });
}

export function useDeleteBidangMK() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: number) => {
      const res = await wadekApi.deleteBidangMK(id);
      return res.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wadek', 'bidang-mata-kuliah'] });
      queryClient.invalidateQueries({ queryKey: ['ref', 'mata-kuliah'] });
    },
  });
}

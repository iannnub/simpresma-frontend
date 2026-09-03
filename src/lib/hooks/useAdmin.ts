import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import adminApi, { type AdminUserFilters, type AssignRolePayload, type RevokeRolePayload } from '@/lib/api/admin.api';

export function useAdminUsers(filters: AdminUserFilters = {}) {
  return useQuery({
    queryKey: ['admin', 'users', filters],
    queryFn: async () => {
      const res: any = await adminApi.getUsers(filters);
      return res.data;
    },
    staleTime: 30 * 1000,
  });
}

export function useAssignRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, payload }: { userId: number; payload: AssignRolePayload }) => {
      const res: any = await adminApi.assignRole(userId, payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'history'] });
    },
  });
}

export function useRevokeRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, roleName, payload }: { userId: number; roleName: string; payload?: RevokeRolePayload }) => {
      const res: any = await adminApi.revokeRole(userId, roleName, payload);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'history'] });
    },
  });
}

export function useAssignVerifikatorProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, prodiId, notes }: { userId: number; prodiId: number; notes?: string }) => {
      const res: any = await adminApi.assignVerifikatorProdi(userId, { prodi_id: prodiId, notes });
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['direktori-verifikator'] });
    },
  });
}

export function useRevokeVerifikatorProdi() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ userId, prodiId }: { userId: number; prodiId: number }) => {
      const res: any = await adminApi.revokeVerifikatorProdi(userId, prodiId);
      return res;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'history'] });
      queryClient.invalidateQueries({ queryKey: ['direktori-verifikator'] });
    },
  });
}

export function useRoleHistory(filters: { user_id?: number; page?: number } = {}) {
  return useQuery({
    queryKey: ['admin', 'history', filters],
    queryFn: async () => {
      const res: any = await adminApi.getRoleHistory(filters);
      return res.data;
    },
    staleTime: 15 * 1000,
  });
}

export function useAvailableRoles() {
  return useQuery({
    queryKey: ['admin', 'available-roles'],
    queryFn: async () => {
      const res: any = await adminApi.getAvailableRoles();
      return res.data;
    },
    staleTime: 5 * 60 * 1000,
  });
}

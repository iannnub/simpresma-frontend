import apiClient from './client';

export interface AdminUserFilters {
  search?: string;
  role?: string;
  prodi_id?: number;
  page?: number;
}

export interface AssignRolePayload {
  role_name: string;
  prodi_id?: number;
  notes?: string;
}

export interface RevokeRolePayload {
  notes?: string;
}

export interface RoleHistoryItem {
  id: number;
  user_id: number;
  action: 'assign' | 'revoke';
  role_name: string;
  changed_by: number | null;
  notes: string | null;
  created_at: string;
  user?: {
    id: number;
    nama: string;
    email: string;
    nim_nip: string | null;
  };
  changed_by_user?: {
    id: number;
    nama: string;
    email: string;
  } | null;
}

export const adminApi = {
  getUsers: (filters: AdminUserFilters = {}) => {
    return apiClient.get('/admin/users', { params: filters });
  },

  assignRole: (userId: number, payload: AssignRolePayload) => {
    return apiClient.post(`/admin/users/${userId}/roles`, payload);
  },

  revokeRole: (userId: number, roleName: string, payload: RevokeRolePayload = {}) => {
    return apiClient.delete(`/admin/users/${userId}/roles/${roleName}`, { data: payload });
  },

  assignVerifikatorProdi: (userId: number, payload: { prodi_id: number; notes?: string }) => {
    return apiClient.post(`/admin/users/${userId}/verifikator-prodi`, payload);
  },

  revokeVerifikatorProdi: (userId: number, prodiId: number) => {
    return apiClient.delete(`/admin/users/${userId}/verifikator-prodi/${prodiId}`);
  },

  getRoleHistory: (filters: { user_id?: number; page?: number } = {}) => {
    return apiClient.get('/admin/role-history', { params: filters });
  },

  getAvailableRoles: () => {
    return apiClient.get('/admin/available-roles');
  },
};

export default adminApi;

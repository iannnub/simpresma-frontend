import { create } from 'zustand';
import type { UserRole } from '@/types';

interface RoleState {
  currentRole: UserRole | null;
  availableRoles: UserRole[];
  setCurrentRole: (role: UserRole) => void;
  setAvailableRoles: (roles: UserRole[]) => void;
}

const getStoredRole = (): UserRole | null => {
  const role = localStorage.getItem('simpresma_role') as UserRole | null;
  if (role && ['mahasiswa', 'verifikator', 'tendik', 'wadek', 'admin', 'dosen'].includes(role)) {
    return role;
  }
  return null;
};

export const useRoleStore = create<RoleState>((set) => ({
  currentRole: getStoredRole(),
  availableRoles: [],

  setCurrentRole: (role) => {
    localStorage.setItem('simpresma_role', role);
    set({ currentRole: role });
  },

  setAvailableRoles: (roles) => {
    set((state) => {
      // If currentRole is not in availableRoles, default to the first available role
      const validRole = roles.includes(state.currentRole as UserRole)
        ? state.currentRole
        : roles[0] || null;

      if (validRole) {
        localStorage.setItem('simpresma_role', validRole);
      } else {
        localStorage.removeItem('simpresma_role');
      }

      return {
        availableRoles: roles,
        currentRole: validRole,
      };
    });
  },
}));

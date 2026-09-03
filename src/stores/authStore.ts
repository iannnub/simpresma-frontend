import { create } from 'zustand';
import type { User } from '@/types';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const getStoredUser = (): User | null => {
  try {
    const raw = localStorage.getItem('simpresma_user');
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const getStoredToken = (): string | null => {
  return localStorage.getItem('simpresma_token');
};

const initialToken = getStoredToken();
const initialUser = getStoredUser();

export const useAuthStore = create<AuthState>((set) => ({
  user: initialUser,
  token: initialToken,
  isAuthenticated: Boolean(initialToken && initialUser),

  login: (user, token) => {
    localStorage.setItem('simpresma_token', token);
    localStorage.setItem('simpresma_user', JSON.stringify(user));
    set({
      user,
      token,
      isAuthenticated: true,
    });
  },

  logout: () => {
    localStorage.removeItem('simpresma_token');
    localStorage.removeItem('simpresma_user');
    localStorage.removeItem('simpresma_role');
    set({
      user: null,
      token: null,
      isAuthenticated: false,
    });
  },

  updateUser: (user) => {
    localStorage.setItem('simpresma_user', JSON.stringify(user));
    set({ user });
  },
}));

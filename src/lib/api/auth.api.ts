import apiClient from './client';
import type { ApiResponse, LoginRequest, LoginResponse, User } from '@/types';

export const authApi = {
  login: async (credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> => {
    return (await apiClient.post('/auth/login', credentials)) as unknown as ApiResponse<LoginResponse>;
  },

  logout: async (): Promise<ApiResponse<null>> => {
    return (await apiClient.post('/auth/logout')) as unknown as ApiResponse<null>;
  },

  me: async (): Promise<ApiResponse<User>> => {
    return (await apiClient.get('/auth/me')) as unknown as ApiResponse<User>;
  },
};

export default authApi;

import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import authApi from '@/lib/api/auth.api';
import type { LoginRequest, UserRole } from '@/types';

export function useAuth() {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, login: setAuth, logout: clearAuth, updateUser } = useAuthStore();
  const { currentRole, availableRoles, setCurrentRole, setAvailableRoles } = useRoleStore();

  const getDefaultRouteForRole = (role: UserRole): string => {
    switch (role) {
      case 'mahasiswa':
        return '/mahasiswa/dashboard';
      case 'verifikator':
        return '/verifikator/dashboard';
      case 'tendik':
        return '/tendik/dashboard';
      case 'wadek':
        return '/wadek/dashboard';
      case 'admin':
        return '/admin/kelola-role';
      default:
        return '/login';
    }
  };

  const login = async (credentials: LoginRequest) => {
    const response = await authApi.login(credentials);
    const { user, token } = response.data;

    setAuth(user, token);
    setAvailableRoles(user.roles);

    // Pick first role or current role
    const activeRole = user.roles[0];
    if (activeRole) {
      setCurrentRole(activeRole);
      navigate(getDefaultRouteForRole(activeRole), { replace: true });
    }

    return response;
  };

  const logout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore network / API errors during logout cleanup
    } finally {
      clearAuth();
      navigate('/login', { replace: true });
    }
  };

  const switchRole = (role: UserRole) => {
    if (availableRoles.includes(role)) {
      setCurrentRole(role);
      navigate(getDefaultRouteForRole(role));
    }
  };

  return {
    user,
    token,
    isAuthenticated,
    currentRole,
    availableRoles,
    login,
    logout,
    switchRole,
    updateUser,
    getDefaultRouteForRole,
  };
}

export default useAuth;

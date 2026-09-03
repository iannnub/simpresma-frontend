import React from 'react';
import { Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { useRoleStore } from '@/stores/roleStore';
import type { UserRole } from '@/types';
import ForbiddenPage from '@/app/ForbiddenPage';

interface RoleRouteProps {
  allowedRoles: UserRole[];
  children?: React.ReactNode;
}

export const RoleRoute: React.FC<RoleRouteProps> = ({ allowedRoles, children }) => {
  const { user } = useAuthStore();
  const { currentRole } = useRoleStore();

  // Check if current active role matches or if user has the role
  const isAllowed =
    (currentRole && allowedRoles.includes(currentRole)) ||
    (user && user.roles.some((role) => allowedRoles.includes(role)));

  if (!isAllowed) {
    return <ForbiddenPage />;
  }

  return children ? <>{children}</> : <Outlet />;
};

export default RoleRoute;

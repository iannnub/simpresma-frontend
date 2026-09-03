import React from 'react';
import { Check, ChevronsUpDown, Shield } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/lib/hooks/useAuth';
import type { UserRole } from '@/types';

const ROLE_LABELS: Record<UserRole, string> = {
  admin: 'Super Admin',
  wadek: 'Wakil Dekan',
  tendik: 'Staff Tendik',
  verifikator: 'Dosen Verifikator',
  dosen: 'Dosen',
  mahasiswa: 'Mahasiswa',
};

export const RoleSwitcher: React.FC = () => {
  const { currentRole, availableRoles, switchRole } = useAuth();

  if (!currentRole || availableRoles.length <= 1) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-slate-600 bg-slate-100 rounded-lg">
        <Shield className="w-3.5 h-3.5 text-primary" />
        <span className="capitalize">{ROLE_LABELS[currentRole as UserRole] || currentRole}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between h-9 px-3 text-xs bg-slate-50 border-slate-200 hover:bg-slate-100 text-slate-800"
        >
          <div className="flex items-center gap-2 truncate">
            <Shield className="w-3.5 h-3.5 text-primary shrink-0" />
            <span className="font-semibold truncate">
              {ROLE_LABELS[currentRole] || currentRole}
            </span>
          </div>
          <ChevronsUpDown className="w-3.5 h-3.5 ml-1.5 opacity-50 shrink-0" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-56">
        <DropdownMenuLabel className="text-xs font-normal text-muted-foreground flex items-center justify-between">
          <span>Ganti Peran Aktif</span>
          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
            Multi-Role
          </Badge>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        {availableRoles.map((role) => {
          const isSelected = role === currentRole;
          return (
            <DropdownMenuItem
              key={role}
              onClick={() => switchRole(role)}
              className="flex items-center justify-between text-xs py-2 cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <span className={isSelected ? 'font-semibold text-primary' : ''}>
                  {ROLE_LABELS[role] || role}
                </span>
              </div>
              {isSelected && <Check className="w-3.5 h-3.5 text-primary" />}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default RoleSwitcher;

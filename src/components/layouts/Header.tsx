import React from 'react';
import { useLocation } from 'react-router-dom';
import { Menu, User as UserIcon, LogOut, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import ThemeToggle from '@/components/shared/ThemeToggle';
import { useAuth } from '@/lib/hooks/useAuth';
import { useUiStore } from '@/stores/uiStore';

// Map path to friendly page title
const getPageTitle = (pathname: string): string => {
  if (pathname.includes('/dashboard')) return 'Dashboard';
  if (pathname.includes('/pengajuan/new')) return 'Ajukan Prestasi';
  if (pathname.includes('/pengajuan/')) return 'Detail Pengajuan';
  if (pathname.includes('/pengajuan')) return 'Daftar Pengajuan';
  if (pathname.includes('/matriks')) return 'Matriks Konversi';
  if (pathname.includes('/verifikator')) return 'Tim Verifikator';
  if (pathname.includes('/bidang-mk')) return 'Pemetaan Bidang MK';
  if (pathname.includes('/direktori-verifikator')) return 'Direktori Verifikator';
  return 'SIMPRESMA';
};

export const Header: React.FC = () => {
  const location = useLocation();
  const { user, currentRole, logout } = useAuth();
  const { toggleMobileSidebar } = useUiStore();

  const title = getPageTitle(location.pathname);

  return (
    <header className="h-16 sticky top-0 z-30 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 sm:px-6 flex items-center justify-between transition-colors duration-200">
      {/* Left: Mobile Hamburger & Page Title */}
      <div className="flex items-center gap-3">
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden h-9 w-9 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={toggleMobileSidebar}
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5" />
        </Button>
        <div>
          <h1 className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100 tracking-tight">
            {title}
          </h1>
        </div>
      </div>

      {/* Right: Role, Theme Toggle & User Profile Dropdown */}
      <div className="flex items-center gap-1.5 sm:gap-3">
        {/* Theme Switcher Toggle */}
        <ThemeToggle />

        {/* Active Role Tag */}
        {currentRole && (
          <Badge
            variant="outline"
            className="hidden sm:inline-flex items-center gap-1 text-xs capitalize py-1 px-2.5 bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
          >
            <Shield className="w-3 h-3 text-primary" />
            <span>{currentRole}</span>
          </Badge>
        )}

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center gap-2 h-9 px-2 sm:px-3 text-left focus-visible:ring-1 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              <div className="w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-semibold text-xs shrink-0">
                {user?.nama?.charAt(0) || <UserIcon className="w-4 h-4" />}
              </div>
              <div className="hidden md:flex flex-col text-left">
                <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-tight truncate max-w-[120px]">
                  {user?.nama}
                </span>
                <span className="text-[10px] text-muted-foreground truncate">
                  {user?.prodi?.singkatan || currentRole}
                </span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground hidden sm:inline-block" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 dark:bg-slate-900 dark:border-slate-800">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                <p className="text-sm font-semibold leading-none text-slate-900 dark:text-slate-100">{user?.nama}</p>
                <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                {user?.prodi && (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 pt-0.5 font-medium">
                    Prodi: {user.prodi.nama} ({user.prodi.singkatan})
                  </p>
                )}
                {user?.nim_nip && (
                  <p className="text-[11px] text-slate-400 dark:text-slate-500 font-mono">
                    NIM/NIP: {user.nim_nip}
                  </p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator className="dark:border-slate-800" />
            <DropdownMenuItem
              onClick={logout}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer text-xs flex items-center gap-2 py-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar dari Akun</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;

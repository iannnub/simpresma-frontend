import React from 'react';
import { NavLink, useLocation, Link } from 'react-router-dom';
import { Award, LogOut, UserCircle, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import RoleSwitcher from '@/components/shared/RoleSwitcher';
import { NAVIGATION_CONFIG } from '@/config/navigation.config';
import { useAuth } from '@/lib/hooks/useAuth';
import { isRouteActive } from '@/lib/utils/navigation';
import { cn } from '@/lib/utils/cn';

interface SidebarProps {
  className?: string;
  onNavigate?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ className, onNavigate }) => {
  const { user, currentRole, logout } = useAuth();
  const location = useLocation();

  const navItems = currentRole ? NAVIGATION_CONFIG[currentRole] || [] : [];

  return (
    <aside
      className={cn(
        'w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col h-full select-none transition-colors duration-200',
        className
      )}
    >
      {/* App Brand Header */}
      <div className="h-16 px-6 border-b border-slate-200 dark:border-slate-800 flex items-center gap-3 shrink-0">
        <div className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center shadow-sm shrink-0">
          <Award className="w-5 h-5" />
        </div>
        <div className="flex flex-col min-w-0">
          <span className="font-bold text-base tracking-tight text-slate-900 dark:text-slate-100 leading-tight">
            SIMPRESMA
          </span>
          <span className="text-[11px] text-muted-foreground truncate">
            Prestasi & Konversi SKS
          </span>
        </div>
      </div>

      {/* Role Switcher Section */}
      <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <RoleSwitcher />
      </div>

      {/* Navigation List */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Menu navigasi utama">
        <div className="px-3 pb-2 text-[11px] font-semibold text-muted-foreground uppercase tracking-wider">
          Menu Utama
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = isRouteActive(location.pathname, item.href, item.exact);

          return (
            <NavLink
              key={item.href}
              to={item.href}
              onClick={onNavigate}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-sm shadow-primary/20'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )}
            >
              <Icon
                className={cn(
                  'w-4 h-4 shrink-0 transition-colors',
                  isActive ? 'text-primary-foreground' : 'text-slate-400 dark:text-slate-500'
                )}
              />
              <span className="truncate">{item.title}</span>
              {item.badge !== undefined && item.badge !== null && (
                <Badge
                  variant={isActive ? 'secondary' : 'default'}
                  className="ml-auto text-[10px] px-1.5 py-0"
                >
                  {item.badge}
                </Badge>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Info & Logout Footer */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 shrink-0 space-y-3">
        <Link
          to="/profil"
          onClick={onNavigate}
          className="flex items-center gap-3 min-w-0 group rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 px-1 py-1 transition-colors"
        >
          <div className="relative w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-200 flex items-center justify-center font-semibold text-xs shrink-0">
            {user?.nama?.charAt(0) || 'U'}
            {(user as any)?.telegram_connected && (
              <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-sky-500 border-2 border-white dark:border-slate-900 rounded-full flex items-center justify-center">
                <MessageCircle className="w-1.5 h-1.5 text-white" />
              </span>
            )}
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate group-hover:text-primary transition-colors">
              {user?.nama}
            </span>
            <span className="text-[11px] text-muted-foreground truncate">
              {user?.prodi?.singkatan ? `Prodi ${user.prodi.singkatan}` : user?.email}
            </span>
          </div>
          <UserCircle className="w-4 h-4 text-slate-400 group-hover:text-primary transition-colors shrink-0" />
        </Link>

        <Button
          variant="outline"
          size="sm"
          onClick={logout}
          className="w-full justify-center h-8 text-xs text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/30 hover:text-rose-700 dark:hover:text-rose-300 gap-1.5"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>Keluar</span>
        </Button>
      </div>
    </aside>
  );
};

export default Sidebar;

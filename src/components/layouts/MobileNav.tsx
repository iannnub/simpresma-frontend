import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { NAVIGATION_CONFIG } from '@/config/navigation.config';
import { useAuth } from '@/lib/hooks/useAuth';
import { isRouteActive } from '@/lib/utils/navigation';
import { cn } from '@/lib/utils/cn';

export const MobileNav: React.FC = () => {
  const { currentRole } = useAuth();
  const location = useLocation();

  const navItems = currentRole ? NAVIGATION_CONFIG[currentRole] || [] : [];
  // Show up to 4 items in bottom navigation for best mobile ergonomics
  const bottomItems = navItems.slice(0, 4);

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 z-40 flex items-center justify-around px-2 shadow-lg select-none transition-colors duration-200">
      {bottomItems.map((item) => {
        const Icon = item.icon;
        const isActive = isRouteActive(location.pathname, item.href, item.exact);

        return (
          <NavLink
            key={item.href}
            to={item.href}
            className={cn(
              'flex flex-col items-center justify-center flex-1 h-full py-1 text-xs transition-colors',
              isActive
                ? 'text-primary font-semibold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 font-normal'
            )}
          >
            <div
              className={cn(
                'p-1.5 rounded-lg transition-transform',
                isActive && 'scale-110 bg-primary/10 dark:bg-primary/20'
              )}
            >
              <Icon className="w-5 h-5" />
            </div>
            <span className="text-[10px] tracking-tight mt-0.5 truncate max-w-[70px]">
              {item.title}
            </span>
          </NavLink>
        );
      })}
    </nav>
  );
};

export default MobileNav;

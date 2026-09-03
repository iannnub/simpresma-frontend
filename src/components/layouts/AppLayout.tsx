import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import MobileNav from './MobileNav';
import { useUiStore } from '@/stores/uiStore';
import { cn } from '@/lib/utils/cn';

export const AppLayout: React.FC = () => {
  const { isMobileSidebarOpen, closeMobileSidebar } = useUiStore();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex transition-colors duration-200">
      {/* Desktop Persistent Sidebar (≥1024px) */}
      <div className="hidden lg:block shrink-0">
        <Sidebar className="fixed inset-y-0 left-0 z-30" />
      </div>

      {/* Mobile Slide-Over Drawer (<1024px) */}
      <div
        className={cn(
          'lg:hidden fixed inset-0 z-50 transition-opacity duration-300',
          isMobileSidebarOpen
            ? 'opacity-100 pointer-events-auto'
            : 'opacity-0 pointer-events-none'
        )}
      >
        {/* Backdrop */}
        <div
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
          onClick={closeMobileSidebar}
        />

        {/* Drawer Content */}
        <div
          className={cn(
            'fixed inset-y-0 left-0 w-72 max-w-[85vw] bg-white dark:bg-slate-900 shadow-2xl transition-transform duration-300 ease-in-out transform',
            isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <Sidebar className="w-full h-full border-r-0" onNavigate={closeMobileSidebar} />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 lg:pl-64">
        {/* Top Sticky Header */}
        <Header />

        {/* Page Body: pb-20 on mobile to avoid MobileNav overlap, pb-8 on desktop */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 pb-20 lg:pb-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>

        {/* Mobile Bottom Navigation (<1024px) */}
        <MobileNav />
      </div>
    </div>
  );
};

export default AppLayout;

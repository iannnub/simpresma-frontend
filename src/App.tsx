import React from 'react';
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'sonner';
import router from './router';
import ErrorBoundary from '@/components/shared/ErrorBoundary';
import { ThemeProvider } from '@/lib/hooks/useTheme';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

export default function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} future={{ v7_startTransition: true }} />
          <Toaster position="top-right" richColors closeButton />
        </QueryClientProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

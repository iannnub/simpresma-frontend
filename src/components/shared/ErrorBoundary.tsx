import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Sanitized runtime logging - prevents exposing sensitive stack trace to user console
  }

  public handleRefresh = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50">
          <div className="max-w-md w-full p-8 bg-white rounded-2xl border border-slate-200 shadow-xl text-center space-y-4">
            <div className="w-14 h-14 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-xl font-bold text-slate-900">Oops! Terjadi Kesalahan</h2>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Aplikasi mengalami kendala teknis saat memproses antarmuka. Silakan muat ulang halaman
              untuk melanjutkan.
            </p>
            {this.state.error?.message && (
              <div className="p-3 bg-slate-100 rounded-lg text-[11px] font-mono text-slate-700 text-left overflow-x-auto max-h-24">
                {this.state.error.message}
              </div>
            )}
            <div className="pt-2">
              <Button onClick={this.handleRefresh} className="w-full gap-2 text-xs">
                <RefreshCw className="w-4 h-4" /> Muat Ulang Halaman
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Download, FileSpreadsheet, FileText, Loader2, ChevronDown } from 'lucide-react';
import { useAuthStore } from '@/stores/authStore';
import { toast } from 'sonner';
import { cn } from '@/lib/utils/cn';

interface ExportButtonProps {
  /** Base endpoint path relative to /api, e.g. "wadek/export" or "tendik/export" */
  endpoint: string;
  /** Optional extra query params to append (prodi, status, start, end) */
  filters?: {
    prodi?: string;
    status?: string;
    start?: string;
    end?: string;
  };
  /** Custom button label prefix */
  label?: string;
  /** Custom additional classNames */
  className?: string;
}

type ExportFormat = 'xlsx' | 'csv';

export const ExportButton: React.FC<ExportButtonProps> = ({
  endpoint,
  filters = {},
  label = 'Ekspor Laporan',
  className,
}) => {
  const [loadingFormat, setLoadingFormat] = useState<ExportFormat | null>(null);
  const { token } = useAuthStore();

  const handleExport = async (format: ExportFormat) => {
    if (loadingFormat) return;
    setLoadingFormat(format);

    try {
      const apiBase = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000/api';

      // Build query string
      const params = new URLSearchParams({ format });
      if (filters.prodi) params.set('prodi', filters.prodi);
      if (filters.status) params.set('status', filters.status);
      if (filters.start) params.set('start', filters.start);
      if (filters.end) params.set('end', filters.end);

      const url = `${apiBase}/${endpoint}?${params.toString()}`;

      const res = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: format === 'xlsx'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'text/csv',
        },
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message ?? `Server error ${res.status}`);
      }

      // Extract filename from Content-Disposition header
      const disposition = res.headers.get('Content-Disposition') ?? '';
      const match = disposition.match(/filename[^;=\n]*=["']?([^"';\n]+)/);
      const filename = match?.[1] ?? `laporan-prestasi.${format}`;

      // Trigger browser download
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = filename;
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
      URL.revokeObjectURL(blobUrl);

      toast.success(`File ${format.toUpperCase()} berhasil diunduh`, {
        description: filename,
      });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Gagal mengunduh file';
      toast.error('Ekspor Gagal', { description: message });
    } finally {
      setLoadingFormat(null);
    }
  };

  const isLoading = loadingFormat !== null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "gap-2 font-medium shadow-sm transition-all",
            "bg-white text-slate-800 border-slate-200 hover:bg-slate-50 hover:text-emerald-700 hover:border-emerald-300",
            "dark:bg-slate-900 dark:text-slate-100 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:text-emerald-400",
            className
          )}
          disabled={isLoading}
        >
          {isLoading ? (
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Download className="w-4 h-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
          )}
          <span className="hidden sm:inline font-semibold">{isLoading ? 'Mengunduh...' : label}</span>
          <span className="sm:hidden font-semibold">{isLoading ? '...' : 'Ekspor'}</span>
          {!isLoading && <ChevronDown className="w-3.5 h-3.5 opacity-60 shrink-0" />}
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-52 dark:bg-slate-900 dark:border-slate-700">
        <DropdownMenuLabel className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Pilih Format
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="dark:bg-slate-700" />

        <DropdownMenuItem
          id="export-xlsx-btn"
          onClick={() => handleExport('xlsx')}
          disabled={isLoading}
          className="gap-3 cursor-pointer focus:bg-emerald-50 dark:focus:bg-emerald-900/20"
        >
          <div className="p-1.5 rounded-md bg-emerald-100 dark:bg-emerald-900/30">
            <FileSpreadsheet className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          </div>
          <div>
            <p className="text-sm font-medium">Microsoft Excel</p>
            <p className="text-xs text-muted-foreground">.xlsx - untuk presentasi</p>
          </div>
          {loadingFormat === 'xlsx' && <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-emerald-500" />}
        </DropdownMenuItem>

        <DropdownMenuItem
          id="export-csv-btn"
          onClick={() => handleExport('csv')}
          disabled={isLoading}
          className="gap-3 cursor-pointer focus:bg-blue-50 dark:focus:bg-blue-900/20"
        >
          <div className="p-1.5 rounded-md bg-blue-100 dark:bg-blue-900/30">
            <FileText className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <p className="text-sm font-medium">CSV</p>
            <p className="text-xs text-muted-foreground">.csv - untuk analisis data</p>
          </div>
          {loadingFormat === 'csv' && <Loader2 className="w-3.5 h-3.5 ml-auto animate-spin text-blue-500" />}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ExportButton;

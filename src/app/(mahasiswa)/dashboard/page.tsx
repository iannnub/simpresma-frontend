import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  Clock,
  CheckCircle2,
  Award,
  PlusCircle,
  ArrowRight,
  TrendingUp,
  PieChart as PieChartIcon,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import StatsCard from '@/components/shared/StatsCard';
import PengajuanTable from '@/components/tables/PengajuanTable';
import StatistikChart from '@/components/charts/StatistikChart';
import { useAuth } from '@/lib/hooks/useAuth';
import { usePengajuanList } from '@/lib/hooks/usePengajuan';
import { useDashboardStatistik } from '@/lib/hooks/useDashboard';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Diterima: '#0284c7',
  Ditolak: '#e11d48',
  Selesai: '#10b981',
};

export default function MahasiswaDashboardPage() {
  const { user } = useAuth();
  const { data: pengajuanData, isLoading } = usePengajuanList({ page: 1 });
  const { data: statistikData } = useDashboardStatistik();

  const items = pengajuanData?.items || [];
  const total = pengajuanData?.meta?.total || items.length;

  const countPending = items.filter((i) => i.status === 'pending').length;
  const countDiterima = items.filter((i) => i.status === 'diterima').length;
  const countDitolak = items.filter((i) => i.status === 'ditolak').length;
  const countSelesai = items.filter((i) => i.status === 'selesai').length;

  const chartData = [
    { name: 'Pending', value: countPending },
    { name: 'Diterima', value: countDiterima },
    { name: 'Selesai', value: countSelesai },
    { name: 'Ditolak', value: countDitolak },
  ].filter((d) => d.value > 0);

  const recentItems = items.slice(0, 5);

  const renderCustomSliceLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, value }: any) => {
    if (!value || value === 0) return null;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="#ffffff"
        textAnchor="middle"
        dominantBaseline="central"
        className="text-xs font-bold pointer-events-none drop-shadow-md"
      >
        {value}
      </text>
    );
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-primary to-blue-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-flex items-center mb-1">
            Portal Mahasiswa
          </span>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Selamat Datang, {user?.nama}
          </h2>
          <p className="text-sm text-blue-100 max-w-xl">
            Ajukan prestasi lomba Anda untuk konversi SKS mata kuliah.
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <Button
            asChild
            className="w-full sm:w-auto justify-center bg-white text-primary hover:bg-blue-50 dark:bg-slate-900 dark:text-blue-400 dark:hover:bg-slate-800 font-semibold shadow-sm gap-2 text-xs sm:text-sm h-10 px-4"
          >
            <Link to="/mahasiswa/pengajuan/new" className="flex items-center justify-center">
              <PlusCircle className="w-4 h-4 shrink-0" />
              <span>Ajukan Prestasi Baru</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Pengajuan"
          value={total}
          icon={FileText}
          iconClassName="text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
          description="Semua riwayat pengajuan"
        />
        <StatsCard
          title="Menunggu Verifikasi"
          value={countPending}
          icon={Clock}
          iconClassName="text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
          description="Dalam antrean verifikator"
        />
        <StatsCard
          title="Disetujui"
          value={countDiterima}
          icon={CheckCircle2}
          iconClassName="text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400"
          description="Menunggu SK Tendik"
        />
        <StatsCard
          title="Selesai Konversi"
          value={countSelesai}
          icon={Award}
          iconClassName="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
          description="SK Konversi diterbitkan"
        />
      </div>

      {/* Charts Row: Status Pribadi & Distribusi 3 Prodi Fakultas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart (Personal) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" />
              Distribusi Status Prestasi
            </CardTitle>
            <CardDescription className="text-xs">
              Ringkasan status pengajuan yang telah diajukan
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chartData.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-4">
                <FileText className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Belum ada data pengajuan untuk ditampilkan pada grafik</span>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      label={renderCustomSliceLabel}
                      labelLine={false}
                    >
                      {chartData.map((entry) => (
                        <Cell
                          key={`cell-${entry.name}`}
                          fill={STATUS_COLORS[entry.name] || '#94a3b8'}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--popover, #1e293b)',
                        color: 'var(--popover-foreground, #f8fafc)',
                        borderRadius: '10px',
                        border: '1px solid rgba(148, 163, 184, 0.2)',
                        fontSize: '12px',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      }}
                    />
                    <Legend
                      wrapperStyle={{ fontSize: '11px', paddingTop: '6px' }}
                      layout="horizontal"
                      verticalAlign="bottom"
                      align="center"
                      formatter={(value, entry: any) => (
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {value} ({entry.payload.value})
                        </span>
                      )}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Direct Status Numbers Row (Tanpa Perlu Diklik) */}
            <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              <div className="p-2 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200/60 dark:border-amber-900/40">
                <div className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">Pending</div>
                <div className="text-sm font-bold text-amber-900 dark:text-amber-200">{countPending}</div>
              </div>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
                <div className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">Diterima</div>
                <div className="text-sm font-bold text-sky-900 dark:text-sky-200">{countDiterima}</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Selesai</div>
                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{countSelesai}</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Ditolak</div>
                <div className="text-sm font-bold text-rose-900 dark:text-rose-200">{countDitolak}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3 Prodi Distribution Chart (Fakultas) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" />
              Pengajuan per Program Studi
            </CardTitle>
            <CardDescription className="text-xs">
              Sebaran pengajuan mahasiswa di tiap program studi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatistikChart data={statistikData?.per_prodi || []} height={224} />
          </CardContent>
        </Card>
      </div>

      {/* 5 Pengajuan Terbaru Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Pengajuan Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              5 pengajuan prestasi perlombaan terakhir Anda
            </CardDescription>
          </div>
          {items.length > 5 && (
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 dark:hover:bg-slate-800">
              <Link to="/mahasiswa/pengajuan">
                Lihat Semua ({total}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          <PengajuanTable data={recentItems} isLoading={isLoading} />
        </CardContent>
      </Card>
    </div>
  );
}

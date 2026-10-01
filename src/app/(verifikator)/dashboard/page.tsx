import React from 'react';
import { Link } from 'react-router-dom';
import {
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  ShieldCheck,
  TrendingUp,
  ArrowRight,
  AlertCircle,
  Calendar,
  Award,
} from 'lucide-react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import StatsCard from '@/components/shared/StatsCard';
import StatusBadge from '@/components/shared/StatusBadge';
import { StatistikChart } from '@/components/charts/StatistikChart';
import { useVerifikatorPengajuanList } from '@/lib/hooks/usePengajuan';
import { useDashboardStatistik } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/lib/hooks/useAuth';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Diterima: '#0284c7',
  Ditolak: '#e11d48',
  Selesai: '#10b981',
};

export default function VerifikatorDashboardPage() {
  const { user } = useAuth();
  const { data: pendingData, isLoading: isLoadingPending } = useVerifikatorPengajuanList({ page: 1 });
  const { data: dashboardStats } = useDashboardStatistik();

  const pendingItems = pendingData?.items || [];
  const totalPending = pendingData?.meta?.total ?? pendingItems.length;

  // Aggregate stats across prodis or user scope
  let totalDiterima = 0;
  let totalDitolak = 0;
  let totalSelesai = 0;

  if (dashboardStats?.per_prodi) {
    dashboardStats.per_prodi.forEach((p) => {
      totalDiterima += p.by_status.diterima || 0;
      totalDitolak += p.by_status.ditolak || 0;
      totalSelesai += p.by_status.selesai || 0;
    });
  }

  const chartData = [
    { name: 'Pending', value: totalPending },
    { name: 'Diterima', value: totalDiterima },
    { name: 'Selesai', value: totalSelesai },
    { name: 'Ditolak', value: totalDitolak },
  ].filter((d) => d.value > 0);

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: localeId });
    } catch {
      return dateStr;
    }
  };

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
      <div className="bg-gradient-to-r from-purple-800 to-indigo-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-3.5 h-3.5 text-purple-200" />
            Portal Dosen Verifikator
          </span>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Selamat Datang, {user?.nama}
          </h2>
          <p className="text-sm text-purple-100 max-w-xl">
            Tinjau dan verifikasi keabsahan bukti sertifikat pengajuan prestasi mahasiswa sebelum
            diteruskan ke Bagian Tendik untuk finalisasi SK.
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <Button
            asChild
            className="w-full sm:w-auto justify-center bg-white text-purple-900 hover:bg-purple-50 dark:bg-slate-900 dark:text-purple-300 dark:hover:bg-slate-800 font-semibold shadow-sm gap-2 text-xs sm:text-sm h-10 px-4"
          >
            <Link to="/verifikator/pengajuan" className="flex items-center justify-center">
              <Eye className="w-4 h-4 shrink-0" />
              <span>Buka Antrean Verifikasi ({totalPending})</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Antrean Verifikasi"
          value={totalPending}
          icon={Clock}
          iconClassName="text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
          description="Perlu ditinjau pada prodi Anda"
        />
        <StatsCard
          title="Total Disetujui"
          value={totalDiterima}
          icon={CheckCircle2}
          iconClassName="text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400"
          description="Pengajuan lolos verifikasi"
        />
        <StatsCard
          title="Total Ditolak"
          value={totalDitolak}
          icon={XCircle}
          iconClassName="text-rose-600 bg-rose-50 dark:bg-rose-950/40 dark:text-rose-400"
          description="Pengajuan perlu revisi / ditolak"
        />
      </div>

      {/* Charts Grid: Status & 3-Prodi Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-purple-600" />
              Distribusi Status Prestasi
            </CardTitle>
            <CardDescription className="text-xs">
              Komparasi status pengajuan lintas prodi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chartData.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-4">
                <ShieldCheck className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Belum ada data pengajuan dalam sistem</span>
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
                <div className="text-sm font-bold text-amber-900 dark:text-amber-200">{totalPending}</div>
              </div>
              <div className="p-2 rounded-xl bg-sky-50 dark:bg-sky-950/30 border border-sky-200/60 dark:border-sky-900/40">
                <div className="text-[11px] text-sky-700 dark:text-sky-400 font-medium">Diterima</div>
                <div className="text-sm font-bold text-sky-900 dark:text-sky-200">{totalDiterima}</div>
              </div>
              <div className="p-2 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200/60 dark:border-emerald-900/40">
                <div className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">Selesai</div>
                <div className="text-sm font-bold text-emerald-900 dark:text-emerald-200">{totalSelesai}</div>
              </div>
              <div className="p-2 rounded-xl bg-rose-50 dark:bg-rose-950/30 border border-rose-200/60 dark:border-rose-900/40">
                <div className="text-[11px] text-rose-700 dark:text-rose-400 font-medium">Ditolak</div>
                <div className="text-sm font-bold text-rose-900 dark:text-rose-200">{totalDitolak}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3 Prodi Distribution Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              Pengajuan per Program Studi
            </CardTitle>
            <CardDescription className="text-xs">
              Distribusi pengajuan berdasarkan program studi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatistikChart data={dashboardStats?.per_prodi || []} height={224} />
          </CardContent>
        </Card>
      </div>

      {/* 10 Pengajuan Pending Terbaru Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Antrean Pengajuan Pending
            </CardTitle>
            <CardDescription className="text-xs">
              Pengajuan prestasi mahasiswa yang menunggu verifikasi Anda
            </CardDescription>
          </div>
          {totalPending > 0 && (
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-purple-700 dark:text-purple-400 dark:hover:bg-slate-800">
              <Link to="/verifikator/pengajuan">
                Lihat Semua ({totalPending}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {isLoadingPending ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Clock className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Memuat antrean verifikasi...</p>
            </div>
          ) : pendingItems.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tidak Ada Antrean Pending</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Saat ini tidak ada pengajuan pending yang menunggu verifikasi pada prodi Anda.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
                <Table>
                  <TableHeader className="bg-slate-50 dark:bg-slate-800/60 text-xs">
                    <TableRow className="border-b border-slate-200 dark:border-slate-800">
                      <TableHead className="text-slate-600 dark:text-slate-400">Mahasiswa</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Kegiatan Lomba</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Tingkat / Tahap</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                      <TableHead className="text-right text-slate-600 dark:text-slate-400">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingItems.slice(0, 5).map((item) => (
                      <TableRow key={item.id} className="border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <TableCell>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                            {item.mahasiswa?.nama || item.user?.nama || 'Mahasiswa'}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {item.mahasiswa?.nim_nip || item.user?.nim_nip || '-'}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-800 dark:text-slate-200 text-xs leading-tight">
                            {item.nama_lomba}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.bidang?.nama}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-xs text-slate-700 dark:text-slate-300">{item.tingkatan?.nama}</div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.tahapan?.nama}
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(item.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="default"
                            asChild
                            className="h-7 text-xs bg-purple-700 hover:bg-purple-800"
                          >
                            <Link to={`/verifikator/pengajuan/${item.id}`}>Verifikasi</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-2.5">
                {pendingItems.slice(0, 5).map((item) => (
                  <div
                    key={item.id}
                    className="p-3.5 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-soft-sm space-y-2 text-xs"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-bold text-slate-900 dark:text-slate-100">
                          {item.mahasiswa?.nama || item.user?.nama}
                        </span>
                        <p className="text-[11px] font-mono text-muted-foreground">
                          {item.mahasiswa?.nim_nip}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{item.nama_lomba}</p>
                    <Button
                      size="sm"
                      asChild
                      className="w-full text-xs h-7 bg-purple-700 hover:bg-purple-800"
                    >
                      <Link to={`/verifikator/pengajuan/${item.id}`}>Tinjau & Verifikasi</Link>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

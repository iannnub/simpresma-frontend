import React from 'react';
import { Link } from 'react-router-dom';
import {
  FileCheck2,
  Clock,
  Award,
  Layers,
  TrendingUp,
  ArrowRight,
  Eye,
  Calendar,
  Building2,
  CheckCircle2,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  LabelList,
} from 'recharts';

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
import { useTendikPengajuanList } from '@/lib/hooks/usePengajuan';
import { useDashboardStatistik } from '@/lib/hooks/useDashboard';
import { useAuth } from '@/lib/hooks/useAuth';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';
import { ExportButton } from '@/components/shared/ExportButton';

export default function TendikDashboardPage() {
  const { user } = useAuth();
  const { data: tendikData, isLoading: isLoadingTendik } = useTendikPengajuanList({ page: 1 });
  const { data: dashboardStats } = useDashboardStatistik();

  const diterimaItems = tendikData?.items || [];
  const totalDiterima = tendikData?.meta?.total ?? diterimaItems.length;

  // Aggregate stats across prodis
  let grandTotal = dashboardStats?.grand_total || 0;
  let totalSelesai = 0;

  if (dashboardStats?.per_prodi) {
    dashboardStats.per_prodi.forEach((p) => {
      totalSelesai += p.by_status.selesai || 0;
    });
  }

  // Chart data: Distribution per prodi
  const chartData = (dashboardStats?.per_prodi || []).map((p) => ({
    name: p.prodi,
    Diterima: p.by_status.diterima || 0,
    Selesai: p.by_status.selesai || 0,
    Pending: p.by_status.pending || 0,
  }));

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMM yyyy', { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-700 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-flex items-center gap-1.5 mb-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-200" />
            Portal Tenaga Kependidikan (Tendik)
          </span>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Selamat Datang, {user?.nama}
          </h2>
          <p className="text-sm text-emerald-100 max-w-xl">
            Proses pengajuan prestasi yang telah disetujui verifikator untuk finalisasi nilai SKS dan
            penerbitan Surat Keputusan (SK) konversi.
          </p>
        </div>
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 w-full sm:w-auto">
          <ExportButton
            endpoint="tendik/export"
            label="Ekspor Laporan"
            className="w-full sm:w-auto justify-center"
          />
          <Button
            asChild
            className="w-full sm:w-auto justify-center bg-white text-emerald-900 hover:bg-emerald-50 dark:bg-slate-900 dark:text-emerald-300 dark:hover:bg-slate-800 font-semibold shadow-sm gap-2 text-xs sm:text-sm h-10 px-4"
          >
            <Link to="/tendik/pengajuan" className="flex items-center justify-center">
              <Eye className="w-4 h-4 shrink-0" />
              <span>Buka Pengajuan Diterima ({totalDiterima})</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Menunggu Finalisasi SK"
          value={totalDiterima}
          icon={Clock}
          iconClassName="text-sky-600 bg-sky-50 dark:bg-sky-950/40 dark:text-sky-400"
          description="Status Diterima oleh Verifikator"
        />
        <StatsCard
          title="Total SK Selesai"
          value={totalSelesai}
          icon={Award}
          iconClassName="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
          description="Nilai & SK telah difinalisasi"
        />
        <StatsCard
          title="Total Seluruh Pengajuan"
          value={grandTotal}
          icon={Layers}
          iconClassName="text-purple-600 bg-purple-50 dark:bg-purple-950/40 dark:text-purple-400"
          description="Akumulasi semua prodi fakultas"
        />
      </div>

      {/* Charts Grid: Bar Chart & Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Status Distribution Bar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              Status Prestasi per Prodi
            </CardTitle>
            <CardDescription className="text-xs">
              Distribusi jumlah pengajuan pada tiap Program Studi
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {chartData.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-4">
                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Belum ada data pengajuan prodi yang tercatat</span>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 11 }} />
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
                    <Legend wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }} />
                    <Bar dataKey="Diterima" fill="#0284c7" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="Diterima" position="top" className="text-[10px] font-bold fill-sky-700 dark:fill-sky-300" />
                    </Bar>
                    <Bar dataKey="Selesai" fill="#10b981" radius={[4, 4, 0, 0]}>
                      <LabelList dataKey="Selesai" position="top" className="text-[10px] font-bold fill-emerald-700 dark:fill-emerald-300" />
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}

            {/* Direct Numbers Grid per Prodi */}
            <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-center">
              {chartData.map((d) => (
                <div
                  key={d.name}
                  className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center text-xs"
                >
                  <span className="font-semibold text-slate-700 dark:text-slate-300">{d.name}</span>
                  <div className="flex items-center gap-2 mt-0.5 text-[11px]">
                    <span className="text-sky-600 dark:text-sky-400 font-bold">{d.Diterima} Siap</span>
                    <span className="text-slate-300 dark:text-slate-700">•</span>
                    <span className="text-emerald-600 dark:text-emerald-400 font-bold">{d.Selesai} SK</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3 Prodi Distribution Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-emerald-600" />
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

      {/* 10 Pengajuan Diterima Siap Diproses Table Section */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100">
              Pengajuan Siap Diterbitkan SK
            </CardTitle>
            <CardDescription className="text-xs">
              Pengajuan prestasi yang telah disetujui verifikator dan siap difinalisasi
            </CardDescription>
          </div>
          {totalDiterima > 0 && (
            <Button variant="ghost" size="sm" asChild className="text-xs gap-1 text-emerald-700 dark:text-emerald-400 dark:hover:bg-slate-800">
              <Link to="/tendik/pengajuan">
                Lihat Semua ({totalDiterima}) <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          )}
        </CardHeader>
        <CardContent className="pt-4">
          {isLoadingTendik ? (
            <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Clock className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
              <p className="text-xs text-muted-foreground">Memuat data pengajuan...</p>
            </div>
          ) : diterimaItems.length === 0 ? (
            <div className="text-center py-10 px-4 bg-slate-50/50 dark:bg-slate-900/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-2 opacity-80" />
              <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Tidak Ada Pengajuan Menunggu SK</h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Tidak ada pengajuan berstatus diterima yang belum difinalisasi saat ini.
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
                      <TableHead className="text-slate-600 dark:text-slate-400">Nama Lomba</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Prodi</TableHead>
                      <TableHead className="text-slate-600 dark:text-slate-400">Tanggal</TableHead>
                      <TableHead className="text-right text-slate-600 dark:text-slate-400">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {diterimaItems.slice(0, 5).map((item) => (
                      <TableRow key={item.id} className="border-b border-slate-100 dark:border-slate-800/70 hover:bg-slate-50/80 dark:hover:bg-slate-800/40">
                        <TableCell>
                          <div className="font-semibold text-slate-900 dark:text-slate-100 text-xs">
                            {item.mahasiswa?.nama || item.user?.nama}
                          </div>
                          <div className="font-mono text-[11px] text-muted-foreground">
                            {item.mahasiswa?.nim_nip || item.user?.nim_nip}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium text-slate-800 dark:text-slate-200 text-xs leading-tight">
                            {item.nama_lomba}
                          </div>
                          <div className="text-[11px] text-muted-foreground">
                            {item.tingkatan?.nama}
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-bold text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-700 dark:text-slate-300">
                            {item.prodi?.singkatan}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs text-slate-600 dark:text-slate-400 whitespace-nowrap">
                          {formatDate(item.verified_at || item.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            size="sm"
                            variant="default"
                            asChild
                            className="h-7 text-xs bg-emerald-600 hover:bg-emerald-700"
                          >
                            <Link to={`/tendik/pengajuan/${item.id}`}>Proses SK</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-2.5">
                {diterimaItems.slice(0, 5).map((item) => (
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
                          {item.prodi?.singkatan} • NIM: {item.mahasiswa?.nim_nip}
                        </p>
                      </div>
                      <StatusBadge status={item.status} />
                    </div>
                    <p className="text-slate-800 dark:text-slate-200 font-medium">{item.nama_lomba}</p>
                    <Button
                      size="sm"
                      asChild
                      className="w-full text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                    >
                      <Link to={`/tendik/pengajuan/${item.id}`}>Finalisasi Konversi Nilai</Link>
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

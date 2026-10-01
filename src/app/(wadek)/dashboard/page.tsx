import React from 'react';
import { Link } from 'react-router-dom';
import {
  Building2,
  Sliders,
  Users,
  Network,
  ArrowRight,
  TrendingUp,
  Layers,
  CheckCircle2,
  Clock,
  PieChart as PieChartIcon,
} from 'lucide-react';
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  LabelList,
} from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import StatsCard from '@/components/shared/StatsCard';
import { StatistikChart } from '@/components/charts/StatistikChart';
import { useDashboardStatistik } from '@/lib/hooks/useDashboard';
import { useMatriksList, useVerifikatorList } from '@/lib/hooks/useWadek';
import { useAuth } from '@/lib/hooks/useAuth';
import { ExportButton } from '@/components/shared/ExportButton';

const STATUS_COLORS: Record<string, string> = {
  Pending: '#f59e0b',
  Diterima: '#0284c7',
  Ditolak: '#e11d48',
  Selesai: '#10b981',
};

export default function WadekDashboardPage() {
  const { user } = useAuth();
  const { data: statsData } = useDashboardStatistik();
  const { data: matriksList = [] } = useMatriksList();
  const { data: verifikatorList = [] } = useVerifikatorList();

  const grandTotal = statsData?.grand_total || 0;

  // Aggregate stats across all prodis
  let totalPending = 0;
  let totalDiterima = 0;
  let totalSelesai = 0;
  let totalDitolak = 0;

  if (statsData?.per_prodi) {
    statsData.per_prodi.forEach((p) => {
      totalPending += p.by_status.pending || 0;
      totalDiterima += p.by_status.diterima || 0;
      totalSelesai += p.by_status.selesai || 0;
      totalDitolak += p.by_status.ditolak || 0;
    });
  }

  const activeVerifikatorCount = verifikatorList.filter((v: any) => v.is_active).length;

  const pieChartData = [
    { name: 'Pending', value: totalPending },
    { name: 'Diterima', value: totalDiterima },
    { name: 'Selesai', value: totalSelesai },
    { name: 'Ditolak', value: totalDitolak },
  ].filter((d) => d.value > 0);

  const barChartData = (statsData?.per_prodi || []).map((p) => ({
    name: p.prodi,
    Pending: p.by_status.pending || 0,
    Diterima: p.by_status.diterima || 0,
    Selesai: p.by_status.selesai || 0,
  }));

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
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 rounded-2xl p-6 text-white shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-white/20 text-white inline-flex items-center gap-1.5 mb-1">
            <Building2 className="w-3.5 h-3.5 text-blue-200" />
            Portal Wakil Dekan I (Akademik & Kemahasiswaan)
          </span>
          <h2 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            Selamat Datang, {user?.nama}
          </h2>
          <p className="text-sm text-slate-300 max-w-xl">
            Pusat kendali kebijakan konversi prestasi: kelola matriks SKS, penugasan tim dosen
            verifikator, dan pemetaan mata kuliah seluruh program studi.
          </p>
        </div>
        <div className="shrink-0 w-full sm:w-auto">
          <ExportButton
            endpoint="wadek/export"
            label="Ekspor Laporan"
            className="w-full sm:w-auto justify-center"
          />
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Link
          to="/wadek/matriks"
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm hover:shadow-soft-md hover:border-primary transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Kelola Matriks</h4>
              <p className="text-[11px] text-muted-foreground">{matriksList.length} Kombinasi Lomba</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/wadek/verifikator"
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm hover:shadow-soft-md hover:border-primary transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-400 flex items-center justify-center group-hover:bg-purple-700 group-hover:text-white transition-colors">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Tim Verifikator</h4>
              <p className="text-[11px] text-muted-foreground">
                {activeVerifikatorCount} Dosen Ditugaskan
              </p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-700 group-hover:translate-x-0.5 transition-all" />
        </Link>

        <Link
          to="/wadek/bidang-mk"
          className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm hover:shadow-soft-md hover:border-primary transition-all flex items-center justify-between group"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 flex items-center justify-center group-hover:bg-emerald-700 group-hover:text-white transition-colors">
              <Network className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-slate-100">Pemetaan Bidang-MK</h4>
              <p className="text-[11px] text-muted-foreground">Relasi Mata Kuliah</p>
            </div>
          </div>
          <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-700 group-hover:translate-x-0.5 transition-all" />
        </Link>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatsCard
          title="Total Pengajuan Mahasiswa"
          value={grandTotal}
          icon={Layers}
          iconClassName="text-blue-600 bg-blue-50 dark:bg-blue-950/40 dark:text-blue-400"
          description="Seluruh Program Studi"
        />
        <StatsCard
          title="Konversi Berhasil (SK)"
          value={totalSelesai}
          icon={CheckCircle2}
          iconClassName="text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 dark:text-emerald-400"
          description="SK Konversi diterbitkan"
        />
        <StatsCard
          title="Menunggu Proses"
          value={totalPending + totalDiterima}
          icon={Clock}
          iconClassName="text-amber-600 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400"
          description={`${totalPending} verifikator, ${totalDiterima} tendik`}
        />
      </div>

      {/* Charts Grid: 3-Prodi Pie & Overall Status Pie */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* 3 Prodi Distribution Pie Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <PieChartIcon className="w-4 h-4 text-primary" /> Pengajuan per Program Studi
            </CardTitle>
            <CardDescription className="text-xs">
              Distribusi pengajuan berdasarkan program studi
            </CardDescription>
          </CardHeader>
          <CardContent>
            <StatistikChart data={statsData?.per_prodi || []} height={224} />
          </CardContent>
        </Card>

        {/* Overall Status Distribution (Pie) */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Distribusi Status Prestasi
            </CardTitle>
            <CardDescription className="text-xs">
              Komparasi status pengajuan di tingkat fakultas
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {pieChartData.length === 0 ? (
              <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-4">
                <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
                <span>Belum ada data pengajuan dalam sistem</span>
              </div>
            ) : (
              <div className="h-56 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={75}
                      paddingAngle={4}
                      dataKey="value"
                      label={renderCustomSliceLabel}
                      labelLine={false}
                    >
                      {pieChartData.map((entry) => (
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
                      wrapperStyle={{ fontSize: '11px', paddingTop: '4px' }}
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
      </div>

      {/* Breakdown by Prodi (Bar) */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Building2 className="w-4 h-4 text-primary" /> Pengajuan Berdasarkan Program Studi
          </CardTitle>
          <CardDescription className="text-xs">
            Rincian jumlah status pengajuan prestasi mahasiswa pada tiap Program Studi
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {barChartData.length === 0 ? (
            <div className="h-56 flex flex-col items-center justify-center text-center text-muted-foreground text-xs p-4">
              <Building2 className="w-8 h-8 text-slate-300 dark:text-slate-600 mb-2" />
              <span>Belum ada data prodi</span>
            </div>
          ) : (
            <div className="h-56 w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData} margin={{ top: 18, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.2)" />
                  <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <YAxis allowDecimals={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
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
                  <Bar dataKey="Pending" fill="#f59e0b" radius={[4, 4, 0, 0]}>
                    <LabelList dataKey="Pending" position="top" className="text-[10px] font-bold fill-amber-700 dark:fill-amber-300" />
                  </Bar>
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
            {barChartData.map((d) => (
              <div
                key={d.name}
                className="p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800 flex flex-col items-center justify-center text-xs"
              >
                <span className="font-semibold text-slate-700 dark:text-slate-300">{d.name}</span>
                <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-muted-foreground flex-wrap justify-center">
                  <span className="text-amber-600 dark:text-amber-400 font-bold">{d.Pending} Pend</span>
                  <span>•</span>
                  <span className="text-sky-600 dark:text-sky-400 font-bold">{d.Diterima} Acc</span>
                  <span>•</span>
                  <span className="text-emerald-600 dark:text-emerald-400 font-bold">{d.Selesai} SK</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

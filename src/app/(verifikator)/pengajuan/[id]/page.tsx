import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Award,
  FileCheck,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  User,
  Phone,
  Mail,
  Building2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import StatusBadge from '@/components/shared/StatusBadge';
import { TerimaPengajuanDialog } from '@/components/forms/TerimaPengajuanDialog';
import { TolakPengajuanDialog } from '@/components/forms/TolakPengajuanDialog';

import {
  useVerifikatorPengajuanDetail,
  useTerimaPengajuan,
  useTolakPengajuan,
} from '@/lib/hooks/usePengajuan';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function VerifikatorDetailPengajuanPage() {
  const { id } = useParams<{ id: string }>();
  const pengajuanId = id ? parseInt(id, 10) : null;

  const { data: pengajuan, isLoading, error } = useVerifikatorPengajuanDetail(pengajuanId);

  const [isTerimaOpen, setIsTerimaOpen] = useState(false);
  const [isTolakOpen, setIsTolakOpen] = useState(false);

  const { mutate: terimaMutate, isPending: isSubmittingTerima } = useTerimaPengajuan();
  const { mutate: tolakMutate, isPending: isSubmittingTolak } = useTolakPengajuan();

  const handleTerimaConfirm = (feedback?: string) => {
    if (!pengajuanId) return;
    terimaMutate(
      { id: pengajuanId, data: { feedback_verifikator: feedback } },
      {
        onSuccess: () => {
          setIsTerimaOpen(false);
        },
      }
    );
  };

  const handleTolakConfirm = (feedback: string) => {
    if (!pengajuanId) return;
    tolakMutate(
      { id: pengajuanId, data: { feedback_verifikator: feedback } },
      {
        onSuccess: () => {
          setIsTolakOpen(false);
        },
      }
    );
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy, HH:mm', { locale: localeId }) + ' WIB';
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-purple-700" />
        <p className="mt-2 text-sm text-muted-foreground">Memuat rincian data pengajuan...</p>
      </div>
    );
  }

  if (error || !pengajuan) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengajuan Tidak Ditemukan</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Data pengajuan dengan ID #{id} tidak ditemukan atau berada di luar lingkup Program Studi
          verifikasi Anda.
        </p>
        <Button asChild variant="outline" className="dark:border-slate-800 dark:hover:bg-slate-800">
          <Link to="/verifikator/pengajuan">Kembali ke Antrean</Link>
        </Button>
      </div>
    );
  }

  const mkItems =
    pengajuan.pengajuan_mata_kuliahs && pengajuan.pengajuan_mata_kuliahs.length > 0
      ? pengajuan.pengajuan_mata_kuliahs.map((pmk) => ({
          kode: pmk.mata_kuliah?.kode_mk || '-',
          nama: pmk.mata_kuliah?.nama_mk || 'Mata Kuliah',
          sks: pmk.mata_kuliah?.sks || 0,
        }))
      : (pengajuan.mata_kuliahs || []).map((mk) => ({
          kode: mk.kode_mk,
          nama: mk.nama_mk,
          sks: mk.sks,
        }));

  const totalSks = mkItems.reduce((sum, item) => sum + item.sks, 0);
  const isPending = pengajuan.status === 'pending';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0 dark:hover:bg-slate-800">
            <Link to="/verifikator/pengajuan">
              <ArrowLeft className="w-5 h-5" />
            </Link>
          </Button>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-slate-500 dark:text-slate-400">#{pengajuan.id}</span>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-slate-100 leading-tight">
                {pengajuan.nama_lomba}
              </h2>
            </div>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
              <Calendar className="w-3.5 h-3.5" />
              Diajukan pada {formatDate(pengajuan.created_at)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <StatusBadge status={pengajuan.status} className="text-xs py-1 px-3" />
        </div>
      </div>

      {/* Action Notice if already verified */}
      {!isPending && (
        <Alert className="bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-900 dark:text-blue-200">
          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          <AlertTitle className="text-xs font-bold">Pengajuan Telah Diproses</AlertTitle>
          <AlertDescription className="text-xs">
            Pengajuan ini saat ini berstatus <strong>{pengajuan.status.toUpperCase()}</strong>. Anda
            hanya dapat melakukan aksi verifikasi pada pengajuan yang berstatus Pending.
          </AlertDescription>
        </Alert>
      )}

      {/* Grid: Identitas Mahasiswa & Info Lomba */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Mahasiswa Pengaju */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Identitas Mahasiswa Pengaju
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Nama Lengkap:</span>
              <span className="font-bold text-slate-900 dark:text-slate-100">
                {pengajuan.mahasiswa?.nama || pengajuan.user?.nama}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">NIM:</span>
              <span className="font-mono font-semibold text-slate-800 dark:text-slate-200">
                {pengajuan.mahasiswa?.nim_nip || pengajuan.user?.nim_nip}
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Program Studi:</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {pengajuan.prodi?.nama || '-'} ({pengajuan.prodi?.singkatan})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> No. WhatsApp:
              </span>
              <a
                href={`https://wa.me/${pengajuan.no_whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="font-mono font-semibold text-emerald-700 dark:text-emerald-400 hover:underline flex items-center gap-1"
              >
                {pengajuan.no_whatsapp}
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            {pengajuan.mahasiswa?.email && (
              <div className="flex justify-between py-1">
                <span className="text-muted-foreground flex items-center gap-1">
                  <Mail className="w-3 h-3" /> Email:
                </span>
                <span className="font-mono text-slate-800 dark:text-slate-200">{pengajuan.mahasiswa.email}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card Info Lomba */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Rincian Perlombaan & Capaian
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Bidang Lomba:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.bidang?.nama || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Tingkatan:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.tingkatan?.nama || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Capaian:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.tahapan?.nama || '-'}</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Detail Juara:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.detail_juara || '-'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground">Nama Tim:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.nama_tim || 'Individu'}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Card Bukti Dokumen (Zero File Upload) */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" /> Tautan Dokumen Bukti Prestasi
            </CardTitle>
            <CardDescription className="text-xs">
              Klik setiap tautan untuk membuka dan memvalidasi berkas pendukung pada tab baru
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="pt-4 space-y-3 text-xs">
          {/* Sertifikat */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-slate-100 block">Sertifikat / Piagam Penghargaan</span>
              <span className="text-[11px] text-muted-foreground">Bukti sertifikat atau piagam kejuaraan lomba</span>
            </div>
            <a
              href={pengajuan.link_sertifikat}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-primary text-primary-foreground rounded-xl font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              <ExternalLink className="w-3.5 h-3.5" /> Buka Tautan Sertifikat
            </a>
          </div>

          {/* Surat Tugas Mahasiswa */}
          {Boolean(pengajuan.status_surat_tugas_mahasiswa) && pengajuan.link_surat_tugas_mahasiswa && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Surat Tugas Mahasiswa</span>
                <span className="text-[11px] text-muted-foreground">
                  Surat tugas delegasi fakultas atau universitas
                </span>
              </div>
              <a
                href={pengajuan.link_surat_tugas_mahasiswa}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Surat Tugas Mhs
              </a>
            </div>
          )}

          {/* Surat Tugas Dosen */}
          {Boolean(pengajuan.status_surat_tugas_dosen) && pengajuan.link_surat_tugas_dosen && (
            <div className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200/80 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <span className="font-bold text-slate-900 dark:text-slate-100 block">Surat Tugas Dosen Pembimbing</span>
                <span className="text-[11px] text-muted-foreground">
                  Bukti penugasan dosen pembimbing tim lomba
                </span>
              </div>
              <a
                href={pengajuan.link_surat_tugas_dosen}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 dark:bg-slate-700 text-white rounded-xl font-semibold hover:bg-slate-900 transition-colors shrink-0"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Buka Surat Tugas Dosen
              </a>
            </div>
          )}

          {/* Poster & Sosmed */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            {pengajuan.link_poster && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">Poster / Dokumentasi:</span>
                <a
                  href={pengajuan.link_poster}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-semibold shrink-0"
                >
                  Buka Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
            {pengajuan.link_sosmed && (
              <div className="p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-2">
                <span className="text-slate-700 dark:text-slate-300 font-medium truncate">Publikasi Medsos:</span>
                <a
                  href={pengajuan.link_sosmed}
                  target="_blank"
                  rel="noreferrer"
                  className="text-primary hover:underline flex items-center gap-1 font-semibold shrink-0"
                >
                  Buka Link <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            )}
          </div>

          {pengajuan.keterangan && (
            <div className="pt-2">
              <span className="text-muted-foreground block mb-1">Catatan Tambahan Mahasiswa:</span>
              <p className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800 text-slate-800 dark:text-slate-200 leading-relaxed">
                {pengajuan.keterangan}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Card Mata Kuliah & Snapshot Matriks */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50/60 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 py-3.5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Mata Kuliah yang Diajukan untuk Konversi
            </CardTitle>
            <CardDescription className="text-xs">
              Mata kuliah yang dipilih mahasiswa sesuai bidang keilmuan lomba
            </CardDescription>
          </div>
          <Badge variant="outline" className="font-bold text-xs bg-white dark:bg-slate-900 dark:border-slate-800">
            Total: {totalSks} SKS
          </Badge>
        </CardHeader>

        <CardContent className="p-0 text-xs">
          <table className="w-full text-left">
            <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
              <tr>
                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Kode MK</th>
                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Nama Mata Kuliah</th>
                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Bobot SKS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mkItems.map((mk, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-medium text-slate-600 dark:text-slate-400">{mk.kode}</td>
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{mk.nama}</td>
                  <td className="p-3 text-right font-bold text-slate-800 dark:text-slate-200">{mk.sks} SKS</td>
                </tr>
              ))}
              <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t dark:border-slate-800">
                <td colSpan={2} className="p-3 text-right text-slate-700 dark:text-slate-300">
                  Akumulasi Total SKS:
                </td>
                <td className="p-3 text-right text-primary">{totalSks} SKS</td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>

      {/* Sticky Bottom Action Bar for Pending Status */}
      {isPending && (
        <div className="sticky bottom-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md p-4 rounded-2xl border border-slate-300/80 dark:border-slate-800 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-colors">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
              Pengajuan menunggu verifikasi.
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="outline"
              onClick={() => setIsTolakOpen(true)}
              className="text-xs gap-1.5 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 hover:bg-rose-50 dark:hover:bg-rose-950/40"
            >
              <XCircle className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              Tolak Pengajuan
            </Button>
            <Button
              onClick={() => setIsTerimaOpen(true)}
              className="text-xs gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm"
            >
              <CheckCircle2 className="w-4 h-4" />
              Setujui Pengajuan
            </Button>
          </div>
        </div>
      )}

      {/* Confirmation Dialogs */}
      <TerimaPengajuanDialog
        open={isTerimaOpen}
        onOpenChange={setIsTerimaOpen}
        onConfirm={handleTerimaConfirm}
        isLoading={isSubmittingTerima}
        pengajuan={pengajuan}
      />

      <TolakPengajuanDialog
        open={isTolakOpen}
        onOpenChange={setIsTolakOpen}
        onConfirm={handleTolakConfirm}
        isLoading={isSubmittingTolak}
        pengajuan={pengajuan}
      />
    </div>
  );
}

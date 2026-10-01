import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Award,
  FileCheck,
  BookOpen,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  User,
  Phone,
  Building2,
  FileText,
  UserCheck,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import StatusBadge from '@/components/shared/StatusBadge';
import FinalisasiForm from '@/components/forms/FinalisasiForm';
import { useTendikPengajuanDetail } from '@/lib/hooks/usePengajuan';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function TendikDetailPengajuanPage() {
  const { id } = useParams<{ id: string }>();
  const pengajuanId = id ? parseInt(id, 10) : null;

  const { data: pengajuan, isLoading, error } = useTendikPengajuanDetail(pengajuanId);

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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-600" />
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
          Data pengajuan dengan ID #{id} tidak dapat ditemukan di sistem.
        </p>
        <Button asChild variant="outline" className="dark:border-slate-800 dark:hover:bg-slate-800">
          <Link to="/tendik/pengajuan">Kembali ke Daftar Pengajuan</Link>
        </Button>
      </div>
    );
  }

  const isDiterima = pengajuan.status === 'diterima';
  const isSelesai = pengajuan.status === 'selesai';

  const snapshotHurufNilai =
    pengajuan.snapshot_huruf_nilai || pengajuan.snapshot_matriks?.huruf_nilai || 'A';

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-12">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0 dark:hover:bg-slate-800">
            <Link to="/tendik/pengajuan">
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

      {/* Catatan Feedback Verifikator Banner */}
      {pengajuan.feedback_verifikator && (
        <Alert className="bg-purple-50/80 dark:bg-purple-950/30 border-purple-200 dark:border-purple-800/60 text-purple-950 dark:text-purple-200">
          <MessageSquare className="h-4 w-4 text-purple-600 dark:text-purple-400 shrink-0" />
          <div className="ml-2 w-full">
            <AlertTitle className="text-xs font-bold text-purple-900 dark:text-purple-200 flex items-center justify-between flex-wrap gap-2">
              <span>Catatan Rekomendasi Verifikator Program Studi</span>
              {pengajuan.verifikator && (
                <span className="font-normal text-purple-700 dark:text-purple-300 text-[11px]">
                  Diverifikasi oleh: <strong>{pengajuan.verifikator.nama}</strong>
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="text-xs text-purple-800 dark:text-purple-300 mt-1 leading-relaxed">
              "{pengajuan.feedback_verifikator}"
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Selesai Banner if already completed */}
      {isSelesai && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2 text-emerald-950 dark:text-emerald-200">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold text-sm">
                Pengajuan Telah Selesai Difinalisasi
              </span>
            </div>
            <span className="text-xs text-emerald-800 dark:text-emerald-300">
              Selesai diproses pada {formatDate(pengajuan.processed_at || undefined)}
            </span>
          </div>
          {(pengajuan as any).catatan_tendik && (
            <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-emerald-800 dark:text-emerald-400">Catatan Tendik:</strong> "{(pengajuan as any).catatan_tendik}"
            </div>
          )}

          {pengajuan.link_sk_konversi && (
            <div className="pt-1">
              <a
                href={pengajuan.link_sk_konversi}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-sm transition-colors"
              >
                <FileText className="w-3.5 h-3.5" />
                Buka Arsip Digital Surat Keputusan (SK)
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Grid: Identitas Mahasiswa & Info Perlombaan */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Identitas Mahasiswa */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Data Mahasiswa & Program Studi
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Nama Mahasiswa:</span>
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
                {pengajuan.prodi?.nama} ({pengajuan.prodi?.singkatan})
              </span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> WhatsApp:
              </span>
              <span className="font-mono font-semibold text-slate-900 dark:text-slate-100">{pengajuan.no_whatsapp}</span>
            </div>
            {pengajuan.verifikator && (
              <div className="flex justify-between py-1 bg-blue-50/60 dark:bg-blue-950/40 p-2 rounded-xl border border-blue-100 dark:border-blue-900/40">
                <span className="text-blue-900 dark:text-blue-300 font-medium flex items-center gap-1">
                  <UserCheck className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> Disetujui Oleh:
                </span>
                <span className="font-bold text-blue-950 dark:text-blue-200">{pengajuan.verifikator.nama}</span>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Info Lomba & Capaian */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Rincian Prestasi & Capaian
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Bidang Keilmuan:</span>
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
              <span className="text-muted-foreground">Nilai Matriks:</span>
              <Badge className="bg-emerald-600 text-white font-mono font-bold">
                Grade: {snapshotHurufNilai}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Dokumen Tautan Bukti */}
      <Card>
        <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
          <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <FileCheck className="w-4 h-4 text-primary" /> Tautan Berkas Bukti Pendukung
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4 space-y-2.5 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
            <div>
              <span className="font-semibold text-slate-900 dark:text-slate-100">Sertifikat / Piagam</span>
              <p className="text-[11px] text-muted-foreground">Bukti keikutsertaan & juara</p>
            </div>
            <a
              href={pengajuan.link_sertifikat}
              target="_blank"
              rel="noreferrer"
              className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold"
            >
              Buka Tautan <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>

          {Boolean(pengajuan.status_surat_tugas_mahasiswa) && pengajuan.link_surat_tugas_mahasiswa && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Surat Tugas Mahasiswa</span>
              </div>
              <a
                href={pengajuan.link_surat_tugas_mahasiswa}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                Buka Tautan <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}

          {Boolean(pengajuan.status_surat_tugas_dosen) && pengajuan.link_surat_tugas_dosen && (
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="font-semibold text-slate-900 dark:text-slate-100">Surat Tugas Dosen Pembimbing</span>
              </div>
              <a
                href={pengajuan.link_surat_tugas_dosen}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold"
              >
                Buka Tautan <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          )}
        </CardContent>
      </Card>

      {/* FORM FINALISASI (jika status diterima) atau SUMMARY NILAI (jika sudah selesai) */}
      {isDiterima && <FinalisasiForm pengajuan={pengajuan} />}

      {isSelesai && (
        <Card className="overflow-hidden">
          <CardHeader className="bg-emerald-50/60 dark:bg-emerald-950/40 border-b border-slate-100 dark:border-slate-800 py-3.5">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Hasil Konversi Mata Kuliah
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0 text-xs">
            <table className="w-full text-left">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                <tr>
                  <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Kode MK</th>
                  <th className="p-3 font-semibold text-slate-600 dark:text-slate-400">Nama Mata Kuliah</th>
                  <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 text-center">SKS</th>
                  <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Huruf Nilai</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {(pengajuan.pengajuan_mata_kuliahs || []).map((pmk) => (
                  <tr key={pmk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="p-3 font-mono font-medium text-slate-600 dark:text-slate-400">
                      {pmk.mata_kuliah?.kode_mk}
                    </td>
                    <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{pmk.mata_kuliah?.nama_mk}</td>
                    <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200">
                      {pmk.mata_kuliah?.sks} SKS
                    </td>
                    <td className="p-3 text-right">
                      <span className="font-mono font-bold px-2 py-0.5 bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 rounded">
                        {pmk.huruf_nilai}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

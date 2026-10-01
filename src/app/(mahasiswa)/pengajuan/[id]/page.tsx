import React from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calendar,
  Award,
  FileCheck,
  BookOpen,
  ExternalLink,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Phone,
  Building2,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import StatusBadge from '@/components/shared/StatusBadge';
import { usePengajuanDetail } from '@/lib/hooks/usePengajuan';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function MahasiswaDetailPengajuanPage() {
  const { id } = useParams<{ id: string }>();
  const pengajuanId = id ? parseInt(id, 10) : null;

  const { data: pengajuan, isLoading, error } = usePengajuanDetail(pengajuanId);

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
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        <p className="mt-2 text-sm text-muted-foreground">Memuat detail data pengajuan...</p>
      </div>
    );
  }

  if (error || !pengajuan) {
    return (
      <div className="text-center py-12 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
        <AlertTriangle className="w-10 h-10 text-destructive mx-auto" />
        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100">Pengajuan Tidak Ditemukan</h3>
        <p className="text-xs text-muted-foreground max-w-sm mx-auto">
          Data pengajuan dengan ID #{id} tidak ditemukan atau Anda tidak memiliki hak akses untuk
          melihat data ini.
        </p>
        <Button asChild variant="outline" className="dark:border-slate-800 dark:hover:bg-slate-800">
          <Link to="/mahasiswa/pengajuan">Kembali ke Daftar Pengajuan</Link>
        </Button>
      </div>
    );
  }

  // Calculate total SKS from items or relation
  const mkItems =
    pengajuan.pengajuan_mata_kuliahs && pengajuan.pengajuan_mata_kuliahs.length > 0
      ? pengajuan.pengajuan_mata_kuliahs.map((pmk) => ({
          kode: pmk.mata_kuliah?.kode_mk || '-',
          nama: pmk.mata_kuliah?.nama_mk || 'Mata Kuliah',
          sks: pmk.mata_kuliah?.sks || 0,
          nilai: pmk.huruf_nilai,
        }))
      : (pengajuan.mata_kuliahs || []).map((mk) => ({
          kode: mk.kode_mk,
          nama: mk.nama_mk,
          sks: mk.sks,
          nilai: null,
        }));

  const totalSks = mkItems.reduce((sum, item) => sum + item.sks, 0);

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-soft-sm transition-colors duration-200">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" asChild className="h-9 w-9 shrink-0 dark:hover:bg-slate-800">
            <Link to="/mahasiswa/pengajuan">
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

      {/* Diterima Feedback Banner */}
      {pengajuan.status === 'diterima' && (
        <Alert className="bg-emerald-50/90 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/60 text-emerald-950 dark:text-emerald-200">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
          <div className="ml-2 w-full">
            <AlertTitle className="font-bold text-sm text-emerald-900 dark:text-emerald-200 flex items-center justify-between flex-wrap gap-2">
              <span>Pengajuan Diterima oleh Verifikator Program Studi</span>
              {pengajuan.verifikator && (
                <span className="text-xs font-normal text-emerald-700 dark:text-emerald-400">
                  Diverifikasi oleh: <strong>{pengajuan.verifikator.nama}</strong>
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="text-xs text-emerald-800 dark:text-emerald-300 mt-1 leading-relaxed">
              <strong>Catatan / Feedback Verifikator:</strong>
              <div className="mt-1 p-3 bg-white/90 dark:bg-slate-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 font-medium text-slate-800 dark:text-slate-200">
                "{pengajuan.feedback_verifikator || 'Pengajuan telah diperiksa dan disetujui untuk konversi SKS.'}"
              </div>
              <p className="mt-1.5 text-[11px] text-emerald-700 dark:text-emerald-400">
                Status saat ini menunggu penerbitan SK konversi oleh Tendik.
              </p>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Ditolak Feedback Banner */}
      {pengajuan.status === 'ditolak' && (
        <Alert variant="destructive" className="bg-rose-50 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200">
          <AlertTriangle className="h-5 w-5 text-rose-600 dark:text-rose-400 shrink-0" />
          <div className="ml-2 w-full">
            <AlertTitle className="font-bold text-sm text-rose-900 dark:text-rose-200 flex items-center justify-between flex-wrap gap-2">
              <span>Pengajuan Ditolak oleh Verifikator</span>
              {pengajuan.verifikator && (
                <span className="text-xs font-normal text-rose-700 dark:text-rose-300">
                  Diverifikasi oleh: <strong>{pengajuan.verifikator.nama}</strong>
                </span>
              )}
            </AlertTitle>
            <AlertDescription className="text-xs text-rose-800 dark:text-rose-300 mt-1 leading-relaxed">
              <strong>Catatan / Alasan Penolakan:</strong>
              <div className="mt-1 p-3 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-rose-200 dark:border-rose-900/50 font-medium text-rose-900 dark:text-rose-200">
                "{pengajuan.feedback_verifikator || 'Tidak ada catatan revisi spesifik.'}"
              </div>
            </AlertDescription>
          </div>
        </Alert>
      )}

      {/* Selesai / SK Konversi Banner */}
      {pengajuan.status === 'selesai' && (
        <div className="p-4 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/50 rounded-2xl space-y-2.5 text-emerald-950 dark:text-emerald-200">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
              <span className="font-bold text-sm">Konversi SKS Telah Selesai Diproses</span>
            </div>
            {pengajuan.tendik && (
              <span className="text-xs text-emerald-700 dark:text-emerald-400">
                Diproses oleh: <strong>{pengajuan.tendik.nama}</strong> (Staff Tendik)
              </span>
            )}
          </div>

          {pengajuan.feedback_verifikator && (
            <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-emerald-800 dark:text-emerald-400">Catatan Verifikator:</strong> "{pengajuan.feedback_verifikator}"
            </div>
          )}

          {(pengajuan as any).catatan_tendik && (
            <div className="p-2.5 bg-white/80 dark:bg-slate-900/80 rounded-xl border border-emerald-200 dark:border-emerald-800 text-xs text-slate-700 dark:text-slate-300">
              <strong className="text-emerald-800 dark:text-emerald-400">Catatan Bagian Akademik (Tendik):</strong> "{(pengajuan as any).catatan_tendik}"
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
                Unduh Surat Keputusan (SK) Konversi
                <ExternalLink className="w-3 h-3 ml-0.5" />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Grid: Info Lomba & Dokumen */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card Info Lomba */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Rincian Kegiatan Perlombaan
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
              <span className="text-muted-foreground">Capaian / Tahapan:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.tahapan?.nama || '-'}</span>
            </div>
            {pengajuan.detail_juara && (
              <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
                <span className="text-muted-foreground">Detail Juara:</span>
                <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.detail_juara}</span>
              </div>
            )}
            <div className="flex justify-between py-1 border-b border-slate-100 dark:border-slate-800">
              <span className="text-muted-foreground">Nama Tim:</span>
              <span className="font-semibold text-slate-900 dark:text-slate-100">{pengajuan.nama_tim || 'Individu'}</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-muted-foreground flex items-center gap-1">
                <Phone className="w-3 h-3" /> WhatsApp:
              </span>
              <span className="font-semibold text-slate-900 dark:text-slate-100 font-mono">{pengajuan.no_whatsapp}</span>
            </div>
          </CardContent>
        </Card>

        {/* Card Tautan Dokumen */}
        <Card>
          <CardHeader className="pb-3 border-b border-slate-100 dark:border-slate-800">
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" /> Dokumen & Tautan Bukti
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-4 space-y-3 text-xs">
            <div>
              <span className="text-muted-foreground block mb-1">Bukti Sertifikat / Piagam:</span>
              <a
                href={pengajuan.link_sertifikat}
                target="_blank"
                rel="noreferrer"
                className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold truncate bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
              >
                <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                {pengajuan.link_sertifikat}
              </a>
            </div>

            {Boolean(pengajuan.status_surat_tugas_mahasiswa) && pengajuan.link_surat_tugas_mahasiswa && (
              <div>
                <span className="text-muted-foreground block mb-1">Surat Tugas Mahasiswa:</span>
                <a
                  href={pengajuan.link_surat_tugas_mahasiswa}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1 truncate bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {pengajuan.link_surat_tugas_mahasiswa}
                </a>
              </div>
            )}

            {Boolean(pengajuan.status_surat_tugas_dosen) && pengajuan.link_surat_tugas_dosen && (
              <div>
                <span className="text-muted-foreground block mb-1">Surat Tugas Dosen Pembimbing:</span>
                <a
                  href={pengajuan.link_surat_tugas_dosen}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1 truncate bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {pengajuan.link_surat_tugas_dosen}
                </a>
              </div>
            )}

            {pengajuan.link_poster && (
              <div>
                <span className="text-muted-foreground block mb-1">Poster / Dokumentasi:</span>
                <a
                  href={pengajuan.link_poster}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1 truncate bg-slate-50 dark:bg-slate-800 p-2 rounded-xl border border-slate-200 dark:border-slate-700"
                >
                  <ExternalLink className="w-3.5 h-3.5 shrink-0" />
                  {pengajuan.link_poster}
                </a>
              </div>
            )}

            {pengajuan.keterangan && (
              <div className="pt-1">
                <span className="text-muted-foreground block mb-1">Catatan Tambahan:</span>
                <p className="p-2.5 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 leading-relaxed">
                  {pengajuan.keterangan}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Section Mata Kuliah Dipilih & Hasil Konversi */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50/60 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 py-3.5 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-sm font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-primary" /> Mata Kuliah Hasil Konversi SKS
            </CardTitle>
            <CardDescription className="text-xs">
              Mata kuliah program studi yang diajukan untuk konversi
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
                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 text-center">SKS</th>
                <th className="p-3 font-semibold text-slate-600 dark:text-slate-400 text-right">Nilai Konversi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {mkItems.map((mk, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40 transition-colors">
                  <td className="p-3 font-mono font-medium text-slate-600 dark:text-slate-400">{mk.kode}</td>
                  <td className="p-3 font-medium text-slate-900 dark:text-slate-100">{mk.nama}</td>
                  <td className="p-3 text-center font-bold text-slate-800 dark:text-slate-200">{mk.sks} SKS</td>
                  <td className="p-3 text-right">
                    {mk.nilai ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded font-mono font-bold bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300">
                        {mk.nilai}
                      </span>
                    ) : pengajuan.snapshot_matriks?.huruf_nilai ? (
                      <span className="text-muted-foreground font-mono text-[11px]">
                        (Prediksi: {pengajuan.snapshot_matriks.huruf_nilai})
                      </span>
                    ) : (
                      <span className="text-muted-foreground">-</span>
                    )}
                  </td>
                </tr>
              ))}
              <tr className="bg-slate-50 dark:bg-slate-800/60 font-bold border-t dark:border-slate-800">
                <td colSpan={2} className="p-3 text-right text-slate-700 dark:text-slate-300">
                  Total SKS:
                </td>
                <td className="p-3 text-center text-primary">{totalSks} SKS</td>
                <td className="p-3 text-right text-emerald-700 dark:text-emerald-400">
                  {pengajuan.status === 'selesai' ? 'Terverifikasi' : 'Menunggu Finalisasi'}
                </td>
              </tr>
            </tbody>
          </table>
        </CardContent>
      </Card>
    </div>
  );
}

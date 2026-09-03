import React, { useState } from 'react';
import {
  Award,
  FileCheck,
  BookOpen,
  ArrowLeft,
  Send,
  Loader2,
  ExternalLink,
  Sparkles,
  AlertTriangle,
  CheckCircle2,
  ShieldAlert,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { useBidang, useTingkatan, useTahapan } from '@/lib/hooks/useRefData';
import type { StepLombaInfoFormData, StepDokumenFormData } from '@/lib/schemas/pengajuan.schema';
import type { MataKuliah, MatriksKonversi } from '@/types';

interface StepPreviewProps {
  lombaData: StepLombaInfoFormData;
  dokumenData: StepDokumenFormData;
  selectedMks: MataKuliah[];
  matriks: MatriksKonversi | null;
  isSubmitting?: boolean;
  onSubmit: () => void;
  onBack: () => void;
}

export const StepPreview: React.FC<StepPreviewProps> = ({
  lombaData,
  dokumenData,
  selectedMks,
  matriks,
  isSubmitting = false,
  onSubmit,
  onBack,
}) => {
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const { data: bidangList = [] } = useBidang();
  const { data: tingkatanList = [] } = useTingkatan();
  const { data: tahapanList = [] } = useTahapan();

  const bidangName = bidangList.find((b) => b.id === lombaData.bidang_id)?.nama || '-';
  const tingkatanName = tingkatanList.find((t) => t.id === lombaData.tingkatan_id)?.nama || '-';
  const tahapanName = tahapanList.find((th) => th.id === lombaData.tahapan_id)?.nama || '-';

  const totalSks = selectedMks.reduce((sum, mk) => sum + (mk.sks || 0), 0);

  return (
    <div className="space-y-6">
      {/* Review Card */}
      <Card className="overflow-hidden">
        <CardHeader className="bg-slate-50/70 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800 py-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-bold text-slate-900 dark:text-slate-100">
                Pratinjau Pengajuan Prestasi
              </CardTitle>
              <p className="text-xs text-muted-foreground mt-0.5">
                Periksa kembali semua data sebelum diajukan ke Dosen Verifikator.
              </p>
            </div>
            {matriks && (
              <Badge className="bg-emerald-600 text-white gap-1 text-xs py-1 px-2.5">
                <Sparkles className="w-3.5 h-3.5" /> Prediksi Nilai: {matriks.huruf_nilai}
              </Badge>
            )}
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {/* Section 1: Informasi Lomba */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5" /> 1. Data Perlombaan
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div>
                <span className="text-muted-foreground">Nama Lomba:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 text-sm mt-0.5">
                  {lombaData.nama_lomba}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Bidang Keilmuan:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{bidangName}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Tingkatan & Capaian:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {tingkatanName} — {tahapanName}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Detail Juara:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
                  {lombaData.detail_juara || '-'}
                </p>
              </div>
              <div>
                <span className="text-muted-foreground">Nama Tim:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{lombaData.nama_tim || '-'}</p>
              </div>
              <div>
                <span className="text-muted-foreground">No. WhatsApp:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">{lombaData.no_whatsapp}</p>
              </div>
              <div>
                <span className="text-muted-foreground">Semester Mahasiswa:</span>
                <p className="font-semibold text-slate-900 dark:text-slate-100 mt-0.5">Semester {lombaData.semester || 1}</p>
              </div>
            </div>
          </div>

          {/* Section 2: Dokumen Tautan */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" /> 2. Tautan Dokumen Pendukung
            </h4>
            <div className="space-y-2 text-xs bg-slate-50 dark:bg-slate-850 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60 dark:border-slate-800">
                <span className="text-muted-foreground">Tautan Sertifikat / Piagam:</span>
                <a
                  href={dokumenData.link_sertifikat}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold truncate max-w-xs"
                >
                  <ExternalLink className="w-3 h-3 shrink-0" />
                  {dokumenData.link_sertifikat}
                </a>
              </div>

              {dokumenData.status_surat_tugas_mahasiswa && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-muted-foreground">Surat Tugas Mahasiswa:</span>
                  <a
                    href={dokumenData.link_surat_tugas_mahasiswa || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold truncate max-w-xs"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {dokumenData.link_surat_tugas_mahasiswa}
                  </a>
                </div>
              )}

              {dokumenData.status_surat_tugas_dosen && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-muted-foreground">Surat Tugas Dosen Pembimbing:</span>
                  <a
                    href={dokumenData.link_surat_tugas_dosen || '#'}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline flex items-center gap-1 font-semibold truncate max-w-xs"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {dokumenData.link_surat_tugas_dosen}
                  </a>
                </div>
              )}

              {dokumenData.link_poster && (
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 py-1 border-b border-slate-200/60 dark:border-slate-800">
                  <span className="text-muted-foreground">Poster / Dokumentasi:</span>
                  <a
                    href={dokumenData.link_poster}
                    target="_blank"
                    rel="noreferrer"
                    className="font-mono text-primary hover:underline flex items-center gap-1 truncate max-w-xs"
                  >
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {dokumenData.link_poster}
                  </a>
                </div>
              )}

              {dokumenData.keterangan && (
                <div className="pt-2">
                  <span className="text-muted-foreground">Keterangan Tambahan:</span>
                  <p className="mt-1 text-slate-800 dark:text-slate-200 bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800 leading-relaxed">
                    {dokumenData.keterangan}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Mata Kuliah Konversi */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5" /> 3. Mata Kuliah yang Diajukan ({selectedMks.length} MK)
              </h4>
              {selectedMks.length > 0 && (
                <Badge variant="outline" className="font-bold text-xs bg-white dark:bg-slate-900 dark:border-slate-800">
                  Total: {totalSks} SKS
                </Badge>
              )}
            </div>

            {selectedMks.length === 0 ? (
              <div className="p-4 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl text-xs text-blue-900 dark:text-blue-200 space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-blue-950 dark:text-blue-100">
                  <Sparkles className="w-4 h-4 text-blue-600 dark:text-blue-400" /> Tanpa Konversi SKS (Pencatatan Partisipasi / Telah Ditempuh)
                </p>
                <p className="text-blue-800 dark:text-blue-300 leading-relaxed">
                  Pengajuan ini dikirimkan untuk dokumentasi prestasi resmi dalam sistem SIMPRESMA tanpa konversi SKS mata kuliah (mata kuliah dilewati atau seluruh mata kuliah relevan telah Anda tempuh di semester sebelumnya).
                </p>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/80 dark:border-slate-800 overflow-hidden text-xs transition-colors">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-100 dark:border-slate-800">
                    <tr>
                      <th className="p-2.5 font-semibold text-slate-600 dark:text-slate-400">Kode MK</th>
                      <th className="p-2.5 font-semibold text-slate-600 dark:text-slate-400">Nama Mata Kuliah</th>
                      <th className="p-2.5 font-semibold text-slate-600 dark:text-slate-400 text-center">Semester</th>
                      <th className="p-2.5 font-semibold text-slate-600 dark:text-slate-400 text-right">Bobot SKS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                    {selectedMks.map((mk) => (
                      <tr key={mk.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/40">
                        <td className="p-2.5 font-mono font-medium text-slate-600 dark:text-slate-400">{mk.kode_mk}</td>
                        <td className="p-2.5 font-medium text-slate-900 dark:text-slate-100">{mk.nama_mk}</td>
                        <td className="p-2.5 text-center text-slate-500 dark:text-slate-400">{mk.semester || '-'}</td>
                        <td className="p-2.5 text-right font-bold text-slate-900 dark:text-slate-100">{mk.sks} SKS</td>
                      </tr>
                    ))}
                    <tr className="bg-slate-50/80 dark:bg-slate-800/80 font-bold border-t dark:border-slate-800">
                      <td colSpan={3} className="p-2.5 text-right text-slate-700 dark:text-slate-300">
                        Total Akumulasi SKS:
                      </td>
                      <td className="p-2.5 text-right text-emerald-700 dark:text-emerald-400">{totalSks} SKS</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Warning Banner */}
          <Alert className="bg-amber-50/80 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/50 text-amber-900 dark:text-amber-200">
            <AlertTriangle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <AlertDescription className="text-xs">
              <strong>Pemberitahuan Penting:</strong> Setelah formulir ini dikirim, data pengajuan
              akan langsung masuk ke sistem verifikasi dan tidak dapat diubah kembali kecuali diminta
              revisi oleh dosen verifikator.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={isSubmitting}
          className="gap-2 dark:border-slate-800 dark:hover:bg-slate-800"
        >
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
        <Button
          type="button"
          onClick={() => setIsConfirmOpen(true)}
          disabled={isSubmitting}
          className="gap-2 bg-emerald-600 hover:bg-emerald-700 shadow-sm"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Mengirimkan Pengajuan...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Ajukan Prestasi Sekarang
            </>
          )}
        </Button>
      </div>

      {/* ─── Modal Konfirmasi Pre-Submit ─────────────────────────────── */}
      <Dialog open={isConfirmOpen} onOpenChange={setIsConfirmOpen}>
        <DialogContent className="sm:max-w-lg dark:bg-slate-900 dark:border-slate-800">
          <DialogHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-950/60 text-amber-700 dark:text-amber-400 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">
                  Konfirmasi Pengajuan Prestasi
                </DialogTitle>
                <DialogDescription className="text-xs text-amber-700 dark:text-amber-400 font-medium mt-0.5">
                  Pastikan data yang Anda masukkan sudah benar. Setelah dikirim, data tidak dapat diubah kembali.
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-4 py-2 text-xs">
            {/* Ringkasan Data */}
            <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 space-y-2.5">
              <p className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[11px]">
                Ringkasan Pengajuan:
              </p>

              <div className="grid grid-cols-2 gap-2 text-slate-700 dark:text-slate-300">
                <div>
                  <span className="text-muted-foreground block text-[11px]">Nama Lomba:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">{lombaData.nama_lomba}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Bidang & Capaian:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{bidangName} • {tahapanName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Tingkatan:</span>
                  <span className="font-semibold text-slate-900 dark:text-slate-100">{tingkatanName}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block text-[11px]">Konversi SKS:</span>
                  <span className="font-semibold text-emerald-700 dark:text-emerald-400">
                    {selectedMks.length > 0 ? `${selectedMks.length} MK (${totalSks} SKS)` : 'Tanpa Konversi SKS'}
                  </span>
                </div>
              </div>
            </div>

            {/* Checklist Dokumen Wajib */}
            <div className="space-y-1.5">
              <p className="font-semibold text-slate-700 dark:text-slate-300 text-[11px]">
                Kelengkapan Dokumen Wajib:
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Sertifikat / Piagam</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">SK Tugas Mahasiswa</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">SK Dosen Pembimbing</span>
                </div>
                <div className="flex items-center gap-1.5 p-2 rounded-lg bg-emerald-50/60 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-900/50 text-emerald-800 dark:text-emerald-300 text-[11px]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="truncate">Poster & Publikasi Medsos</span>
                </div>
              </div>
            </div>

            {/* Pernyataan Tanggung Jawab */}
            <div className="p-3 rounded-xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <p className="leading-relaxed text-[11px]">
                Saya menyatakan dengan sungguh-sungguh bahwa data dan berkas yang dicantumkan adalah valid dan benar. Apabila ditemukan pemalsuan data, pengajuan ini dapat dibatalkan sewaktu-waktu.
              </p>
            </div>
          </div>

          <DialogFooter className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setIsConfirmOpen(false)}
              disabled={isSubmitting}
            >
              Batal / Periksa Kembali
            </Button>
            <Button
              type="button"
              size="sm"
              onClick={() => {
                setIsConfirmOpen(false);
                onSubmit();
              }}
              disabled={isSubmitting}
              className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Mengirimkan...
                </>
              ) : (
                <>
                  <Send className="w-3.5 h-3.5" /> Ya, Kirim Sekarang
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default StepPreview;

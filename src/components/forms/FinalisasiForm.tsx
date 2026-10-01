import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import {
  CheckCircle2,
  FileText,
  Link as LinkIcon,
  Loader2,
  Lock,
  GraduationCap,
  Award,
  AlertTriangle,
  MessageSquare,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useFinalisasiPengajuan } from '@/lib/hooks/usePengajuan';
import type { Pengajuan, PengajuanMataKuliahItem, MataKuliah } from '@/types';

interface FinalisasiFormProps {
  pengajuan: Pengajuan;
}

export const FinalisasiForm: React.FC<FinalisasiFormProps> = ({ pengajuan }) => {
  const navigate = useNavigate();
  const finalisasiMutation = useFinalisasiPengajuan();

  const snapshotHurufNilai =
    pengajuan.snapshot_huruf_nilai || pengajuan.snapshot_matriks?.huruf_nilai || 'A';

  // Get list of MK items from relation
  const mkList: Array<{ mk_id: number; kode_mk: string; nama_mk: string; sks: number }> =
    pengajuan.pengajuan_mata_kuliahs && pengajuan.pengajuan_mata_kuliahs.length > 0
      ? pengajuan.pengajuan_mata_kuliahs.map((pmk: PengajuanMataKuliahItem) => ({
          mk_id: pmk.mata_kuliah_id,
          kode_mk: pmk.mata_kuliah?.kode_mk || '-',
          nama_mk: pmk.mata_kuliah?.nama_mk || 'Mata Kuliah',
          sks: pmk.mata_kuliah?.sks || 0,
        }))
      : (pengajuan.mata_kuliahs || []).map((mk: MataKuliah) => ({
          mk_id: mk.id,
          kode_mk: mk.kode_mk,
          nama_mk: mk.nama_mk,
          sks: mk.sks,
        }));

  // State: mapping mk_id -> huruf_nilai. Pre-fill automatically with snapshot!
  const [nilaiMap, setNilaiMap] = useState<Record<number, string>>(() => {
    const initial: Record<number, string> = {};
    mkList.forEach((mk) => {
      initial[mk.mk_id] = snapshotHurufNilai;
    });
    return initial;
  });

  const [linkSk, setLinkSk] = useState<string>('');
  const [catatanTendik, setCatatanTendik] = useState<string>('');
  const [urlError, setUrlError] = useState<string | null>(null);

  const handleSelectNilai = (mkId: number, val: string) => {
    setNilaiMap((prev) => ({
      ...prev,
      [mkId]: val,
    }));
  };

  const hasMataKuliah = mkList.length > 0;

  const isAllValid =
    !hasMataKuliah ||
    mkList.every((mk) => nilaiMap[mk.mk_id] === snapshotHurufNilai);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // URL validation if filled
    if (linkSk && linkSk.trim() !== '') {
      if (!/^https?:\/\/.+/i.test(linkSk.trim())) {
        setUrlError('Tautan SK Konversi harus berupa URL valid yang diawali dengan http:// atau https://');
        return;
      }
    }
    setUrlError(null);

    if (!isAllValid) {
      toast.error('Nilai Tidak Sesuai Matriks', {
        description: `Seluruh mata kuliah wajib memiliki nilai ${snapshotHurufNilai} sesuai snapshot aturan fakultas.`,
      });
      return;
    }

    const payload = {
      nilai_per_mk: hasMataKuliah
        ? mkList.map((mk) => ({
            mk_id: mk.mk_id,
            huruf_nilai: nilaiMap[mk.mk_id],
          }))
        : [],
      link_sk_konversi: linkSk.trim() || null,
      catatan_tendik: catatanTendik.trim() || null,
    };

    try {
      await finalisasiMutation.mutateAsync({
        id: pengajuan.id,
        data: payload,
      });

      toast.success('Konversi Berhasil Difinalisasi', {
        description: 'Status pengajuan kini telah Selesai dan nilai resmi telah diterbitkan.',
      });

      navigate('/tendik/pengajuan');
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal memfinalisasi konversi pengajuan.';
      toast.error('Gagal Finalisasi', { description: errorMsg });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card className="border-slate-200 shadow-sm overflow-hidden">
        <CardHeader className="bg-emerald-50/50 border-b border-emerald-100 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <CardTitle className="text-base font-bold text-slate-900 flex items-center gap-2">
                <GraduationCap className="w-4 h-4 text-emerald-600" />
                Formulir Finalisasi Konversi Nilai SKS
              </CardTitle>
              <CardDescription className="text-xs text-slate-600 mt-0.5">
                Input nilai huruf sesuai matriks dan cantumkan tautan Surat Keputusan (SK)
              </CardDescription>
            </div>
            <Badge className="bg-emerald-600 text-white font-mono text-xs px-2.5 py-1 self-start sm:self-center gap-1.5">
              <Lock className="w-3 h-3" />
              Nilai Matriks: {snapshotHurufNilai}
            </Badge>
          </div>
        </CardHeader>

        <CardContent className="p-6 space-y-6">
          {hasMataKuliah ? (
            <>
              {/* Strict Notice */}
              <Alert className="bg-amber-50 border-amber-200 text-amber-950">
                <AlertTriangle className="h-4 w-4 text-amber-600" />
                <AlertTitle className="text-xs font-bold">Ketentuan Nilai Matriks</AlertTitle>
                <AlertDescription className="text-xs leading-relaxed mt-0.5">
                  Berdasarkan peraturan dekanat dan snapshot verifikasi, nilai yang diinput{' '}
                  <strong>WAJIB sama persis dengan nilai matriks ({snapshotHurufNilai})</strong>. Pilihan
                  huruf nilai telah dikunci untuk mencegah anomali data akademik.
                </AlertDescription>
              </Alert>

              {/* Table Input Nilai per MK */}
              <div className="rounded-xl border border-slate-200 overflow-hidden text-xs">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="p-3 font-semibold text-slate-600">Kode MK</th>
                      <th className="p-3 font-semibold text-slate-600">Nama Mata Kuliah</th>
                      <th className="p-3 font-semibold text-slate-600 text-center">Bobot SKS</th>
                      <th className="p-3 font-semibold text-slate-600 text-right w-[180px]">
                        Huruf Nilai Konversi
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {mkList.map((mk) => (
                      <tr key={mk.mk_id} className="hover:bg-slate-50/60">
                        <td className="p-3 font-mono font-medium text-slate-600">{mk.kode_mk}</td>
                        <td className="p-3 font-medium text-slate-900">{mk.nama_mk}</td>
                        <td className="p-3 text-center font-bold text-slate-800">{mk.sks} SKS</td>
                        <td className="p-3 text-right">
                          <Select
                            value={nilaiMap[mk.mk_id] || snapshotHurufNilai}
                            onValueChange={(val) => handleSelectNilai(mk.mk_id, val)}
                          >
                            <SelectTrigger className="w-[140px] h-8 text-xs font-bold font-mono ml-auto bg-white border-emerald-300 text-emerald-800">
                              <SelectValue placeholder="Pilih Nilai" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem
                                value={snapshotHurufNilai}
                                className="font-mono font-bold text-emerald-700"
                              >
                                {snapshotHurufNilai} (Sesuai Matriks)
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          ) : (
            /* Non-Conversion Notice */
            <div className="p-4 bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 rounded-xl space-y-1.5 text-xs text-sky-950 dark:text-sky-200">
              <div className="font-semibold flex items-center gap-1.5 text-sky-900 dark:text-sky-100 text-sm">
                <Award className="w-4 h-4 text-sky-600" />
                Pencatatan Prestasi Portofolio / SKPI (Tanpa Konversi SKS)
              </div>
              <p className="leading-relaxed text-sky-800 dark:text-sky-300">
                Mahasiswa mengajukan prestasi ini <strong>tanpa konversi mata kuliah</strong> (seluruh SKS kurikulum telah terpenuhi atau pengajuan ditujukan murni untuk rekognisi portofolio dan Surat Keterangan Pendamping Ijazah/SKPI).
              </p>
              <p className="leading-relaxed text-sky-700 dark:text-sky-400">
                Tidak ada mata kuliah yang perlu dinilai. Anda dapat langsung menyelesaikan pengajuan ini dan mencantumkan tautan SK pengesahan (jika ada).
              </p>
            </div>
          )}

          {/* Field: Link SK Konversi */}
          <div className="space-y-2 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <Label htmlFor="link_sk_konversi" className="text-xs font-semibold flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-primary" />
              Tautan Surat Keputusan (SK) Konversi (Opsional)
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="link_sk_konversi"
                placeholder="https://drive.google.com/file/d/.../view"
                className="pl-9 font-mono text-xs bg-white"
                value={linkSk}
                onChange={(e) => {
                  setLinkSk(e.target.value);
                  setUrlError(null);
                }}
              />
            </div>
            {urlError && <p className="text-xs font-medium text-destructive">{urlError}</p>}
            <p className="text-[11px] text-muted-foreground">
              Cantumkan tautan berkas SK jika telah diterbitkan dan ditandatangani oleh Dekanat atau Pimpinan Fakultas.
            </p>
          </div>

          {/* Field: Catatan / Feedback Tendik */}
          <div className="space-y-1.5 p-4 bg-slate-50/80 rounded-xl border border-slate-200">
            <Label htmlFor="catatan_tendik" className="text-xs font-semibold flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Catatan / Feedback Tendik untuk Mahasiswa (Opsional)
            </Label>
            <Textarea
              id="catatan_tendik"
              placeholder="Contoh: SK Konversi telah diterbitkan dengan nomor 082/UN25/AK/2026. Nilai telah diinputkan ke sistem SIAKAD."
              rows={3}
              value={catatanTendik}
              onChange={(e) => setCatatanTendik(e.target.value)}
              className="text-xs bg-white resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Catatan ini akan tampil pada riwayat pengajuan mahasiswa dan dikirimkan lewat notifikasi bot Telegram.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Action Submit Button */}
      <div className="flex justify-end">
        <Button
          type="submit"
          disabled={!isAllValid || finalisasiMutation.isPending}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs px-6 h-10 gap-2 shadow-md"
        >
          {finalisasiMutation.isPending ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              Memfinalisasi Data...
            </>
          ) : (
            <>
              <CheckCircle2 className="w-4 h-4" />
              {hasMataKuliah
                ? 'Finalisasi Konversi & Terbitkan Nilai'
                : 'Finalisasi & Selesaikan Pencatatan Prestasi'}
            </>
          )}
        </Button>
      </div>
    </form>
  );
};

export default FinalisasiForm;

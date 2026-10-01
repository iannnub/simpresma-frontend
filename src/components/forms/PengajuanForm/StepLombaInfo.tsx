import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  stepLombaInfoSchema,
  type StepLombaInfoFormData,
} from '@/lib/schemas/pengajuan.schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { useBidang, useTahapan, useTingkatan, useMatriks } from '@/lib/hooks/useRefData';
import { Award, ArrowRight, Info, CheckCircle2 } from 'lucide-react';
import type { MatriksKonversi } from '@/types';

interface StepLombaInfoProps {
  initialData?: Partial<StepLombaInfoFormData>;
  onNext: (data: StepLombaInfoFormData, matriks: MatriksKonversi | null) => void;
}

export const StepLombaInfo: React.FC<StepLombaInfoProps> = ({ initialData, onNext }) => {
  const { data: bidangList = [] } = useBidang();
  const { data: tingkatanList = [] } = useTingkatan();
  const { data: tahapanList = [] } = useTahapan();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<StepLombaInfoFormData>({
    resolver: zodResolver(stepLombaInfoSchema),
    defaultValues: {
      nama_lomba: initialData?.nama_lomba || '',
      nama_tim: initialData?.nama_tim || '',
      no_whatsapp: initialData?.no_whatsapp || '',
      bidang_id: initialData?.bidang_id || 0,
      tingkatan_id: initialData?.tingkatan_id || 0,
      tahapan_id: initialData?.tahapan_id || 0,
      semester: initialData?.semester || 1,
      detail_juara: initialData?.detail_juara || '',
    },
  });

  const tingkatanId = watch('tingkatan_id');
  const tahapanId = watch('tahapan_id');

  const { data: matriks, isLoading: isLoadingMatriks } = useMatriks(
    tingkatanId || null,
    tahapanId || null
  );

  const hasConversionSks = Boolean(matriks && matriks.min_sks !== null && matriks.max_sks !== null);
  const isZeroConversionParticipation = Boolean(
    tingkatanId && tahapanId && !isLoadingMatriks && (!matriks || matriks.min_sks === null)
  );

  const onSubmit = (data: StepLombaInfoFormData) => {
    onNext(data, matriks || null);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-4 h-4 text-primary" /> Informasi Perlombaan
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Masukkan rincian kegiatan lomba dan capaian prestasi yang Anda ikuti.
            </p>
          </div>

          {/* Nama Lomba */}
          <div className="space-y-1.5">
            <Label htmlFor="nama_lomba">
              Nama Kegiatan / Perlombaan <span className="text-destructive">*</span>
            </Label>
            <Input
              id="nama_lomba"
              placeholder="Contoh: Pagelaran Mahasiswa Nasional Bidang TIK (GEMASTIK XVI)"
              {...register('nama_lomba')}
            />
            {errors.nama_lomba && (
              <p className="text-xs font-medium text-destructive">{errors.nama_lomba.message}</p>
            )}
          </div>

          {/* Bidang Lomba & Semester Saat Ini */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="bidang_id">
                Bidang Perlombaan <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('bidang_id') ? String(watch('bidang_id')) : ''}
                onValueChange={(val) =>
                  setValue('bidang_id', Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger id="bidang_id">
                  <SelectValue placeholder="Pilih bidang lomba..." />
                </SelectTrigger>
                <SelectContent>
                  {bidangList.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.bidang_id && (
                <p className="text-xs font-medium text-destructive">{errors.bidang_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="semester">
                Semester Mahasiswa Saat Mengikuti Lomba <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('semester') ? String(watch('semester')) : '1'}
                onValueChange={(val) =>
                  setValue('semester', Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger id="semester">
                  <SelectValue placeholder="Pilih semester..." />
                </SelectTrigger>
                <SelectContent>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={String(sem)}>
                      Semester {sem} {sem === 1 ? '(Tingkat Pertama)' : ''}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-[11px] text-muted-foreground">
                Mata kuliah konversi Semester 1 (misal: IMK) hanya diperuntukkan bagi mahasiswa Semester 1.
              </p>
              {errors.semester && (
                <p className="text-xs font-medium text-destructive">{errors.semester.message}</p>
              )}
            </div>
          </div>

          {/* Nama Tim & Kontak WhatsApp */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="nama_tim">Nama Tim (Kosongkan jika Individu)</Label>
              <Input
                id="nama_tim"
                placeholder="Contoh: Tim Inovasi Fasilkom"
                {...register('nama_tim')}
              />
              {errors.nama_tim && (
                <p className="text-xs font-medium text-destructive">{errors.nama_tim.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="no_whatsapp">
                Nomor WhatsApp Aktif <span className="text-destructive">*</span>
              </Label>
              <Input
                id="no_whatsapp"
                placeholder="Contoh: 081234567890"
                {...register('no_whatsapp')}
              />
              {errors.no_whatsapp && (
                <p className="text-xs font-medium text-destructive">{errors.no_whatsapp.message}</p>
              )}
            </div>
          </div>

          {/* Tingkatan & Tahapan Lomba */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label htmlFor="tingkatan_id">
                Tingkatan Lomba / Kompetisi <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('tingkatan_id') ? String(watch('tingkatan_id')) : ''}
                onValueChange={(val) =>
                  setValue('tingkatan_id', Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger id="tingkatan_id">
                  <SelectValue placeholder="Pilih tingkatan..." />
                </SelectTrigger>
                <SelectContent>
                  {tingkatanList.map((t) => (
                    <SelectItem key={t.id} value={String(t.id)}>
                      {t.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tingkatan_id && (
                <p className="text-xs font-medium text-destructive">{errors.tingkatan_id.message}</p>
              )}
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tahapan_id">
                Capaian / Tahapan Juara <span className="text-destructive">*</span>
              </Label>
              <Select
                value={watch('tahapan_id') ? String(watch('tahapan_id')) : ''}
                onValueChange={(val) =>
                  setValue('tahapan_id', Number(val), { shouldValidate: true })
                }
              >
                <SelectTrigger id="tahapan_id">
                  <SelectValue placeholder="Pilih capaian..." />
                </SelectTrigger>
                <SelectContent>
                  {tahapanList.map((th) => (
                    <SelectItem key={th.id} value={String(th.id)}>
                      {th.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.tahapan_id && (
                <p className="text-xs font-medium text-destructive">{errors.tahapan_id.message}</p>
              )}
            </div>
          </div>

          {/* Detail Juara */}
          <div className="space-y-1.5">
            <Label htmlFor="detail_juara">Keterangan Juara (Opsional)</Label>
            <Input
              id="detail_juara"
              placeholder="Contoh: Juara 1 Kategori UX Design / Medali Emas"
              {...register('detail_juara')}
            />
            {errors.detail_juara && (
              <p className="text-xs font-medium text-destructive">{errors.detail_juara.message}</p>
            )}
          </div>

          {/* Matriks Konversi SKS Preview Box */}
          {hasConversionSks && (
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2 animate-in fade-in-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-emerald-900 flex items-center gap-1.5">
                  Estimasi Konversi SKS
                </span>
                <Badge className="bg-emerald-600 text-white font-mono text-xs">
                  Grade: {matriks?.huruf_nilai}
                </Badge>
              </div>
              <p className="text-xs text-emerald-800 leading-relaxed">
                Berhak atas{' '}
                <strong className="underline">
                  {matriks?.min_sks}–{matriks?.max_sks} SKS
                </strong>{' '}
                (Nilai <strong>{matriks?.huruf_nilai}</strong>). Pilih mata kuliah pada langkah selanjutnya.
              </p>
            </div>
          )}

          {/* Zero Conversion / Mendaftar Participation Alert */}
          {isZeroConversionParticipation && (
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl space-y-2 animate-in fade-in-50">
              <div className="flex items-center gap-2 text-xs font-bold text-blue-900">
                <Info className="w-4 h-4 text-blue-600 shrink-0" />
                Pencatatan Partisipasi Lomba (Tanpa Konversi SKS)
              </div>
              <p className="text-xs text-blue-800 leading-relaxed">
                Capaian ini dicatat sebagai dokumentasi keikutsertaan lomba tanpa konversi SKS kurikulum. Anda dapat melanjutkan untuk mengunggah berkas bukti.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex justify-end">
        <Button
          type="submit"
          className="gap-2 shadow-sm"
        >
          Lanjut ke Dokumen Bukti <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default StepLombaInfo;

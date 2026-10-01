import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  stepDokumenSchema,
  type StepDokumenFormData,
} from '@/lib/schemas/pengajuan.schema';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { FileCheck, ArrowRight, ArrowLeft, Link as LinkIcon, Info } from 'lucide-react';

interface StepDokumenProps {
  initialData?: Partial<StepDokumenFormData>;
  onNext: (data: StepDokumenFormData) => void;
  onBack: () => void;
}

export const StepDokumen: React.FC<StepDokumenProps> = ({
  initialData,
  onNext,
  onBack,
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<StepDokumenFormData>({
    resolver: zodResolver(stepDokumenSchema),
    defaultValues: {
      link_sertifikat: initialData?.link_sertifikat || '',
      status_surat_tugas_mahasiswa: initialData?.status_surat_tugas_mahasiswa ?? true,
      link_surat_tugas_mahasiswa: initialData?.link_surat_tugas_mahasiswa || '',
      status_surat_tugas_dosen: initialData?.status_surat_tugas_dosen ?? true,
      link_surat_tugas_dosen: initialData?.link_surat_tugas_dosen || '',
      link_poster: initialData?.link_poster || '',
      link_sosmed: initialData?.link_sosmed || '',
      keterangan: initialData?.keterangan || '',
    },
  });

  const onSubmit = (data: StepDokumenFormData) => {
    onNext(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <Card className="border-slate-200 shadow-sm">
        <CardContent className="p-6 space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <FileCheck className="w-4 h-4 text-primary" /> Dokumen & Tautan Bukti Prestasi
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              SIMPRESMA tidak menyimpan berkas langsung. Masukkan tautan bukti lomba (Google Drive,
              Cloud Storage, atau situs web lomba).
            </p>
          </div>

          {/* Guideline Alert */}
          <div className="p-3.5 bg-blue-50/80 border border-blue-200/80 rounded-xl text-xs text-blue-900 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-primary shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>Panduan Tautan Berkas:</strong> Pastikan tautan Google Drive / Cloud Anda
              telah disetel hak aksesnya ke <em>"Siapa saja yang memiliki tautan"</em> (Anyone with
              the link can view) agar verifikator dapat memeriksa berkas secara langsung.
            </div>
          </div>

          {/* Link Sertifikat (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="link_sertifikat" className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              Tautan Bukti Sertifikat / Piagam <span className="text-destructive font-bold">*</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="link_sertifikat"
                placeholder="https://drive.google.com/file/d/.../view"
                className="pl-9 font-mono text-xs"
                {...register('link_sertifikat')}
              />
            </div>
            {errors.link_sertifikat && (
              <p className="text-xs font-medium text-destructive">{errors.link_sertifikat.message}</p>
            )}
          </div>

          {/* Surat Tugas Mahasiswa (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="link_surat_tugas_mahasiswa" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>
                Tautan SK / Surat Tugas Mahasiswa <span className="text-destructive font-bold">*</span>
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">Dokumen Wajib</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="link_surat_tugas_mahasiswa"
                placeholder="https://drive.google.com/... (SK Mahasiswa)"
                className="pl-9 font-mono text-xs"
                {...register('link_surat_tugas_mahasiswa')}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tautan SK / Surat Tugas keikutsertaan kompetisi yang diterbitkan oleh Dekanat / Fakultas / Rektorat.
            </p>
            {errors.link_surat_tugas_mahasiswa && (
              <p className="text-xs font-medium text-destructive">
                {errors.link_surat_tugas_mahasiswa.message}
              </p>
            )}
          </div>

          {/* Surat Tugas Dosen Pembimbing (Required) */}
          <div className="space-y-1.5">
            <Label htmlFor="link_surat_tugas_dosen" className="text-xs font-semibold text-slate-800 dark:text-slate-200 flex items-center justify-between">
              <span>
                Tautan SK / Surat Tugas Dosen Pembimbing <span className="text-destructive font-bold">*</span>
              </span>
              <span className="text-[11px] font-normal text-muted-foreground">Dokumen Wajib</span>
            </Label>
            <div className="relative">
              <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="link_surat_tugas_dosen"
                placeholder="https://drive.google.com/... (SK Dosen Pembimbing)"
                className="pl-9 font-mono text-xs"
                {...register('link_surat_tugas_dosen')}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Tautan SK / Surat Tugas penunjukan Dosen Pembimbing lomba.
            </p>
            {errors.link_surat_tugas_dosen && (
              <p className="text-xs font-medium text-destructive">
                {errors.link_surat_tugas_dosen.message}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Link Poster (Wajib) */}
            <div className="space-y-1.5">
              <Label htmlFor="link_poster">
                Tautan Poster Kegiatan Lomba <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link_poster"
                  placeholder="https://drive.google.com/... atau tautan poster lomba"
                  className="pl-9 font-mono text-xs"
                  {...register('link_poster')}
                />
              </div>
              {errors.link_poster && (
                <p className="text-xs font-medium text-destructive">{errors.link_poster.message}</p>
              )}
            </div>

            {/* Link Publikasi Medsos (Wajib) */}
            <div className="space-y-1.5">
              <Label htmlFor="link_sosmed">
                Tautan Publikasi Media Sosial <span className="text-destructive">*</span>
              </Label>
              <div className="relative">
                <LinkIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="link_sosmed"
                  placeholder="https://instagram.com/p/... atau berita web resmi"
                  className="pl-9 font-mono text-xs"
                  {...register('link_sosmed')}
                />
              </div>
              {errors.link_sosmed && (
                <p className="text-xs font-medium text-destructive">{errors.link_sosmed.message}</p>
              )}
            </div>
          </div>

          {/* Keterangan Tambahan */}
          <div className="space-y-1.5">
            <Label htmlFor="keterangan">Catatan / Keterangan Tambahan (Opsional)</Label>
            <Textarea
              id="keterangan"
              placeholder="Tambahkan catatan khusus untuk dosen verifikator apabila diperlukan..."
              rows={3}
              {...register('keterangan')}
            />
          </div>
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2">
          <ArrowLeft className="w-4 h-4" /> Kembali
        </Button>
        <Button type="submit" className="gap-2">
          Lanjut ke Pilihan Mata Kuliah <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default StepDokumen;

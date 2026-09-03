import React, { useState } from 'react';
import {
  BookOpen,
  ArrowRight,
  ArrowLeft,
  Info,
  CheckCircle2,
  AlertCircle,
  Clock,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { cn } from '@/lib/utils/cn';
import { useAuth } from '@/lib/hooks/useAuth';
import { useMataKuliah } from '@/lib/hooks/useRefData';
import type { MataKuliah, MatriksKonversi } from '@/types';

interface StepMataKuliahProps {
  bidangId: number;
  matriks: MatriksKonversi | null;
  studentSemester: number;
  initialSelectedIds: number[];
  onNext: (selectedIds: number[], selectedMks: MataKuliah[]) => void;
  onBack: () => void;
}

export const StepMataKuliah: React.FC<StepMataKuliahProps> = ({
  bidangId,
  matriks,
  studentSemester,
  initialSelectedIds,
  onNext,
  onBack,
}) => {
  const { user } = useAuth();
  const prodiId = user?.prodi?.id;
  const { data: mataKuliahList = [], isLoading } = useMataKuliah(bidangId, prodiId);

  const [selectedIds, setSelectedIds] = useState<number[]>(initialSelectedIds);

  const hasConversion = Boolean(matriks && matriks.min_sks !== null && matriks.max_sks !== null);
  const minSks = matriks?.min_sks ?? 0;
  const maxSks = matriks?.max_sks ?? 0;

  const selectedMks = mataKuliahList.filter((mk) => selectedIds.includes(mk.id));
  const currentTotalSks = selectedMks.reduce((sum, mk) => sum + (mk.sks || 0), 0);

  // Aturan Fleksibel: Mahasiswa boleh tidak memilih (0 SKS) atau memilih di bawah min_sks jika sisa MK kurikulum sedikit.
  // Satu-satunya larangan adalah tidak boleh melebihi maxSks.
  const isAboveMax = hasConversion && maxSks > 0 && currentTotalSks > maxSks;
  const isBelowMin = hasConversion && currentTotalSks > 0 && currentTotalSks < minSks;
  const isZeroSelected = selectedIds.length === 0;
  const isFullRange = hasConversion && currentTotalSks >= minSks && currentTotalSks <= maxSks;

  const handleToggle = (mk: MataKuliah, isLocked: boolean, wouldExceed: boolean) => {
    if (isLocked) return;

    setSelectedIds((prev) => {
      if (prev.includes(mk.id)) {
        return prev.filter((id) => id !== mk.id);
      } else {
        if (wouldExceed) return prev;
        return [...prev, mk.id];
      }
    });
  };

  const handleReset = () => {
    setSelectedIds([]);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isAboveMax) return;
    onNext(selectedIds, selectedMks);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="p-6 space-y-5">
          <div className="border-b border-slate-100 dark:border-slate-800 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" /> Pilihan Mata Kuliah Konversi
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Pilih mata kuliah yang relevan dengan bidang lomba pada Program Studi{' '}
                <strong>{user?.prodi?.nama || 'Anda'}</strong>. Bersifat opsional jika sudah pernah Anda tempuh.
              </p>
            </div>
            {hasConversion && (
              <Badge variant="outline" className="text-xs self-start sm:self-center font-mono dark:border-slate-800">
                Batas Kuota: Maks {maxSks} SKS
              </Badge>
            )}
          </div>

          {/* Mode Tanpa Konversi SKS (Partisipasi / Mendaftar) */}
          {!hasConversion ? (
            <div className="p-5 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900/50 rounded-2xl space-y-2">
              <div className="flex items-center gap-2 text-sm font-bold text-blue-950 dark:text-blue-200">
                <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 shrink-0" />
                Pencatatan Partisipasi Prestasi (Tanpa Konversi SKS)
              </div>
              <p className="text-xs text-blue-900 dark:text-blue-300 leading-relaxed">
                Capaian perlombaan yang Anda ajukan dicatat resmi oleh fakultas sebagai rekapitulasi keikutsertaan kompetisi mahasiswa. Tidak ada mata kuliah konversi SKS kurikulum untuk capaian ini.
              </p>
              <p className="text-xs text-blue-800 dark:text-blue-400 font-medium">
                Anda dapat langsung melanjutkan ke langkah berikutnya untuk meninjau dan mengirimkan pengajuan.
              </p>
            </div>
          ) : (
            <>
              {/* SKS Summary Status Card */}
              <div
                className={cn(
                  'p-4 rounded-2xl border transition-all duration-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3',
                  isAboveMax
                    ? 'bg-rose-50/80 dark:bg-rose-950/40 border-rose-200 dark:border-rose-900/50 text-rose-950 dark:text-rose-200'
                    : isZeroSelected
                    ? 'bg-slate-50 dark:bg-slate-800/60 border-slate-200/80 dark:border-slate-800 text-slate-900 dark:text-slate-100'
                    : isBelowMin
                    ? 'bg-blue-50/80 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/50 text-blue-950 dark:text-blue-200'
                    : 'bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/50 text-emerald-950 dark:text-emerald-200'
                )}
              >
                <div className="flex items-center gap-3">
                  <div
                    className={cn(
                      'w-10 h-10 rounded-full flex items-center justify-center shrink-0 font-bold',
                      isAboveMax
                        ? 'bg-rose-600 text-white'
                        : isZeroSelected
                        ? 'bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-200'
                        : isBelowMin
                        ? 'bg-blue-600 text-white'
                        : 'bg-emerald-600 text-white'
                    )}
                  >
                    {isAboveMax ? (
                      <AlertCircle className="w-5 h-5" />
                    ) : isZeroSelected ? (
                      <Info className="w-5 h-5" />
                    ) : (
                      <CheckCircle2 className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-base">
                        Total SKS Terpilih: {currentTotalSks} SKS
                      </span>
                      {isZeroSelected && (
                        <Badge variant="outline" className="bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 dark:border-slate-700">
                          Lewati Konversi (0 SKS)
                        </Badge>
                      )}
                      {isBelowMin && (
                        <Badge className="bg-blue-600 text-white hover:bg-blue-600">
                          Sesuai Kebutuhan ({currentTotalSks} SKS)
                        </Badge>
                      )}
                      {isFullRange && (
                        <Badge className="bg-emerald-600 text-white hover:bg-emerald-600">
                          Rentang Penuh ({minSks} - {maxSks} SKS)
                        </Badge>
                      )}
                      {isAboveMax && (
                        <Badge className="bg-rose-600 text-white hover:bg-rose-600">
                          Melebihi Maksimal
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs opacity-85 mt-0.5">
                      {isZeroSelected
                        ? 'Anda dapat melewati langkah ini jika seluruh mata kuliah terkait sudah pernah Anda tempuh di semester sebelumnya.'
                        : isBelowMin
                        ? `Diperbolehkan mengambil di bawah kuota capaian (${minSks}-${maxSks} SKS) apabila sisa mata kuliah yang belum Anda tempuh kurang dari kuota tersebut.`
                        : `Sesuai batas kuota capaian prestasi (Maksimal ${maxSks} SKS, Prediksi Nilai: ${matriks?.huruf_nilai || '-'}).`}
                    </p>
                  </div>
                </div>

                {/* Reset button if selected */}
                {!isZeroSelected && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={handleReset}
                    className="text-xs h-7 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 dark:hover:bg-slate-800 gap-1 shrink-0"
                  >
                    <RotateCcw className="w-3.5 h-3.5" /> Kosongkan Pilihan
                  </Button>
                )}
              </div>

              {/* Semester Info Badge */}
              <div className="text-xs text-slate-600 dark:text-slate-400 flex items-center gap-2 bg-slate-50 dark:bg-slate-850 p-2.5 rounded-xl border border-slate-200/80 dark:border-slate-800">
                <Info className="w-4 h-4 text-slate-500 shrink-0" />
                <span>
                  Status Anda saat ini: <strong>Semester {studentSemester}</strong>.{' '}
                  {studentSemester > 1
                    ? 'Mata kuliah bertanda (Semester 1) telah ditempuh dan tidak dapat dipilih kembali.'
                    : 'Anda dapat memilih mata kuliah Semester 1 maupun mata kuliah umum bidang ini.'}
                </span>
              </div>

              {/* List of Mata Kuliah */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Daftar Mata Kuliah yang Relevan dengan Bidang Ini:
                  </Label>
                  <span className="text-[11px] text-muted-foreground">
                    Centang mata kuliah yang belum Anda tempuh (atau biarkan kosong jika sudah ditempuh semua)
                  </span>
                </div>

                {isLoading ? (
                  <div className="p-8 text-center bg-slate-50 dark:bg-slate-900 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
                    <Clock className="w-6 h-6 animate-spin mx-auto text-primary mb-2" />
                    <p className="text-xs text-muted-foreground">Memuat daftar mata kuliah...</p>
                  </div>
                ) : mataKuliahList.length === 0 ? (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Tidak Ada Mata Kuliah yang Dipetakan</AlertTitle>
                    <AlertDescription className="text-xs">
                      Belum ada mata kuliah program studi Anda yang dipetakan untuk bidang lomba ini.
                      Anda tetap dapat melanjutkan pengajuan tanpa konversi SKS.
                    </AlertDescription>
                  </Alert>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-96 overflow-y-auto pr-1">
                    {mataKuliahList.map((mk) => {
                      const isChecked = selectedIds.includes(mk.id);
                      // Semester constraint rule: If student is semester > 1, courses designated for semester 1 cannot be re-taken
                      const isLockedBySemester = Boolean(studentSemester > 1 && mk.semester === 1);
                      // SKS constraint rule: cannot exceed maxSks
                      const wouldExceed = Boolean(!isChecked && maxSks > 0 && currentTotalSks + mk.sks > maxSks);

                      return (
                        <div
                          key={mk.id}
                          onClick={() => handleToggle(mk, isLockedBySemester, wouldExceed)}
                          className={cn(
                            'p-3.5 rounded-2xl border transition-all flex items-start gap-3',
                            isLockedBySemester
                              ? 'bg-slate-50/80 dark:bg-slate-900/60 border-slate-200/60 dark:border-slate-800 opacity-60 cursor-not-allowed'
                              : wouldExceed
                              ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/60 dark:border-slate-800 opacity-70 cursor-not-allowed'
                              : isChecked
                              ? 'bg-blue-50/60 dark:bg-blue-950/40 border-primary ring-1 ring-primary/40 shadow-sm cursor-pointer select-none'
                              : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 hover:bg-slate-50/50 dark:hover:bg-slate-850 cursor-pointer select-none shadow-soft-sm'
                          )}
                        >
                          <Checkbox
                            id={`mk-${mk.id}`}
                            checked={isChecked}
                            disabled={isLockedBySemester || wouldExceed}
                            onCheckedChange={() => handleToggle(mk, isLockedBySemester, wouldExceed)}
                            className="mt-0.5"
                          />
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between gap-2">
                              <span className="font-mono text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                {mk.kode_mk}
                              </span>
                              <span className="font-bold text-xs px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded text-slate-800 dark:text-slate-200 shrink-0">
                                {mk.sks} SKS
                              </span>
                            </div>
                            <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mt-1 leading-snug">
                              {mk.nama_mk}
                            </h4>
                            <div className="flex items-center gap-1.5 flex-wrap mt-1">
                              {mk.semester && (
                                <span className="text-[10px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-1.5 py-0.5 rounded">
                                  Semester {mk.semester}
                                </span>
                              )}
                              {isLockedBySemester && (
                                <Badge variant="secondary" className="text-[10px] bg-rose-50 dark:bg-rose-950/40 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-900/50 gap-1">
                                  <Lock className="w-2.5 h-2.5" /> Khusus Mahasiswa Sem 1
                                </Badge>
                              )}
                              {wouldExceed && !isLockedBySemester && (
                                <span className="text-[10px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-1.5 py-0.5 rounded border border-amber-200 dark:border-amber-900/50 font-medium">
                                  +{mk.sks} SKS Melebihi Maksimal
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Action Buttons */}
      <div className="flex items-center justify-between">
        <Button type="button" variant="outline" onClick={onBack} className="gap-2 dark:border-slate-800 dark:hover:bg-slate-800">
          <ArrowLeft className="w-4 h-4" /> Kembali ke Dokumen
        </Button>
        <Button
          type="submit"
          disabled={isAboveMax}
          className="gap-2 shadow-sm"
        >
          {isZeroSelected ? 'Lanjut Tanpa Konversi SKS' : 'Lanjut ke Review & Submit'}{' '}
          <ArrowRight className="w-4 h-4" />
        </Button>
      </div>
    </form>
  );
};

export default StepMataKuliah;

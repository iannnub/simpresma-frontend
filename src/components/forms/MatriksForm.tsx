import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Loader2, Sliders, AlertCircle } from 'lucide-react';
import type { MatriksItem } from '@/types';

interface MatriksFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: MatriksItem | null;
  isLoading: boolean;
  onSave: (id: number, data: { min_sks: number | null; max_sks: number | null; huruf_nilai: string | null }) => void;
}

export const MatriksForm: React.FC<MatriksFormProps> = ({
  open,
  onOpenChange,
  item,
  isLoading,
  onSave,
}) => {
  const [isValidCombination, setIsValidCombination] = useState<boolean>(true);
  const [minSks, setMinSks] = useState<string>('');
  const [maxSks, setMaxSks] = useState<string>('');
  const [hurufNilai, setHurufNilai] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    if (item) {
      const hasConversion = item.min_sks !== null && item.max_sks !== null;
      setIsValidCombination(hasConversion);
      setMinSks(item.min_sks !== null ? String(item.min_sks) : '');
      setMaxSks(item.max_sks !== null ? String(item.max_sks) : '');
      setHurufNilai(item.huruf_nilai || '');
      setErrorMsg(null);
    }
  }, [item, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!item) return;

    if (!isValidCombination) {
      onSave(item.id, {
        min_sks: null,
        max_sks: null,
        huruf_nilai: null,
      });
      return;
    }

    const min = parseInt(minSks, 10);
    const max = parseInt(maxSks, 10);

    if (isNaN(min) || min < 0) {
      setErrorMsg('Min SKS harus berupa angka positif.');
      return;
    }
    if (isNaN(max) || max < 0) {
      setErrorMsg('Max SKS harus berupa angka positif.');
      return;
    }
    if (max < min) {
      setErrorMsg('Maksimum SKS harus lebih besar atau sama dengan Minimum SKS.');
      return;
    }
    if (!hurufNilai.trim()) {
      setErrorMsg('Huruf nilai konversi wajib diisi (contoh: A, AB, B).');
      return;
    }

    setErrorMsg(null);
    onSave(item.id, {
      min_sks: min,
      max_sks: max,
      huruf_nilai: hurufNilai.trim().toUpperCase(),
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <Sliders className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Edit Matriks Konversi SKS
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              {item?.tingkatan?.nama} - {item?.tahapan?.nama}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Checkbox: Apakah kombinasi ini berhak konversi */}
            <div className="flex items-center space-x-2 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700">
              <Checkbox
                id="is_valid_combination"
                checked={isValidCombination}
                onCheckedChange={(checked) => setIsValidCombination(Boolean(checked))}
              />
              <label
                htmlFor="is_valid_combination"
                className="text-xs font-semibold text-slate-800 dark:text-slate-200 cursor-pointer select-none"
              >
                Kombinasi ini berhak konversi SKS (Valid)
              </label>
            </div>

            {isValidCombination ? (
              <div className="space-y-3.5 animate-in fade-in-50">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <Label htmlFor="min_sks" className="text-xs">
                      Minimum SKS <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="min_sks"
                      type="number"
                      min={0}
                      max={24}
                      value={minSks}
                      onChange={(e) => setMinSks(e.target.value)}
                      placeholder="Contoh: 2"
                      className="text-xs"
                      disabled={isLoading}
                    />
                  </div>
                  <div className="space-y-1.5">
                    <Label htmlFor="max_sks" className="text-xs">
                      Maksimum SKS <span className="text-destructive">*</span>
                    </Label>
                    <Input
                      id="max_sks"
                      type="number"
                      min={0}
                      max={24}
                      value={maxSks}
                      onChange={(e) => setMaxSks(e.target.value)}
                      placeholder="Contoh: 4"
                      className="text-xs"
                      disabled={isLoading}
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="huruf_nilai" className="text-xs">
                    Huruf Nilai Konversi <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="huruf_nilai"
                    placeholder="Contoh: A, AB, B"
                    value={hurufNilai}
                    onChange={(e) => setHurufNilai(e.target.value)}
                    className="text-xs font-mono font-bold uppercase"
                    maxLength={5}
                    disabled={isLoading}
                  />
                  <p className="text-[11px] text-muted-foreground">
                    Format: A, AB, B, dsb. Sesuai standar transkrip akademik fakultas.
                  </p>
                </div>
              </div>
            ) : (
              <div className="p-3 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 rounded-xl text-xs text-rose-800 dark:text-rose-200">
                Kombinasi ini diatur sebagai <strong>tidak berlaku konversi SKS</strong> (mahasiswa dapat mencatat prestasi namun tanpa pengajuan konversi mata kuliah).
              </div>
            )}

            {errorMsg && (
              <p className="text-xs font-medium text-destructive flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {errorMsg}
              </p>
            )}
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isLoading}
              className="text-xs"
            >
              Batal
            </Button>
            <Button type="submit" disabled={isLoading} className="text-xs gap-1.5">
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                'Simpan Perubahan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default MatriksForm;

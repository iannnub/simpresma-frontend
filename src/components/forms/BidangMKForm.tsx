import React, { useState } from 'react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { BookPlus, Loader2, AlertCircle } from 'lucide-react';
import { useBidang, useProdi } from '@/lib/hooks/useRefData';
import type { AddBidangMKPayload, BidangMataKuliahItem } from '@/types';

interface BidangMKFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  existingMappings?: BidangMataKuliahItem[];
  isLoading: boolean;
  onSave: (data: AddBidangMKPayload) => void;
}

export const BidangMKForm: React.FC<BidangMKFormProps> = ({
  open,
  onOpenChange,
  existingMappings = [],
  isLoading,
  onSave,
}) => {
  const { data: bidangList = [] } = useBidang();
  const { data: prodiList = [] } = useProdi();

  const [bidangId, setBidangId] = useState<string>('');
  const [prodiId, setProdiId] = useState<string>('');
  const [mataKuliahId, setMataKuliahId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Extract unique MKs from existing mappings for convenient selection
  const knownMks = Array.from(
    new Map(
      existingMappings
        .filter((item) => item.mata_kuliah || item.mataKuliah)
        .map((item) => {
          const mk = item.mata_kuliah || item.mataKuliah!;
          return [mk.id, mk];
        })
    ).values()
  ).filter((mk) => !prodiId || String(mk.prodi_id) === prodiId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const bId = parseInt(bidangId, 10);
    const mkId = parseInt(mataKuliahId, 10);

    if (isNaN(bId) || bId <= 0) {
      setErrorMsg('Pilih bidang lomba.');
      return;
    }
    if (isNaN(mkId) || mkId <= 0) {
      setErrorMsg('Pilih atau masukkan ID mata kuliah.');
      return;
    }

    setErrorMsg(null);
    onSave({
      bidang_id: bId,
      mata_kuliah_id: mkId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <BookPlus className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-slate-100">
              Tambah Pemetaan Bidang & Mata Kuliah
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Petakan bidang lomba ke mata kuliah prodi yang relevan untuk konversi SKS.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Bidang Lomba */}
            <div className="space-y-1.5">
              <Label htmlFor="bidang_id" className="text-xs">
                Bidang Lomba <span className="text-destructive">*</span>
              </Label>
              <Select value={bidangId} onValueChange={setBidangId}>
                <SelectTrigger id="bidang_id" className="text-xs">
                  <SelectValue placeholder="Pilih Bidang Lomba" />
                </SelectTrigger>
                <SelectContent>
                  {bidangList.map((b) => (
                    <SelectItem key={b.id} value={String(b.id)}>
                      {b.nama}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Program Studi (Filter) */}
            <div className="space-y-1.5">
              <Label htmlFor="prodi_id" className="text-xs">
                Program Studi Mata Kuliah
              </Label>
              <Select value={prodiId} onValueChange={setProdiId}>
                <SelectTrigger id="prodi_id" className="text-xs">
                  <SelectValue placeholder="Pilih Program Studi" />
                </SelectTrigger>
                <SelectContent>
                  {prodiList.map((p) => (
                    <SelectItem key={p.id} value={String(p.id)}>
                      {p.nama} ({p.singkatan})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Mata Kuliah Choice */}
            {knownMks.length > 0 && (
              <div className="space-y-1.5">
                <Label className="text-xs">Pilih Mata Kuliah yang Tersedia</Label>
                <Select
                  value={mataKuliahId}
                  onValueChange={(val) => {
                    setMataKuliahId(val);
                    setErrorMsg(null);
                  }}
                >
                  <SelectTrigger className="text-xs">
                    <SelectValue placeholder="Pilih dari daftar mata kuliah..." />
                  </SelectTrigger>
                  <SelectContent>
                    {knownMks.map((mk) => (
                      <SelectItem key={mk.id} value={String(mk.id)}>
                        {mk.kode_mk} - {mk.nama_mk} ({mk.sks} SKS)
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Or Direct MK ID */}
            <div className="space-y-1.5">
              <Label htmlFor="mata_kuliah_id" className="text-xs">
                Atau Masukkan ID Mata Kuliah <span className="text-destructive">*</span>
              </Label>
              <Input
                id="mata_kuliah_id"
                type="number"
                min={1}
                placeholder="Contoh: 1"
                value={mataKuliahId}
                onChange={(e) => setMataKuliahId(e.target.value)}
                className="text-xs"
                disabled={isLoading}
              />
            </div>

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
                  Menambahkan...
                </>
              ) : (
                'Simpan Pemetaan'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default BidangMKForm;

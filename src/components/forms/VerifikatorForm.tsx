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
import { UserPlus, Loader2, AlertCircle } from 'lucide-react';
import { useProdi } from '@/lib/hooks/useRefData';
import type { AssignVerifikatorPayload } from '@/types';

interface VerifikatorFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultProdiId?: number;
  isLoading: boolean;
  onSave: (data: AssignVerifikatorPayload) => void;
}

export const VerifikatorForm: React.FC<VerifikatorFormProps> = ({
  open,
  onOpenChange,
  defaultProdiId,
  isLoading,
  onSave,
}) => {
  const { data: prodiList = [] } = useProdi();

  const [prodiId, setProdiId] = useState<string>(
    defaultProdiId ? String(defaultProdiId) : ''
  );
  const [userId, setUserId] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const pId = parseInt(prodiId, 10);
    const uId = parseInt(userId, 10);

    if (isNaN(pId) || pId <= 0) {
      setErrorMsg('Pilih program studi penugasan.');
      return;
    }
    if (isNaN(uId) || uId <= 0) {
      setErrorMsg('Masukkan User ID dosen yang valid.');
      return;
    }

    setErrorMsg(null);
    onSave({
      prodi_id: pId,
      user_id: uId,
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
              <UserPlus className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Tugaskan Dosen Verifikator
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground">
              Tetapkan dosen sebagai anggota tim verifikator resmi untuk Program Studi.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Program Studi */}
            <div className="space-y-1.5">
              <Label htmlFor="prodi_id" className="text-xs">
                Program Studi Penugasan <span className="text-destructive">*</span>
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

            {/* User ID Dosen */}
            <div className="space-y-1.5">
              <Label htmlFor="user_id" className="text-xs">
                User ID Dosen / Pengguna <span className="text-destructive">*</span>
              </Label>
              <Input
                id="user_id"
                type="number"
                min={1}
                placeholder="Contoh: 5 (ID Verifikator)"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="text-xs"
                disabled={isLoading}
              />
              <p className="text-[11px] text-muted-foreground">
                Sistem akan secara otomatis menyematkan hak akses (role) <strong>Verifikator</strong>{' '}
                kepada pengguna ini dan meregistrasikannya ke dalam scope prodi terpilih.
              </p>
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
                  Menugaskan...
                </>
              ) : (
                'Tugaskan Verifikator'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default VerifikatorForm;

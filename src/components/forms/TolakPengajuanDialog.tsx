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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { XCircle, Loader2, AlertCircle } from 'lucide-react';
import type { Pengajuan } from '@/types';

interface TolakPengajuanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pengajuan: Pengajuan | null;
  isLoading: boolean;
  onConfirm: (feedback: string) => void;
}

export const TolakPengajuanDialog: React.FC<TolakPengajuanDialogProps> = ({
  open,
  onOpenChange,
  pengajuan,
  isLoading,
  onConfirm,
}) => {
  const [feedback, setFeedback] = useState<string>('');
  const [validationError, setValidationError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedback || feedback.trim().length < 10) {
      setValidationError('Alasan penolakan (feedback) wajib diisi minimal 10 karakter.');
      return;
    }
    setValidationError(null);
    onConfirm(feedback.trim());
  };

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFeedback('');
      setValidationError(null);
    }
    onOpenChange(newOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <div className="w-12 h-12 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <XCircle className="w-6 h-6" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900">
              Tolak Pengajuan Prestasi
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Anda akan menolak pengajuan{' '}
              <strong className="text-slate-800">#{pengajuan?.id} - {pengajuan?.nama_lomba}</strong>.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-1.5">
              <Label htmlFor="feedback_verifikator" className="text-xs font-semibold">
                Alasan Penolakan / Catatan Revisi <span className="text-destructive">*</span>
              </Label>
              <Textarea
                id="feedback_verifikator"
                placeholder="Jelaskan alasan penolakan secara jelas (contoh: sertifikat tidak mencantumkan nama peserta, mata kuliah yang dipilih tidak sesuai bidang, dll)..."
                rows={4}
                value={feedback}
                onChange={(e) => {
                  setFeedback(e.target.value);
                  if (e.target.value.trim().length >= 10) {
                    setValidationError(null);
                  }
                }}
                disabled={isLoading}
                className="text-xs"
              />
              <div className="flex justify-between items-center text-[11px] text-muted-foreground">
                <span>Minimal 10 karakter</span>
                <span>{feedback.length} / 1000</span>
              </div>
              {validationError && (
                <p className="text-xs font-medium text-destructive flex items-center gap-1 mt-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {validationError}
                </p>
              )}
            </div>
          </div>

          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isLoading}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="submit"
              variant="destructive"
              disabled={isLoading}
              className="text-xs gap-1.5 bg-rose-600 hover:bg-rose-700"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Menolak...
                </>
              ) : (
                <>
                  <XCircle className="w-3.5 h-3.5" />
                  Tolak Pengajuan
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default TolakPengajuanDialog;

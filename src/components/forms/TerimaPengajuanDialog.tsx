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
import { CheckCircle2, Loader2, Sparkles, MessageSquare } from 'lucide-react';
import type { Pengajuan } from '@/types';

interface TerimaPengajuanDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pengajuan: Pengajuan | null;
  isLoading: boolean;
  onConfirm: (feedback?: string) => void;
}

export const TerimaPengajuanDialog: React.FC<TerimaPengajuanDialogProps> = ({
  open,
  onOpenChange,
  pengajuan,
  isLoading,
  onConfirm,
}) => {
  const [feedback, setFeedback] = useState<string>('');

  const handleOpenChange = (newOpen: boolean) => {
    if (!newOpen) {
      setFeedback('');
    }
    onOpenChange(newOpen);
  };

  const handleConfirm = () => {
    onConfirm(feedback.trim() || undefined);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mb-2">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <DialogTitle className="text-lg font-bold text-slate-900">
            Konfirmasi Terima Pengajuan
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
            Anda akan menyetujui pengajuan prestasi{' '}
            <strong className="text-slate-800">#{pengajuan?.id} - {pengajuan?.nama_lomba}</strong>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl space-y-1.5 text-emerald-900">
            <div className="font-semibold flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Penguncian Matriks Konversi (Snapshot)
            </div>
            <p className="leading-relaxed opacity-90">
              Saat Anda menyetujui pengajuan ini, sistem akan mengunci snapshot matriks SKS dan grade
              saat ini secara permanen. Pengajuan akan diteruskan ke antrean Tendik untuk tahap finalisasi
              SK.
            </p>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="terima_feedback" className="font-semibold text-slate-800 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
              Catatan / Feedback Verifikator (Opsional)
            </Label>
            <Textarea
              id="terima_feedback"
              placeholder="Contoh: Berkas dan tautan SK telah diperiksa dan disetujui untuk konversi SKS mata kuliah terkait..."
              rows={3}
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              disabled={isLoading}
              className="text-xs resize-none"
            />
            <p className="text-[11px] text-muted-foreground">
              Catatan ini akan tampil pada riwayat mahasiswa dan dikirimkan lewat notifikasi bot Telegram.
            </p>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-2">
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
            type="button"
            onClick={handleConfirm}
            disabled={isLoading}
            className="text-xs bg-emerald-600 hover:bg-emerald-700 gap-1.5 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Memproses...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-3.5 h-3.5" />
                Ya, Setujui & Terima
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TerimaPengajuanDialog;

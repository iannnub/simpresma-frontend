import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Users,
  UserPlus,
  UserX,
  ShieldCheck,
  Building2,
  Mail,
  Phone,
  AlertTriangle,
  Loader2,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import VerifikatorForm from '@/components/forms/VerifikatorForm';
import { useProdi } from '@/lib/hooks/useRefData';
import {
  useVerifikatorList,
  useAssignVerifikator,
  useCabutVerifikator,
} from '@/lib/hooks/useWadek';
import type { VerifikatorProdiItem, AssignVerifikatorPayload } from '@/types';

export default function WadekVerifikatorPage() {
  const { data: prodiList = [] } = useProdi();
  const { data: verifikatorList = [], isLoading } = useVerifikatorList();

  const assignMutation = useAssignVerifikator();
  const cabutMutation = useCabutVerifikator();

  const [activeTabProdiId, setActiveTabProdiId] = useState<number | null>(null);
  const [isAssignOpen, setIsAssignOpen] = useState<boolean>(false);
  const [cabutTarget, setCabutTarget] = useState<VerifikatorProdiItem | null>(null);

  // Default active tab to first prodi if not chosen
  const currentProdiId = activeTabProdiId || prodiList[0]?.id || 1;

  // Filter verifikator for this prodi tab
  const verifikatorsInProdi = verifikatorList.filter(
    (v) => v.prodi_id === currentProdiId && v.is_active === 1
  );

  const handleAssign = async (payload: AssignVerifikatorPayload) => {
    try {
      await assignMutation.mutateAsync(payload);
      toast.success('Verifikator Berhasil Ditugaskan', {
        description: 'Dosen yang bersangkutan kini memiliki hak akses verifikasi pengajuan.',
      });
      setIsAssignOpen(false);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal menugaskan verifikator.';
      toast.error('Gagal Menugaskan', { description: errorMsg });
    }
  };

  const handleConfirmCabut = async () => {
    if (!cabutTarget) return;
    try {
      await cabutMutation.mutateAsync(cabutTarget.id);
      toast.success('Penugasan Verifikator Berhasil Dicabut', {
        description: `Dosen ${cabutTarget.user?.nama} tidak lagi menjadi verifikator pada prodi ini.`,
      });
      setCabutTarget(null);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal mencabut penugasan verifikator.';
      toast.error('Gagal Mencabut', { description: errorMsg });
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">
            Kelola Tim Verifikator Prodi
          </h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Atur dan tetapkan dosen penilai/verifikator prestasi mahasiswa untuk setiap program studi di
            fakultas.
          </p>
        </div>
        <div>
          <Button onClick={() => setIsAssignOpen(true)} className="gap-2 shadow-sm">
            <UserPlus className="w-4 h-4" />
            Tugaskan Verifikator
          </Button>
        </div>
      </div>

      {/* Prodi Tabs Bar */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {prodiList.map((prodi) => {
          const isActive = prodi.id === currentProdiId;
          const count = verifikatorList.filter(
            (v) => v.prodi_id === prodi.id && v.is_active === 1
          ).length;

          return (
            <button
              key={prodi.id}
              onClick={() => setActiveTabProdiId(prodi.id)}
              className={`px-4 py-2.5 text-xs font-semibold rounded-t-xl transition-all flex items-center gap-2 border-b-2 whitespace-nowrap ${
                isActive
                  ? 'border-primary text-primary bg-primary/5 font-bold'
                  : 'border-transparent text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Building2 className="w-3.5 h-3.5" />
              <span>
                {prodi.nama} ({prodi.singkatan})
              </span>
              <span
                className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                  isActive ? 'bg-primary text-white' : 'bg-slate-200 text-slate-700'
                }`}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Card Table */}
      <Card className="border-slate-200 shadow-sm">
        <CardHeader className="pb-3 border-b border-slate-100 flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Daftar Verifikator Aktif</CardTitle>
            <CardDescription className="text-xs">
              Program Studi{' '}
              {prodiList.find((p) => p.id === currentProdiId)?.nama || 'Terpilih'}
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="p-12 text-center bg-white">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Memuat tim verifikator...</p>
            </div>
          ) : verifikatorsInProdi.length === 0 ? (
            <div className="text-center py-14 px-4 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 space-y-3">
              <ShieldCheck className="w-10 h-10 text-slate-300 mx-auto" />
              <h4 className="text-sm font-semibold text-slate-800">
                Belum Ada Verifikator Ditugaskan
              </h4>
              <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                Program studi ini belum memiliki dosen verifikator aktif. Silakan tugaskan dosen
                untuk mulai memproses pengajuan.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAssignOpen(true)}
                className="text-xs gap-1.5"
              >
                <UserPlus className="w-3.5 h-3.5" /> Tugaskan Dosen Sekarang
              </Button>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50 text-xs">
                  <TableRow>
                    <TableHead>Nama Dosen Verifikator</TableHead>
                    <TableHead>NIP / Identitas</TableHead>
                    <TableHead>Kontak WhatsApp</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {verifikatorsInProdi.map((item) => (
                    <TableRow key={item.id} className="hover:bg-slate-50/80 text-xs">
                      <TableCell>
                        <div className="font-bold text-slate-900">{item.user?.nama || '-'}</div>
                        <div className="text-[11px] text-muted-foreground">
                          User ID: #{item.user_id}
                        </div>
                      </TableCell>
                      <TableCell className="font-mono text-slate-700 font-medium">
                        {item.user?.nim_nip || '-'}
                      </TableCell>
                      <TableCell>
                        {item.user?.no_whatsapp ? (
                          <span className="font-mono text-emerald-700 flex items-center gap-1 font-medium">
                            <Phone className="w-3 h-3" />
                            {item.user.no_whatsapp}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        {item.user?.email ? (
                          <span className="text-slate-600 flex items-center gap-1">
                            <Mail className="w-3 h-3" />
                            {item.user.email}
                          </span>
                        ) : (
                          <span className="text-slate-400 font-mono">-</span>
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 hover:bg-emerald-100">
                          Aktif Bertugas
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => setCabutTarget(item)}
                          className="h-8 px-2 text-xs gap-1 text-rose-600 hover:bg-rose-50 hover:text-rose-700"
                        >
                          <UserX className="w-3.5 h-3.5" /> Cabut
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Assign Verifikator Dialog */}
      <VerifikatorForm
        open={isAssignOpen}
        onOpenChange={setIsAssignOpen}
        defaultProdiId={currentProdiId}
        isLoading={assignMutation.isPending}
        onSave={handleAssign}
      />

      {/* Confirmation Cabut Dialog */}
      <Dialog open={Boolean(cabutTarget)} onOpenChange={(open) => !open && setCabutTarget(null)}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center mb-2">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900">
              Cabut Penugasan Verifikator
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Anda yakin ingin mencabut status verifikator untuk dosen{' '}
              <strong className="text-slate-800">{cabutTarget?.user?.nama}</strong> pada Program
              Studi {cabutTarget?.prodi?.nama}?
            </DialogDescription>
          </DialogHeader>

          <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-900">
            Dosen yang dicabut tidak akan lagi dapat memverifikasi pengajuan mahasiswa dari Program
            Studi ini.
          </div>

          <DialogFooter className="gap-2 sm:gap-0 mt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setCabutTarget(null)}
              disabled={cabutMutation.isPending}
              className="text-xs"
            >
              Batal
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleConfirmCabut}
              disabled={cabutMutation.isPending}
              className="text-xs gap-1.5 bg-rose-600 hover:bg-rose-700"
            >
              {cabutMutation.isPending ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  Mencabut...
                </>
              ) : (
                <>
                  <UserX className="w-3.5 h-3.5" />
                  Ya, Cabut Penugasan
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

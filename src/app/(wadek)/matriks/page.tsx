import React, { useState } from 'react';
import { toast } from 'sonner';
import {
  Sliders,
  Edit,
  Clock,
  Sparkles,
  CheckCircle2,
  XCircle,
  Filter,
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
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import MatriksForm from '@/components/forms/MatriksForm';
import { useMatriksList, useUpdateMatriks } from '@/lib/hooks/useWadek';
import type { MatriksItem } from '@/types';
import { format } from 'date-fns';
import { id as localeId } from 'date-fns/locale';

export default function WadekMatriksPage() {
  const { data: matriksList = [], isLoading } = useMatriksList();
  const updateMutation = useUpdateMatriks();

  const [selectedItem, setSelectedItem] = useState<MatriksItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [filterTingkat, setFilterTingkat] = useState<string>('all');

  const filteredList =
    filterTingkat === 'all'
      ? matriksList
      : matriksList.filter((m) => String(m.tingkatan_id) === filterTingkat);

  const uniqueTingkatan = Array.from(
    new Map(
      matriksList.filter((m) => m.tingkatan).map((m) => [m.tingkatan_id, m.tingkatan!])
    ).values()
  );

  const handleOpenEdit = (item: MatriksItem) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  };

  const handleSaveMatriks = async (
    id: number,
    data: { min_sks: number | null; max_sks: number | null; huruf_nilai: string | null }
  ) => {
    try {
      await updateMutation.mutateAsync({ id, data });
      toast.success('Matriks Berhasil Diperbarui', {
        description: 'Aturan konversi SKS untuk kombinasi tersebut telah diperbarui secara langsung.',
      });
      setIsDialogOpen(false);
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message || err?.message || 'Gagal memperbarui matriks.';
      toast.error('Gagal Menyimpan', { description: errorMsg });
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    try {
      return format(new Date(dateStr), 'dd/MM/yyyy HH:mm', { locale: localeId });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-slate-100">
          Kelola Matriks Konversi SKS
        </h2>
        <p className="text-sm text-muted-foreground mt-0.5">
          Atur rentang SKS minimum-maksimum dan konversi huruf nilai untuk 24 kombinasi tingkatan dan
          tahapan lomba mahasiswa.
        </p>
      </div>

      <Card className="border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        <CardHeader className="pb-4 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-primary" /> Tabel Matriks Konversi Fakultas
            </CardTitle>
            <CardDescription className="text-xs">
              Menampilkan {filteredList.length} dari {matriksList.length} baris kombinasi
            </CardDescription>
          </div>

          {/* Filter Tingkatan */}
          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-slate-600 dark:text-slate-400">Tingkat:</span>
            <Select value={filterTingkat} onValueChange={setFilterTingkat}>
              <SelectTrigger className="w-[180px] h-8 text-xs">
                <SelectValue placeholder="Semua Tingkatan" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Tingkatan</SelectItem>
                {uniqueTingkatan.map((t) => (
                  <SelectItem key={t.id} value={String(t.id)}>
                    {t.nama}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardHeader>

        <CardContent className="pt-4">
          {isLoading ? (
            <div className="p-12 text-center bg-transparent">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
              <p className="mt-2 text-sm text-muted-foreground">Memuat data matriks...</p>
            </div>
          ) : (
            <div className="rounded-xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-slate-800/80 text-xs">
                  <TableRow>
                    <TableHead className="w-[60px]">No</TableHead>
                    <TableHead>Tingkatan Lomba</TableHead>
                    <TableHead>Capaian / Tahapan</TableHead>
                    <TableHead className="text-center">Rentang SKS</TableHead>
                    <TableHead className="text-center">Huruf Nilai</TableHead>
                    <TableHead>Status Konversi</TableHead>
                    <TableHead>Terakhir Diubah</TableHead>
                    <TableHead className="text-right">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredList.map((item, idx) => {
                    const isValid = item.min_sks !== null && item.max_sks !== null;
                    return (
                      <TableRow key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/50 text-xs transition-colors">
                        <TableCell className="font-mono text-slate-400 font-semibold">
                          {idx + 1}
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900 dark:text-slate-100">
                          {item.tingkatan?.nama || `Tingkatan #${item.tingkatan_id}`}
                        </TableCell>
                        <TableCell className="text-slate-700 dark:text-slate-300">
                          {item.tahapan?.nama || `Tahapan #${item.tahapan_id}`}
                        </TableCell>
                        <TableCell className="text-center">
                          {isValid ? (
                            <span className="font-mono font-bold px-2 py-0.5 bg-blue-50 dark:bg-blue-950/40 text-primary dark:text-blue-300 border border-blue-200 dark:border-blue-800 rounded">
                              {item.min_sks} - {item.max_sks} SKS
                            </span>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-mono">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {isValid ? (
                            <Badge className="bg-emerald-600 text-white font-mono font-bold">
                              {item.huruf_nilai}
                            </Badge>
                          ) : (
                            <span className="text-slate-400 dark:text-slate-500 font-mono">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {isValid ? (
                            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Konversi Valid
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
                              <XCircle className="w-3.5 h-3.5" /> Tidak Ada Konversi
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="text-slate-500 dark:text-slate-400 whitespace-nowrap text-[11px]">
                          <div>{formatDate(item.updated_at)}</div>
                          {item.updatedBy && (
                            <div className="text-[10px] text-muted-foreground">
                              Oleh: {item.updatedBy.nama}
                            </div>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleOpenEdit(item)}
                            className="h-8 px-2 text-xs gap-1 text-primary hover:bg-primary/10 dark:hover:bg-primary/20"
                          >
                            <Edit className="w-3.5 h-3.5" /> Edit
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Dialog */}
      <MatriksForm
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        item={selectedItem}
        isLoading={updateMutation.isPending}
        onSave={handleSaveMatriks}
      />
    </div>
  );
}

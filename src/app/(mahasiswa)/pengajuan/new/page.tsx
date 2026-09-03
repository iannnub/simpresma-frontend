import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import PengajuanForm from '@/components/forms/PengajuanForm';

export default function MahasiswaNewPengajuanPage() {
  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" asChild className="h-9 w-9">
          <Link to="/mahasiswa/pengajuan">
            <ArrowLeft className="w-5 h-5" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900">
            Formulir Pengajuan Konversi Prestasi
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground">
            Lengkapi 4 langkah di bawah ini untuk mengajukan konversi SKS mata kuliah.
          </p>
        </div>
      </div>

      {/* Multi-step Form */}
      <PengajuanForm />
    </div>
  );
}

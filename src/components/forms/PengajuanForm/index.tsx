import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

import StepIndicator from './StepIndicator';
import StepLombaInfo from './StepLombaInfo';
import StepDokumen from './StepDokumen';
import StepMataKuliah from './StepMataKuliah';
import StepPreview from './StepPreview';

import { useSubmitPengajuan } from '@/lib/hooks/usePengajuan';
import type {
  StepLombaInfoFormData,
  StepDokumenFormData,
} from '@/lib/schemas/pengajuan.schema';
import type { MatriksKonversi, MataKuliah, SubmitPengajuanPayload } from '@/types';

export function PengajuanForm() {
  const navigate = useNavigate();
  const submitMutation = useSubmitPengajuan();

  const [currentStep, setCurrentStep] = useState<number>(1);

  // Form State across steps
  const [lombaData, setLombaData] = useState<StepLombaInfoFormData | null>(null);
  const [matriks, setMatriks] = useState<MatriksKonversi | null>(null);
  const [dokumenData, setDokumenData] = useState<StepDokumenFormData | null>(null);
  const [selectedMkIds, setSelectedMkIds] = useState<number[]>([]);
  const [selectedMks, setSelectedMks] = useState<MataKuliah[]>([]);

  const hasConversion = Boolean(matriks && matriks.min_sks !== null && matriks.max_sks !== null);

  // Step 1 -> Step 2
  const handleStep1Next = (
    data: StepLombaInfoFormData,
    matriksResult: MatriksKonversi | null
  ) => {
    setLombaData(data);
    setMatriks(matriksResult);
    setCurrentStep(2);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 2 -> Step 3
  const handleStep2Next = (data: StepDokumenFormData) => {
    setDokumenData(data);
    setCurrentStep(3);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Step 3 -> Step 4
  const handleStep3Next = (ids: number[], mks: MataKuliah[]) => {
    setSelectedMkIds(ids);
    setSelectedMks(mks);
    setCurrentStep(4);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Final Submit
  const handleFinalSubmit = async () => {
    if (!lombaData || !dokumenData) {
      toast.error('Data Belum Lengkap', {
        description: 'Silakan lengkapi informasi perlombaan dan dokumen terlebih dahulu.',
      });
      return;
    }

    const payload: SubmitPengajuanPayload = {
      nama_lomba: lombaData.nama_lomba,
      nama_tim: lombaData.nama_tim || null,
      no_whatsapp: lombaData.no_whatsapp,
      bidang_id: lombaData.bidang_id,
      tingkatan_id: lombaData.tingkatan_id,
      tahapan_id: lombaData.tahapan_id,
      semester: lombaData.semester || 1,
      detail_juara: lombaData.detail_juara || null,
      mata_kuliah_ids: selectedMkIds,
      link_sertifikat: dokumenData.link_sertifikat,
      status_surat_tugas_mahasiswa: dokumenData.status_surat_tugas_mahasiswa,
      link_surat_tugas_mahasiswa: dokumenData.link_surat_tugas_mahasiswa || null,
      status_surat_tugas_dosen: dokumenData.status_surat_tugas_dosen,
      link_surat_tugas_dosen: dokumenData.link_surat_tugas_dosen || null,
      link_poster: dokumenData.link_poster,
      link_sosmed: dokumenData.link_sosmed,
      keterangan: dokumenData.keterangan || null,
    };

    try {
      await submitMutation.mutateAsync(payload);
      toast.success('Pengajuan Berhasil Dikirimkan', {
        description:
          'Pengajuan prestasi Anda telah berhasil masuk ke antrean verifikator program studi.',
      });
      navigate('/mahasiswa/pengajuan');
    } catch (err: any) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        'Gagal mengirimkan pengajuan. Silakan periksa isian data Anda.';
      toast.error('Gagal Mengajukan Prestasi', {
        description: errorMsg,
      });
    }
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* Progress Step Indicator */}
      <StepIndicator currentStep={currentStep} totalSteps={4} />

      {/* Step 1: Info Lomba */}
      {currentStep === 1 && (
        <StepLombaInfo
          initialData={lombaData || undefined}
          onNext={handleStep1Next}
        />
      )}

      {/* Step 2: Dokumen */}
      {currentStep === 2 && (
        <StepDokumen
          initialData={dokumenData || undefined}
          onNext={handleStep2Next}
          onBack={() => setCurrentStep(1)}
        />
      )}

      {/* Step 3: Mata Kuliah */}
      {currentStep === 3 && (
        <StepMataKuliah
          bidangId={lombaData?.bidang_id || 0}
          matriks={matriks}
          studentSemester={lombaData?.semester || 1}
          initialSelectedIds={selectedMkIds}
          onNext={handleStep3Next}
          onBack={() => setCurrentStep(2)}
        />
      )}

      {/* Step 4: Preview & Confirm */}
      {currentStep === 4 && lombaData && dokumenData && (
        <StepPreview
          lombaData={lombaData}
          dokumenData={dokumenData}
          selectedMks={selectedMks}
          matriks={matriks}
          isSubmitting={submitMutation.isPending}
          onBack={() => setCurrentStep(3)}
          onSubmit={handleFinalSubmit}
        />
      )}
    </div>
  );
}

export default PengajuanForm;

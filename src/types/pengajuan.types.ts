import type { Prodi, User } from './user.types';
import type { BidangLomba, TingkatanLomba, TahapanLomba } from './matriks.types';
import type { MataKuliah } from './mata-kuliah.types';

export type PengajuanStatus = 'pending' | 'diterima' | 'ditolak' | 'selesai';

export interface SnapshotMatriks {
  matriks_id?: number;
  tingkatan?: string;
  tahapan?: string;
  min_sks: number;
  max_sks: number;
  huruf_nilai: string;
}

export interface PengajuanMataKuliahItem {
  id: number;
  pengajuan_id: number;
  mata_kuliah_id: number;
  huruf_nilai: string | null;
  mata_kuliah?: MataKuliah;
}

export interface Pengajuan {
  id: number;
  user_id: number;
  prodi_id: number;
  bidang_id: number;
  tingkatan_id: number;
  tahapan_id: number;
  semester?: number | null;
  nama_tim: string | null;
  no_whatsapp: string;
  nama_lomba: string;
  detail_juara: string | null;
  link_sertifikat: string;
  status_surat_tugas_mahasiswa: boolean | number;
  link_surat_tugas_mahasiswa: string | null;
  status_surat_tugas_dosen: boolean | number;
  link_surat_tugas_dosen: string | null;
  link_poster: string | null;
  link_sosmed: string | null;
  keterangan: string | null;
  status: PengajuanStatus;
  feedback_verifikator: string | null;
  link_sk_konversi: string | null;
  snapshot_min_sks?: number | null;
  snapshot_max_sks?: number | null;
  snapshot_huruf_nilai?: string | null;
  verified_at?: string | null;
  processed_at?: string | null;
  tendik_id?: number | null;
  verifikator_id?: number | null;
  created_at: string;
  updated_at: string;

  // Relations
  user?: User;
  mahasiswa?: User;
  prodi?: Prodi;
  bidang?: BidangLomba;
  tingkatan?: TingkatanLomba;
  tahapan?: TahapanLomba;
  mata_kuliahs?: MataKuliah[];
  pengajuan_mata_kuliahs?: PengajuanMataKuliahItem[];
  verifikator?: { id: number; nama: string };
  tendik?: { id: number; nama: string };
  snapshot_matriks?: SnapshotMatriks | null;
}

export interface SubmitPengajuanPayload {
  nama_tim?: string | null;
  no_whatsapp: string;
  nama_lomba: string;
  bidang_id: number;
  tingkatan_id: number;
  tahapan_id: number;
  semester?: number | null;
  detail_juara?: string | null;
  mata_kuliah_ids?: number[];
  link_sertifikat: string;
  status_surat_tugas_mahasiswa: boolean;
  link_surat_tugas_mahasiswa?: string | null;
  status_surat_tugas_dosen: boolean;
  link_surat_tugas_dosen?: string | null;
  link_poster: string;
  link_sosmed: string;
  keterangan?: string | null;
}

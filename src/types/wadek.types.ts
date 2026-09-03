import type { TingkatanLomba, TahapanLomba, BidangLomba } from './matriks.types';
import type { Prodi, User } from './user.types';
import type { MataKuliah } from './mata-kuliah.types';

export interface MatriksItem {
  id: number;
  tingkatan_id: number;
  tahapan_id: number;
  min_sks: number | null;
  max_sks: number | null;
  huruf_nilai: string | null;
  is_active: number;
  updated_by?: number | null;
  created_at: string;
  updated_at: string;
  tingkatan?: TingkatanLomba;
  tahapan?: TahapanLomba;
  updated_by_user?: { id: number; nama: string };
  updatedBy?: { id: number; nama: string };
}

export interface UpdateMatriksPayload {
  min_sks: number | null;
  max_sks: number | null;
  huruf_nilai: string | null;
}

export interface VerifikatorProdiItem {
  id: number;
  user_id: number;
  prodi_id: number;
  assigned_by: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  user?: User;
  prodi?: Prodi;
  assigned_by_user?: { id: number; nama: string };
  assignedBy?: { id: number; nama: string };
}

export interface AssignVerifikatorPayload {
  user_id: number;
  prodi_id: number;
}

export interface BidangMataKuliahItem {
  id: number;
  bidang_id: number;
  mata_kuliah_id: number;
  is_active: number;
  created_at: string;
  updated_at: string;
  bidang?: BidangLomba;
  mata_kuliah?: MataKuliah & { prodi?: Prodi };
  mataKuliah?: MataKuliah & { prodi?: Prodi };
}

export interface AddBidangMKPayload {
  bidang_id: number;
  mata_kuliah_id: number;
}

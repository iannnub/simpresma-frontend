export interface StatusBreakdown {
  pending: number;
  diterima: number;
  ditolak: number;
  selesai: number;
}

export interface ProdiStatistik {
  prodi_id: number;
  prodi: string;
  nama_prodi: string;
  total: number;
  persentase: number;
  by_status: StatusBreakdown;
}

export interface DashboardStatistik {
  grand_total: number;
  per_prodi: ProdiStatistik[];
}

export interface DirektoriVerifikatorItem {
  id: number;
  user_id: number;
  prodi_id: number;
  is_active?: number;
  nama: string;
  nim_nip: string | null;
  email: string;
  no_whatsapp: string | null;
  prodi?: string;
  nama_prodi?: string;
}

export interface DirektoriProdiGroup {
  prodi_id: number;
  prodi: string;
  nama_prodi: string;
  jumlah: number;
  verifikators: DirektoriVerifikatorItem[];
}

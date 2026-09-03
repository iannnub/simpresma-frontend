export interface MataKuliah {
  id: number;
  prodi_id: number;
  kode_mk: string;
  nama_mk: string;
  sks: number;
  semester?: number;
  is_active?: number;
}

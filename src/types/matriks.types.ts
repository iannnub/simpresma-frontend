export interface TingkatanLomba {
  id: number;
  nama: string;
  urutan: number;
}

export interface TahapanLomba {
  id: number;
  kode: string;
  nama: string;
  urutan: number;
}

export interface BidangLomba {
  id: number;
  nama: string;
  keterangan: string | null;
}

export interface MatriksKonversi {
  id: number;
  tingkatan_id: number;
  tahapan_id: number;
  min_sks: number | null;
  max_sks: number | null;
  huruf_nilai: string | null;
  is_active?: number;
  tingkatan?: TingkatanLomba;
  tahapan?: TahapanLomba;
}

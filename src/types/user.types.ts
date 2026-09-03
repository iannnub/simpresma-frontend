export type UserRole = 'mahasiswa' | 'verifikator' | 'tendik' | 'wadek' | 'admin' | 'dosen';

export interface Prodi {
  id: number;
  kode: string;
  singkatan: string;
  nama: string;
}

export interface User {
  id: number;
  nim_nip: string | null;
  nama: string;
  email: string;
  no_whatsapp: string | null;
  prodi: Prodi | null;
  roles: UserRole[];
}

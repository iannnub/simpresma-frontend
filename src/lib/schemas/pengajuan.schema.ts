import { z } from 'zod';

const urlValidator = z
  .string()
  .trim()
  .min(1, 'Tautan URL wajib diisi')
  .url('Harus berupa tautan URL valid (contoh: https://...)');

const optionalUrlValidator = z
  .string()
  .trim()
  .optional()
  .nullable()
  .refine(
    (val) => !val || val === '' || /^https?:\/\/.+/i.test(val),
    'Harus berupa tautan URL valid yang diawali dengan http:// atau https://'
  );

// Step 1: Info Lomba Schema
export const stepLombaInfoSchema = z.object({
  nama_lomba: z
    .string()
    .min(1, 'Nama perlombaan / kegiatan wajib diisi')
    .max(200, 'Nama lomba maksimal 200 karakter'),
  nama_tim: z.string().max(150, 'Nama tim maksimal 150 karakter').optional().nullable(),
  no_whatsapp: z
    .string()
    .min(9, 'Nomor WhatsApp minimal 9 digit')
    .max(20, 'Nomor WhatsApp maksimal 20 digit')
    .regex(/^[0-9+-\s]+$/, 'Format nomor WhatsApp tidak valid'),
  bidang_id: z.coerce.number().min(1, 'Pilih bidang lomba'),
  tingkatan_id: z.coerce.number().min(1, 'Pilih tingkatan lomba'),
  tahapan_id: z.coerce.number().min(1, 'Pilih capaian / tahapan lomba'),
  semester: z.coerce.number().min(1, 'Pilih semester saat ini').max(14),
  detail_juara: z.string().max(50, 'Detail juara maksimal 50 karakter').optional().nullable(),
});

export type StepLombaInfoFormData = z.infer<typeof stepLombaInfoSchema>;

// Step 2: Dokumen Schema (Sertifikat, SK Tugas Mahasiswa, SK Dosen Pembimbing, Poster, dan Sosmed Wajib)
export const stepDokumenSchema = z.object({
  link_sertifikat: urlValidator,
  status_surat_tugas_mahasiswa: z.boolean(),
  link_surat_tugas_mahasiswa: z
    .string()
    .trim()
    .min(1, 'Tautan Surat Keputusan (SK) / Surat Tugas Mahasiswa wajib diisi')
    .url('Harus berupa tautan URL valid (contoh: https://...)'),
  status_surat_tugas_dosen: z.boolean(),
  link_surat_tugas_dosen: z
    .string()
    .trim()
    .min(1, 'Tautan Surat Keputusan (SK) / Surat Tugas Dosen Pembimbing wajib diisi')
    .url('Harus berupa tautan URL valid (contoh: https://...)'),
  link_poster: urlValidator,
  link_sosmed: urlValidator,
  keterangan: z.string().optional().nullable(),
});

export type StepDokumenFormData = z.infer<typeof stepDokumenSchema>;

// Step 3: Mata Kuliah Schema (Flexible for no-conversion participation)
export const stepMataKuliahSchema = z.object({
  mata_kuliah_ids: z.array(z.number()).default([]),
});

export type StepMataKuliahFormData = z.infer<typeof stepMataKuliahSchema>;

// Full Pengajuan Schema
export const createPengajuanSchema = z.object({
  nama_lomba: z.string().min(1).max(200),
  nama_tim: z.string().max(150).optional().nullable(),
  no_whatsapp: z.string().min(9).max(20),
  bidang_id: z.coerce.number().min(1),
  tingkatan_id: z.coerce.number().min(1),
  tahapan_id: z.coerce.number().min(1),
  semester: z.coerce.number().min(1).max(14),
  detail_juara: z.string().max(50).optional().nullable(),
  mata_kuliah_ids: z.array(z.number()).default([]),
  link_sertifikat: urlValidator,
  status_surat_tugas_mahasiswa: z.boolean(),
  link_surat_tugas_mahasiswa: z.string().trim().min(1).url(),
  status_surat_tugas_dosen: z.boolean(),
  link_surat_tugas_dosen: z.string().trim().min(1).url(),
  link_poster: urlValidator,
  link_sosmed: urlValidator,
  keterangan: z.string().optional().nullable(),
});

export type CreatePengajuanFormData = z.infer<typeof createPengajuanSchema>;

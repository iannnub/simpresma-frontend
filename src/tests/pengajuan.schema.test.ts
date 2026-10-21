import { describe, it, expect } from 'vitest';
import {
  stepLombaInfoSchema,
  stepDokumenSchema,
  stepMataKuliahSchema,
  urlValidator,
  optionalUrlValidator,
} from '../lib/schemas/pengajuan.schema';

describe('pengajuan.schema validation', () => {
  describe('urlValidator & optionalUrlValidator', () => {
    it('validates correct HTTP / HTTPS URLs', () => {
      expect(urlValidator.safeParse('https://drive.google.com/file/d/123').success).toBe(true);
      expect(urlValidator.safeParse('http://example.com/certificate.pdf').success).toBe(true);
    });

    it('rejects invalid URLs', () => {
      expect(urlValidator.safeParse('not-a-url').success).toBe(false);
      expect(urlValidator.safeParse('').success).toBe(false);
    });

    it('optionalUrlValidator permits empty or null, but validates if provided', () => {
      expect(optionalUrlValidator.safeParse(null).success).toBe(true);
      expect(optionalUrlValidator.safeParse('').success).toBe(true);
      expect(optionalUrlValidator.safeParse('https://unej.ac.id').success).toBe(true);
      expect(optionalUrlValidator.safeParse('javascript:alert(1)').success).toBe(false);
    });
  });

  describe('stepLombaInfoSchema', () => {
    const validData = {
      nama_lomba: 'Kompetisi Pemrograman Nasional 2026',
      nama_tim: 'Tim UNEJ Cyber',
      no_whatsapp: '081234567890',
      bidang_id: 1,
      tingkatan_id: 2,
      tahapan_id: 3,
      semester: 6,
      detail_juara: 'Juara 1',
    };

    it('validates complete valid form data', () => {
      const result = stepLombaInfoSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });

    it('rejects missing nama_lomba', () => {
      const result = stepLombaInfoSchema.safeParse({ ...validData, nama_lomba: '' });
      expect(result.success).toBe(false);
    });

    it('rejects invalid whatsapp number format', () => {
      const result = stepLombaInfoSchema.safeParse({ ...validData, no_whatsapp: 'invalid-phone-abc' });
      expect(result.success).toBe(false);
    });

    it('rejects semester out of 1-14 range', () => {
      const result = stepLombaInfoSchema.safeParse({ ...validData, semester: 15 });
      expect(result.success).toBe(false);
    });
  });

  describe('stepDokumenSchema', () => {
    it('validates complete required document URLs', () => {
      const docs = {
        link_sertifikat: 'https://drive.google.com/file/d/sertif1',
        status_surat_tugas_mahasiswa: true,
        link_surat_tugas_mahasiswa: 'https://drive.google.com/file/d/tugas_mhs',
        status_surat_tugas_dosen: true,
        link_surat_tugas_dosen: 'https://drive.google.com/file/d/tugas_dsn',
        link_poster: 'https://instagram.com/p/poster123',
        link_sosmed: 'https://instagram.com/p/sosmed123',
        keterangan: 'Bukti terlampir lengkap',
      };
      const result = stepDokumenSchema.safeParse(docs);
      expect(result.success).toBe(true);
    });

    it('fails when link_sertifikat is missing or invalid', () => {
      const docs = {
        link_sertifikat: 'bukan-url-valid',
        status_surat_tugas_mahasiswa: true,
        link_surat_tugas_mahasiswa: 'https://drive.google.com/file/d/tugas_mhs',
        status_surat_tugas_dosen: true,
        link_surat_tugas_dosen: 'https://drive.google.com/file/d/tugas_dsn',
        link_poster: 'https://instagram.com/p/poster123',
        link_sosmed: 'https://instagram.com/p/sosmed123',
      };
      const result = stepDokumenSchema.safeParse(docs);
      expect(result.success).toBe(false);
    });
  });

  describe('stepMataKuliahSchema', () => {
    it('accepts array of IDs or empty array for non-conversion', () => {
      expect(stepMataKuliahSchema.safeParse({ mata_kuliah_ids: [101, 102] }).success).toBe(true);
      expect(stepMataKuliahSchema.safeParse({ mata_kuliah_ids: [] }).success).toBe(true);
    });
  });
});

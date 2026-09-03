import { z } from 'zod';

export const finalisasiItemSchema = z.object({
  mk_id: z.number(),
  huruf_nilai: z.string().min(1, 'Huruf nilai wajib dipilih'),
});

export const finalisasiSchema = z.object({
  nilai_per_mk: z.array(finalisasiItemSchema).default([]),
  link_sk_konversi: z
    .string()
    .trim()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === '' || /^https?:\/\/.+/i.test(val),
      'Link SK Konversi harus berupa URL valid (contoh: https://drive.google.com/...)'
    ),
  catatan_tendik: z.string().trim().optional().nullable(),
});

export type FinalisasiFormData = z.infer<typeof finalisasiSchema>;

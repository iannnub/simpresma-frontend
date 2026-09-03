import { z } from 'zod';

export const bidangMKSchema = z.object({
  bidang_id: z.coerce.number().min(1, 'Pilih bidang lomba'),
  mata_kuliah_id: z.coerce.number().min(1, 'Pilih mata kuliah yang akan dipetakan'),
});

export type BidangMKFormData = z.infer<typeof bidangMKSchema>;

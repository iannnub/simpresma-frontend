import { z } from 'zod';

export const assignVerifikatorSchema = z.object({
  user_id: z.coerce.number().min(1, 'Pilih dosen / pengguna yang akan di-assign'),
  prodi_id: z.coerce.number().min(1, 'Pilih program studi penugasan'),
});

export type AssignVerifikatorFormData = z.infer<typeof assignVerifikatorSchema>;

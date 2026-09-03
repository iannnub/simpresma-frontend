import { z } from 'zod';

export const matriksSchema = z
  .object({
    min_sks: z.coerce.number().min(0).nullable().optional(),
    max_sks: z.coerce.number().min(0).nullable().optional(),
    huruf_nilai: z.string().max(5, 'Maksimal 5 karakter').nullable().optional(),
  })
  .refine(
    (data) => {
      if (
        data.min_sks !== null &&
        data.min_sks !== undefined &&
        data.max_sks !== null &&
        data.max_sks !== undefined
      ) {
        return data.max_sks >= data.min_sks;
      }
      return true;
    },
    {
      message: 'Maksimum SKS harus lebih besar atau sama dengan Minimum SKS',
      path: ['max_sks'],
    }
  );

export type MatriksFormData = z.infer<typeof matriksSchema>;

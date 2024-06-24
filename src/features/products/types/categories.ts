import { z } from 'zod';

const requiredError = '請填寫此欄位';

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, requiredError),
  slug: z.string().min(1, requiredError),
  parentCategory: z.number().optional(),
});

export type Category = z.infer<typeof categorySchema>;

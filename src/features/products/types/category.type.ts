import { z } from 'zod';

const requiredError = '請填寫此欄位';

export const categorySchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, requiredError),
  slug: z.string().min(1, requiredError),
  // Value should be parentCategoryId or undefined
  parentId: z.preprocess((val) => {
    if (val === '' || val === null) return undefined;
    if (typeof val === 'string') {
      const parsed = parseInt(val);
      if (!isNaN(parsed)) return parsed;
    }
    return val;
  }, z.number().optional()),
});
export type TCategory = z.infer<typeof categorySchema>;

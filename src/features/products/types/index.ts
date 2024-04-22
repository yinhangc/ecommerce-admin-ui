import { z } from 'zod';

export type OptionValue = {
  label: string;
  price: number;
};

export type Option = {
  id: string;
  name: string;
  values: OptionValue[];
  isEditing: boolean;
};

export type ProductVariant = {
  id: string;
  name: string;
  price: number;
  quantity: number;
  sku?: string;
};

const requiredError = '請填寫此欄位';
export const addProductSchema = z.object({
  name: z.string().min(1, requiredError),
  description: z.string(),
  status: z.string().refine((value) => ['active', 'inactive'].includes(value), {
    message: '無效的數值',
  }),
  images: z.any().refine(
    (value) => {
      for (const im of value) {
        if (!(im instanceof File)) return false;
      }
      return true;
    },
    {
      message: '上載的照片格式不符',
    },
  ),
  options: z.array(
    z.object({
      id: z.string().min(1, requiredError),
      name: z.string().min(1, requiredError),
      values: z
        .array(
          z.object({
            label: z.string(),
            price: z.number(),
          }),
        )
        .superRefine((values, ctx) => {
          if (values.length === 1 && values[0].label.trim() === '') {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: requiredError,
              path: [0, 'label'],
            });
          }
          for (let i = 0; i < values.length - 2; i++) {
            if (values[i].label.trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError,
                path: [i, 'label'],
              });
            }
          }
        }),
    }),
  ),
  variants: z.array(
    z.object({
      id: z.string().min(1, requiredError),
      name: z.string().min(1, requiredError),
      price: z.number().min(1, '數值不能少過1'),
      quantity: z.number().min(0, '數值不能少過0'),
      sku: z.string().optional(),
    }),
  ),
});
export type AddProductSchemaType = z.infer<typeof addProductSchema>;

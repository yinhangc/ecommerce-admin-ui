import { z } from 'zod';

export type TOptionValue = {
  value: string;
};

export type TOption = {
  id: string | number;
  label: string;
  values: TOptionValue[];
  isEditing?: boolean;
};

const requiredError = '請填寫此欄位';

// #region - have product options type
export const haveProductOptionsSchema = z.object({
  haveProductOptions: z.enum(['true', 'false']),
});

export type THaveProductOptions = z.infer<typeof haveProductOptionsSchema>;
// #endregion

// #region - product type
export const productSchema = z.object({
  id: z.number().optional(),
  name: z.string().min(1, requiredError),
  description: z.string(),
  status: z.string().refine((value) => ['ACTIVE', 'INACTIVE'].includes(value), {
    message: '無效的數值',
  }),
  categoryId: z.string().transform((val) => (val === '' ? null : Number(val))),
  images: z.any().refine(
    (value) => {
      for (const im of value) {
        if (!(im instanceof File || typeof im === 'string')) return false;
      }
      return true;
    },
    {
      message: '上載的照片格式不符',
    },
  ),
  options: z.array(
    z.object({
      id: z.string().min(1, requiredError).or(z.number()),
      label: z.string().min(1, requiredError),
      values: z
        .array(
          z.object({
            value: z.string(),
          }),
        )
        .superRefine((values, ctx) => {
          if (
            values.length === 0 ||
            (values.length === 1 && values[0].value.trim() === '')
          ) {
            ctx.addIssue({
              code: z.ZodIssueCode.custom,
              message: requiredError,
              path: [0, 'value'],
            });
          }
          for (let i = 0; i < values.length - 2; i++) {
            if (values[i].value.trim() === '') {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: requiredError,
                path: [i, 'value'],
              });
            }
          }
        }),
      isEditing: z.boolean().optional(),
    }),
  ),
  variants: z.array(
    z.object({
      id: z.string().min(1, requiredError).or(z.number()),
      name: z.string().min(1, requiredError),
      price: z
        .number({ invalid_type_error: '請輸入數值' })
        .min(1, '數值不能少過1')
        .max(9999, '數值不能大過9999'),
      quantity: z
        .number({ invalid_type_error: '請輸入數值' })
        .min(0, '數值不能少過0')
        .max(9999, '數值不能大過9999'),
      options: z.array(
        z.object({
          label: z.string().min(1, requiredError),
          value: z.string().min(1, requiredError),
        }),
      ),
      sku: z.string(),
    }),
  ),
});

export type TProduct = z.infer<typeof productSchema>;
// #endregion

import { z } from 'zod';

// #region - AddProduct
export type OptionValue = {
  value: string;
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
  options: {
    label: string;
    value: string;
  }[];
  price: number;
  quantity: number;
  sku?: string;
};

const requiredError = '請填寫此欄位';

export const haveProductOptionsSchema = z.object({
  haveProductOptions: z.enum(['true', 'false']),
});
export type HaveProductOptions = z.infer<typeof haveProductOptionsSchema>;

export const productSchema = z.object({
  name: z.string().min(1, requiredError),
  description: z.string(),
  status: z.string().refine((value) => ['ACTIVE', 'INACTIVE'].includes(value), {
    message: '無效的數值',
  }),
  images: z
    .any()
    .refine(
      (value) => {
        for (const im of value) {
          if (!(im instanceof File)) return false;
        }
        return true;
      },
      {
        message: '上載的照片格式不符',
      },
    )
    .optional(),
  imageUrls: z.array(z.string()).optional(),
  options: z.array(
    z.object({
      id: z.string().min(1, requiredError),
      name: z.string().min(1, requiredError),
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
            console.log('SUPER REFINE PROB', values);
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
      id: z.string().min(1, requiredError),
      name: z.string().min(1, requiredError),
      price: z
        .number({ invalid_type_error: '請輸入數值' })
        .min(1, '數值不能少過1'),
      quantity: z
        .number({ invalid_type_error: '請輸入數值' })
        .min(0, '數值不能少過0'),
      options: z.array(
        z.object({
          label: z.string().min(1, requiredError),
          value: z.string().min(1, requiredError),
        }),
      ),
      sku: z.string().optional(),
    }),
  ),
});
export type Product = z.infer<typeof productSchema>;
// #endregion

// #region - ListProduct
export type ListProductPayload = {
  skip: number;
  take: number;
  filter: { [key: string]: string | number };
  orderBy: { [key: string]: 'asc' | 'desc' }[];
};
export type ProductInList = {
  id: number;
  name: string;
  description: string;
  skus: {
    sku: string;
    price: number;
  }[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
};
// #endregion

import { FormInputField } from '@/components/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { ProductVariant } from '../types';
import { isEqual } from 'lodash';

type ProductVariantCombosProps = {
  variants: ProductVariant[];
  handleUpdateVariants: (variants: ProductVariant[]) => void;
};
const requiredError = '請填寫此欄位';
const schema = z.object({
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
type ProductVariantsSchemaType = z.infer<typeof schema>;

export const ProductVariantCombos: React.FC<ProductVariantCombosProps> = (
  props,
) => {
  const { variants, handleUpdateVariants } = props;
  console.log('ProductVariantCombos variants', variants);
  const { register, watch, getValues, setValue } =
    useForm<ProductVariantsSchemaType>({
      resolver: zodResolver(schema),
      defaultValues: {
        variants,
      },
    });

  useEffect(() => {
    if (!isEqual(variants, getValues().variants)) {
      setValue('variants', variants);
    }
  }, [getValues, setValue, variants]);

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('WATCH', value, name, type, getValues());
      handleUpdateVariants(value.variants as ProductVariant[]);
    });
    return () => subscription.unsubscribe();
  }, [getValues, handleUpdateVariants, watch]);

  return (
    <div className="overflow-x-scroll rounded-md border">
      <table className="min-w-full text-left">
        <thead className="border-b border-neutral-200 font-medium">
          <tr>
            <th className="px-4 py-2">Variant</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Quantity</th>
            <th className="px-4 py-2">Sku</th>
          </tr>
        </thead>
        <tbody>
          {variants?.map(({ id, name }, index) => (
            <tr key={id} className="border-b border-neutral-200">
              <td className="px-4 py-2">{name}</td>
              <td className="px-4 py-2">
                <FormInputField<ProductVariantsSchemaType>
                  register={register}
                  name={`variants.${index}.price`}
                  validationSchema={{ min: 1, valueAsNumber: true }}
                  type="number"
                  placeholder="Price"
                  classes="w-[150px] py-1 px-2"
                />
              </td>
              <td className="px-4 py-2">
                <FormInputField<ProductVariantsSchemaType>
                  register={register}
                  name={`variants.${index}.quantity`}
                  validationSchema={{ min: 0, valueAsNumber: true }}
                  type="number"
                  placeholder="Quantity"
                  classes="w-[150px] py-1 px-2"
                />
              </td>
              <td className="px-4 py-2">
                <FormInputField<ProductVariantsSchemaType>
                  register={register}
                  name={`variants.${index}.sku`}
                  placeholder="SKU"
                  classes="w-[150px] py-1 px-2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

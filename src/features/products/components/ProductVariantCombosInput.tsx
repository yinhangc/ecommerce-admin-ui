import { FormInputField } from '@/components/Form';
import { useFormContext, useWatch } from 'react-hook-form';
import { TProduct } from '../types/upsertProduct';

export const ProductVariantCombosInput = () => {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<TProduct>();

  const watchVariants = useWatch({
    control,
    name: 'variants',
  });

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
          {watchVariants?.map(({ id, name }, index) => (
            <tr key={id} className="border-b border-neutral-200">
              <td className="px-4 py-2">{name}</td>
              <td className="px-4 py-2">
                <FormInputField<TProduct>
                  register={register}
                  name={`variants.${index}.price`}
                  registerOptions={{ min: 1, valueAsNumber: true }}
                  type="number"
                  placeholder="Price"
                  classes="w-[150px] py-1 px-2"
                  error={errors?.variants?.[index]?.price}
                />
              </td>
              <td className="px-4 py-2">
                <FormInputField<TProduct>
                  register={register}
                  name={`variants.${index}.quantity`}
                  registerOptions={{ min: 0, valueAsNumber: true }}
                  type="number"
                  placeholder="Quantity"
                  classes="w-[150px] py-1 px-2"
                  error={errors?.variants?.[index]?.quantity}
                />
              </td>
              <td className="px-4 py-2">
                <FormInputField<TProduct>
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

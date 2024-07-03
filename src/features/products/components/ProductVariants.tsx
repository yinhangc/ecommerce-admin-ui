import { FormInputField, FormRadioSelect } from '@/components/Form';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartesianProduct } from 'js-combinatorics';
import { cloneDeep, find } from 'lodash';
import findIndex from 'lodash/findIndex';
import { useCallback, useEffect } from 'react';
import { useForm, useFormContext, useWatch } from 'react-hook-form';
import {
  TOption,
  TProduct,
  THaveProductOptions,
  haveProductOptionsSchema,
} from '../types/upsertProduct';
import { ProductOptionsDisplay } from './ProductOptionsDisplay';
import { ProductOptionsInput } from './ProductOptionsInput';
import { ProductVariantCombosInput } from './ProductVariantCombosInput';

type ProductVariantsProps = {
  existingData?: TProduct;
};

export const ProductVariants: React.FC<ProductVariantsProps> = (props) => {
  const { existingData } = props;
  const {
    control,
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<TProduct>();
  const {
    reset: resetHaveProductOptions,
    register: registerHaveProductOptions,
    control: controlHaveProductOptions,
  } = useForm<THaveProductOptions>({
    resolver: zodResolver(haveProductOptionsSchema),
    defaultValues: {
      haveProductOptions: 'false',
    },
  });
  const watchOptions = useWatch({
    control,
    name: 'options',
  });
  const watchHaveProductOptions = useWatch({
    control: controlHaveProductOptions,
    name: 'haveProductOptions',
  });
  const haveProductOptions = watchHaveProductOptions === 'true';

  const updateOptionsAndVariants = useCallback(
    (options: TOption[]) => {
      setValue('options', options);
      if (find(options, { isEditing: true })) return;
      // console.log('updateOptionsAndVariants', options, getValues('variants'));
      const productVariants = [];
      const groups: { [group: string]: string[] } = {};
      for (const option of options) {
        groups[option.label] = [];
        for (const { value } of option.values) groups[option.label].push(value);
      }
      const combinations = new CartesianProduct(
        ...Object.values(groups),
      ).toArray();
      for (const combo of combinations) {
        const name = combo.join(' / ');
        if (combo.join('').trim() === '') continue;
        const isVariantExist = find(getValues('variants'), { name });
        productVariants.push({
          id: Math.random().toString(36).substr(2, 5),
          name,
          options: combo.map((value, i) => ({
            label: Object.keys(groups)[i],
            value,
          })),
          price: isVariantExist?.price || 1,
          quantity: isVariantExist?.quantity || 0,
          sku: isVariantExist?.sku || '',
        });
      }
      setValue('variants', productVariants);
    },
    [getValues, setValue],
  );

  const handleAddOption = () => {
    const options = cloneDeep(getValues('options'));
    options.push({
      id: Math.random().toString(36).substr(2, 5),
      label: '',
      values: [],
      isEditing: true,
    });
    updateOptionsAndVariants(options);
  };

  const handleUpdateOption = useCallback(
    (option: TOption) => {
      const options = cloneDeep(getValues('options'));
      const index = findIndex(options, { id: option.id });
      if (index !== -1) options[index] = option;
      updateOptionsAndVariants(options);
    },
    [getValues, updateOptionsAndVariants],
  );

  const handleRemoveOption = useCallback(
    (id: string | number) => {
      const options = cloneDeep(getValues('options'));
      const index = findIndex(options, { id });
      if (index !== -1) options.splice(index, 1);
      updateOptionsAndVariants(options);
    },
    [getValues, updateOptionsAndVariants],
  );

  // subscribe to haveProductOptions change
  useEffect(() => {
    if (watchHaveProductOptions === 'false') {
      setValue('options', []);
      setValue(
        'variants',
        existingData && existingData.options.length === 0
          ? [existingData.variants[0]]
          : [
              {
                id: 'DEFAULT',
                name: 'DEFAULT',
                options: [],
                price: 1,
                quantity: 0,
                sku: '',
              },
            ],
      );
    } else {
      const haveNoExistingDataVariants =
        !existingData || existingData?.options?.length === 0;
      setValue(
        'options',
        haveNoExistingDataVariants ? [] : existingData.options,
      );
      setValue(
        'variants',
        haveNoExistingDataVariants ? [] : existingData.variants,
      );
    }
  }, [setValue, existingData, watchHaveProductOptions]);

  // set default haveProductOptions on init
  useEffect(() => {
    resetHaveProductOptions({
      haveProductOptions:
        existingData?.options && existingData.options.length > 0
          ? 'true'
          : 'false',
    });
  }, [existingData, resetHaveProductOptions]);

  return (
    <div className="flex flex-col gap-y-4">
      <FormRadioSelect<THaveProductOptions>
        name="haveProductOptions"
        register={registerHaveProductOptions}
        options={[
          { label: '產品有選項', value: 'true' },
          { label: '產品沒有選項', value: 'false' },
        ]}
      />
      {haveProductOptions && (
        <>
          {watchOptions.length > 0 && (
            <div className="flex flex-col gap-y-6">
              {watchOptions.map((option, index) =>
                option.isEditing ? (
                  <ProductOptionsInput
                    key={option.id}
                    option={option}
                    optionIndex={index}
                    handleUpdateOption={handleUpdateOption}
                    handleRemoveOption={handleRemoveOption}
                  />
                ) : (
                  <ProductOptionsDisplay
                    key={option.id}
                    option={option}
                    handleUpdateOption={handleUpdateOption}
                  ></ProductOptionsDisplay>
                ),
              )}
            </div>
          )}
          <button
            type="button"
            className="rounded border border-blue px-4 py-1 text-blue"
            onClick={handleAddOption}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            增加選項
          </button>
          <ProductVariantCombosInput />
        </>
      )}
      {!haveProductOptions && (
        <div>
          <FormInputField<TProduct>
            register={register}
            name={`variants.0.price`}
            label="價錢"
            registerOptions={{ min: 1, max: 9999, valueAsNumber: true }}
            type="number"
            placeholder="Price"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.price}
          />
          <FormInputField<TProduct>
            register={register}
            name={`variants.0.quantity`}
            label="數量"
            registerOptions={{ min: 0, max: 9999, valueAsNumber: true }}
            type="number"
            placeholder="Quantity"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.quantity}
          />
          <FormInputField<TProduct>
            register={register}
            name={`variants.0.sku`}
            label="SKU"
            placeholder="SKU"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.sku}
          />
        </div>
      )}
    </div>
  );
};

import { FormInputField, FormRadioSelect } from '@/components/Form';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { CartesianProduct } from 'js-combinatorics';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { useCallback, useEffect, useState } from 'react';
import { useForm, useFormContext } from 'react-hook-form';
import { useImmer } from 'use-immer';
import {
  HaveProductOptions,
  Option,
  Product,
  haveProductOptionsSchema,
} from '../types';
import { ProductOptionDisplay } from './ProductOptionDisplay';
import { ProductOptionInput } from './ProductOptionInput';
import { ProductVariantCombos } from './ProductVariantCombos';

export const ProductVariants = () => {
  const [options, setOptions] = useImmer<Option[]>([]);
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<Product>();
  const { register: registerHaveProductOptions, watch } =
    useForm<HaveProductOptions>({
      resolver: zodResolver(haveProductOptionsSchema),
      defaultValues: {
        haveProductOptions: 'false',
      },
    });
  const [haveProductOptions, setHaveProductOptions] = useState(false);

  const handleAddOption = () => {
    setOptions((options) => {
      options.push({
        id: Math.random().toString(36).substr(2, 5),
        name: '',
        values: [],
        isEditing: true,
      });
    });
  };

  const handleUpdateOption = useCallback(
    (option: Option) => {
      setOptions((options) => {
        const index = findIndex(options, { id: option.id });
        if (index !== -1) options[index] = option;
      });
    },
    [setOptions],
  );

  const handleRemoveOption = useCallback(
    (id: string) => {
      setOptions((options) => {
        const index = findIndex(options, { id });
        if (index !== -1) options.splice(index, 1);
      });
    },
    [setOptions],
  );

  useEffect(() => setValue('options', options), [setValue, options]);

  useEffect(() => {
    const groups: { [group: string]: string[] } = {};
    for (const option of filter(options, { isEditing: false })) {
      groups[option.name] = [];
      for (const { value } of option.values) groups[option.name].push(value);
    }
    const combinations = new CartesianProduct(
      ...Object.values(groups),
    ).toArray();
    const productVariants = [];
    for (const combo of combinations) {
      const name = combo.join(' / ');
      if (combo.join('').trim() === '') continue;
      productVariants.push({
        id: Math.random().toString(36).substr(2, 5),
        name,
        options: combo.map((value, i) => ({
          label: Object.keys(groups)[i],
          value,
        })),
        price: 1,
        quantity: 0,
        sku: '',
      });
    }
    setValue('variants', productVariants);
  }, [options, setValue]);

  useEffect(() => {
    const defaultVariantIfNoProductOptions = {
      id: Math.random().toString(36).substr(2, 5),
      name: 'default',
      options: [],
      price: 1,
      quantity: 0,
      sku: '',
    };
    if (!haveProductOptions)
      setValue('variants', [defaultVariantIfNoProductOptions]);
    const subscription = watch((value, { name, type }) => {
      if (name !== 'haveProductOptions') return;
      setOptions([]);
      if (value.haveProductOptions === 'false') {
        setValue('variants', [defaultVariantIfNoProductOptions]);
      } else {
        setValue('variants', []);
      }
      setHaveProductOptions(value.haveProductOptions === 'true');
    });
    return () => subscription.unsubscribe();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [setOptions, setValue, watch]);

  return (
    <div className="flex flex-col gap-y-4">
      <FormRadioSelect<HaveProductOptions>
        name="haveProductOptions"
        register={registerHaveProductOptions}
        options={[
          { label: '產品有選項', value: 'true' },
          { label: '產品沒有選項', value: 'false' },
        ]}
      />
      {haveProductOptions && (
        <>
          {options.length > 0 && (
            <div className="flex flex-col gap-y-6">
              {options.map((option, index) =>
                option.isEditing ? (
                  <ProductOptionInput
                    key={option.id}
                    option={option}
                    optionIndex={index}
                    handleUpdateOption={handleUpdateOption}
                    handleRemoveOption={handleRemoveOption}
                  />
                ) : (
                  <ProductOptionDisplay
                    key={option.id}
                    option={option}
                    handleUpdateOption={handleUpdateOption}
                  ></ProductOptionDisplay>
                ),
              )}
            </div>
          )}
          <button
            type="button"
            className="rounded border border-blue-600 px-4 py-1 text-blue-600"
            onClick={handleAddOption}
          >
            <FontAwesomeIcon icon={faPlus} className="mr-1" />
            增加選項
          </button>
          <ProductVariantCombos />
        </>
      )}
      {!haveProductOptions && (
        <div>
          <FormInputField<Product>
            register={register}
            name={`variants.0.price`}
            label="價錢"
            registerOptions={{ min: 1, valueAsNumber: true }}
            type="number"
            placeholder="Price"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.price}
          />
          <FormInputField<Product>
            register={register}
            name={`variants.0.quantity`}
            label="數量"
            registerOptions={{ min: 1, valueAsNumber: true }}
            type="number"
            placeholder="Quantity"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.price}
          />
          <FormInputField<Product>
            register={register}
            name={`variants.0.sku`}
            label="SKU"
            placeholder="SKU"
            classes="w-[150px] py-1 px-2"
            error={errors?.variants?.[0]?.price}
          />
        </div>
      )}
    </div>
  );
};

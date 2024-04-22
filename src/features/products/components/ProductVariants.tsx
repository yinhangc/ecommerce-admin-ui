import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CartesianProduct } from 'js-combinatorics';
import filter from 'lodash/filter';
import findIndex from 'lodash/findIndex';
import { useCallback, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useImmer } from 'use-immer';
import { AddProductSchemaType, Option, ProductVariant } from '../types';
import { ProductOptionDisplay } from './ProductOptionDisplay';
import { ProductOptionInput } from './ProductOptionInput';
import { ProductVariantCombos } from './ProductVariantCombos';

export const ProductVariants = () => {
  const [options, setOptions] = useImmer<Option[]>([]);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const { setValue } = useFormContext<AddProductSchemaType>();

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

  const handleUpdateVariants = useCallback(
    (updatedVariants: ProductVariant[]) => {
      console.log('updatedVariants', updatedVariants);
      setVariants(updatedVariants);
    },
    [setVariants],
  );

  useEffect(() => {
    const groups: { [group: string]: string[] } = {};
    for (const option of filter(options, { isEditing: false })) {
      groups[option.name] = [];
      for (const { label } of option.values) groups[option.name].push(label);
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
        price: 1,
        quantity: 0,
        sku: '',
      });
    }
    handleUpdateVariants(productVariants);
  }, [options, handleUpdateVariants]);

  useEffect(() => {
    console.log('update variants');
    setValue('variants', variants);
  }, [setValue, variants]);

  useEffect(() => {
    console.log('update options');
    setValue('options', options);
  }, [setValue, options]);

  return (
    <div className="flex flex-col gap-y-4">
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
      {/* <ProductVariantCombos
        variants={variants}
        handleUpdateVariants={handleUpdateVariants}
      /> */}
    </div>
  );
};

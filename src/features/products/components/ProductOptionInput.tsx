import { FormInputField } from '@/components/Form';
import { find, last } from 'lodash';
import objectPath from 'object-path';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { Product, Option } from '../types';

type ProductOptionInputProps = {
  option: Option;
  optionIndex: number;
  handleUpdateOption: (option: Option) => void;
  handleRemoveOption: (id: string) => void;
};

export const ProductOptionInput: React.FC<ProductOptionInputProps> = (
  props,
) => {
  const { option, optionIndex, handleUpdateOption, handleRemoveOption } = props;
  const {
    register,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<Product>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });
  const [isDoneBefore, setIsDoneBefore] = useState(false);

  const handleRemove = () => handleRemoveOption(option.id);

  const handleCancel = () => {
    if (option.name === '' && option.values.length === 0) handleRemove();
    else handleUpdateOption({ ...option, isEditing: false });
  };

  const handleDone = async () => {
    setIsDoneBefore(true);
    await trigger(`options.${optionIndex}`);
    const updatedOption = find(getValues().options, { id: option.id });
    if (!updatedOption) return;
    updatedOption.values = updatedOption.values.filter(
      (values) => values.value !== '',
    );
    if (!errors.options)
      handleUpdateOption({ ...updatedOption, isEditing: false });
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      console.log({ value, name });
      const { name: optionName = '', values = [] } =
        value.options?.[optionIndex] || {};
      console.log({ optionName, values });
      // Revalidate if the field has any error before
      if (name && objectPath.get(errors, name)) trigger(name);
      // Add option value if there isn't any yet
      const hasName =
        name === `options.${optionIndex}.name` &&
        optionName.length > 0 &&
        values.length === 0;
      const valueHasLabel =
        name?.includes(`options.${optionIndex}.values.`) &&
        values[values.length - 1]?.value !== '';
      console.log({ hasName, valueHasLabel });
      if (hasName || valueHasLabel)
        append({ value: '' }, { shouldFocus: false });
      // Remove input with empty value but not the last element
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i]?.value?.trim() === '' && i < values.length - 1) {
          remove(i);
          break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [append, remove, watch, optionIndex, errors, trigger]);

  useEffect(() => {
    const initRender = async () => {
      await trigger(`options.${optionIndex}`);
      if (option.name && last(option.values)?.value !== '') {
        append({ value: '' }, { shouldFocus: false });
      }
    };
    initRender();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [append, optionIndex, trigger]);

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex flex-col">
        <FormInputField<Product>
          register={register}
          name={`options.${optionIndex}.name` as const}
          placeholder="Option Name"
          error={isDoneBefore ? errors.options?.[optionIndex]?.name : null}
        />
      </div>
      {fields.length > 0 && (
        <div className="ml-6 flex flex-col gap-y-3">
          {fields.map((field, index) => {
            return (
              <FormInputField<Product>
                key={field.id}
                register={register}
                name={`options.${optionIndex}.values.${index}.value`}
                placeholder="Option Value"
                error={
                  isDoneBefore
                    ? errors?.options?.[optionIndex]?.values?.[index]?.value
                    : null
                }
              />
            );
          })}
        </div>
      )}
      <div className="flex gap-x-2">
        <button
          type="button"
          onClick={handleRemove}
          className="mr-auto w-fit rounded border border-red-600 bg-red-600 px-4 py-1 text-white shadow"
        >
          移除
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="w-fit rounded border border-blue-600 bg-white px-4 py-1 text-blue-600 shadow"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleDone}
          className="w-fit rounded border border-green-600 bg-white px-4 py-1 text-green-600 shadow"
        >
          完成
        </button>
      </div>
    </div>
  );
};

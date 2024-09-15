import { FormInputField } from '@/components/Form';
import { cloneDeep, find } from 'lodash';
import objectPath from 'object-path';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext, useWatch } from 'react-hook-form';
import { TProduct, TOption } from '../types/upsertProduct.type';

type ProductOptionsInputProps = {
  option: TOption;
  optionIndex: number;
  handleUpdateOption: (option: TOption) => void;
  handleRemoveOption: (id: string | number) => void;
};

export const ProductOptionsInput: React.FC<ProductOptionsInputProps> = (
  props,
) => {
  const initialValue = useRef<TOption>();
  const { option, optionIndex, handleUpdateOption, handleRemoveOption } = props;
  const {
    register,
    control,
    trigger,
    getValues,
    formState: { errors },
  } = useFormContext<TProduct>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });
  const [isDoneBefore, setIsDoneBefore] = useState(false);

  const handleRemove = () => handleRemoveOption(option.id);

  const handleCancel = () => {
    const option = initialValue.current;
    if (option && option.label !== '')
      handleUpdateOption({ ...option, isEditing: false });
    else handleRemove();
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

  const watchOptions = useWatch({ control, name: 'options' });
  const handleWatchOptionsChange = useCallback(async () => {
    // set initial value, for handleCancel
    if (typeof initialValue.current === 'undefined')
      initialValue.current = cloneDeep(watchOptions[optionIndex]);
    const { label, values = [] } = watchOptions[optionIndex];
    // revalidate if the field has any error before
    if (objectPath.get(errors, 'options')) await trigger('options');
    // add option value if there isn't any yet
    const hasName = label.length > 0 && values.length === 0;
    const valueHasLabel = values[values.length - 1]?.value !== '';
    if (hasName || valueHasLabel) append({ value: '' }, { shouldFocus: false });
    // remove input with empty value but not the last element
    for (let i = values.length - 1; i >= 0; i--) {
      if (values[i]?.value?.trim() === '' && i < values.length - 1) {
        remove(i);
        break;
      }
    }
  }, [append, errors, optionIndex, remove, trigger, watchOptions]);

  useEffect(() => {
    handleWatchOptionsChange();
  }, [handleWatchOptionsChange]);

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex flex-col">
        <FormInputField<TProduct>
          register={register}
          name={`options.${optionIndex}.label`}
          placeholder="Option Name"
          error={isDoneBefore ? errors.options?.[optionIndex]?.label : null}
        />
      </div>
      {fields.length > 0 && (
        <div className="ml-6 flex flex-col gap-y-3">
          {fields.map((field, index) => {
            return (
              <FormInputField<TProduct>
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
          className="mr-auto w-fit rounded border border-red bg-red px-4 py-1 text-white shadow"
        >
          移除
        </button>
        <button
          type="button"
          onClick={handleCancel}
          className="border-green-600 text-green-600 w-fit rounded border bg-white px-4 py-1 shadow"
        >
          取消
        </button>
        <button
          type="button"
          onClick={handleDone}
          className="w-fit rounded border border-blue bg-white px-4 py-1 text-blue shadow"
        >
          完成
        </button>
      </div>
    </div>
  );
};

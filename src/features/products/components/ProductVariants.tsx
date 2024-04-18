import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { zodResolver } from '@hookform/resolvers/zod';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';
import { z } from 'zod';

type Option = {
  id: string;
  name: string;
  values: OptionValue[];
};
type OptionValue = {
  // id: string;
  label: string;
  price: number;
};
type ProductOptionInputProps = {
  option: Option;
  // handleAddOptionValue: (optionId: string, optionValue: OptionValue) => void;
};
const requiredError = '請填寫此欄位';
const schema = z.object({
  id: z.string().min(1, requiredError),
  name: z.string().min(1, requiredError),
  values: z.any().refine((optionValues: OptionValue[]) => {
    const optionValuesToBeChecked = optionValues.slice(0, -1);
    if (optionValuesToBeChecked.length === 0) return false;
    for (const optionValue of optionValuesToBeChecked) {
      if (optionValue.label.trim() === '') return false;
    }
    return true;
  }, requiredError),
});
type ProductOptionSchemaType = z.infer<typeof schema>;

const ProductOptionInput: React.FC<ProductOptionInputProps> = (props) => {
  const { option } = props;
  const {
    register,
    control,
    watch,
    trigger,
    formState: { errors },
  } = useForm<ProductOptionSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: option.id,
      name: '',
      values: [],
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  });

  const handleSubmit = () => {
    trigger();
    console.log('ERRORS', errors);
  };

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('WATCH', value, name, type);
      const { name: optionName = '', values = [] } = value || {};
      const hasName =
        name === 'name' && optionName.length > 0 && values.length === 0;
      const valueHasLabel =
        name?.includes('values.') && values[values.length - 1]?.label !== '';
      if (hasName || valueHasLabel)
        append({ label: '', price: 0 }, { shouldFocus: false });
      // Remove input with empty value but not the last elm
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i]?.label?.trim() === '' && i < values.length - 1) {
          remove(i);
          break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [append, remove, watch]);

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex flex-col">
        <label htmlFor="name">選項名字</label>
        <input
          placeholder="Option Name"
          className="rounded border border-gray-400 px-4 py-2"
          {...register('name')}
        />
        {!!errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      <div className="ml-6 flex flex-col gap-y-1">
        {fields.map((field, index) => {
          console.log('fff', field);
          return (
            <div className="flex flex-col" key={field.id}>
              <label htmlFor={`values.${index}.label`}>選項數值</label>
              <input
                key={field.id}
                placeholder="Option Value"
                className="rounded border border-gray-400 px-4 py-2"
                {...register(`values.${index}.label`)}
              />
              {!!errors?.values?.root && !field.label && (
                <p className="text-sm text-red-600">
                  {errors.values.root.message as string}
                </p>
              )}
            </div>
          );
        })}
      </div>
      <div className="flex gap-x-2">
        <button
          type="button"
          className="w-fit rounded border border-red-600 bg-red-600 px-4 py-1 text-white shadow"
        >
          移除
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-fit rounded border bg-white px-4 py-1 shadow"
        >
          完成
        </button>
      </div>
    </div>
  );
};

export const ProductVariants = () => {
  const [options, setOptions] = useState<Option[]>([]);

  const handleAddOption = () => {
    setOptions([
      ...options,
      { id: Math.random().toString(36).substr(2, 5), name: '', values: [] },
    ]);
  };

  // const handleAddOptionValue = (optionId: string, optionValue: OptionValue) => {
  //   const updatedOption = options.find((opt) => opt.id === optionId);
  //   if (!updatedOption) return;
  // };

  return (
    <div>
      {options.length > 0 && (
        <div className="mb-6 flex flex-col gap-y-6">
          {options.map((option) => (
            <ProductOptionInput
              key={option.id}
              option={option}
              // handleAddOptionValue={handleAddOptionValue}
            />
          ))}
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
    </div>
  );
};

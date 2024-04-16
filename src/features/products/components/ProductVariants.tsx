import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useState } from 'react';
import { SubmitHandler, useFieldArray, useForm } from 'react-hook-form';

type Option = {
  id: string;
  name: string;
  values: OptionValue[];
};
type OptionValue = {
  id: string;
  label: string;
  price: number;
};
type ProductOptionInputProps = {
  option: Option;
  handleAddOptionValue: (optionId: string, optionValue: OptionValue) => void;
};

const ProductOptionInput: React.FC<ProductOptionInputProps> = (props) => {
  const { option, handleAddOptionValue } = props;
  const { register, control, watch } = useForm<Option>({
    defaultValues: {
      id: option.id,
      name: '',
    },
  });
  const { fields, append, remove } = useFieldArray({
    control,
    name: 'values',
  });

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      console.log('WATCH', value, name, type);
      if (
        name === 'name' &&
        !!value.name &&
        value.name.length > 0 &&
        !!value.values &&
        value.values.length === 0
      ) {
        // handleAddOptionValue(option.id, { label: '', price: 0 });
      }
    });
    return () => subscription.unsubscribe();
  }, [handleAddOptionValue, watch]);

  return (
    <div className="flex w-full flex-col gap-y-1">
      <div className="mb-1 flex flex-col">
        <label htmlFor="name">選項名字</label>
        <input
          placeholder="Option Name"
          className="rounded border border-gray-400 px-4 py-2"
          {...register('name')}
        />
      </div>
      <div className="ml-6 flex flex-col">
        {fields.map((field, index) => {
          return (
            <div>
              <label htmlFor="name">選項數值</label>
              <input
                key={field.id}
                placeholder="Option Value"
                className="rounded border border-gray-400 px-4 py-2"
                {...register(`values.${index}` as const)}
              />
            </div>
          );
        })}
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

  const handleAddOptionValue = (optionId: string, optionValue: OptionValue) => {
    const updatedOption = options.find((opt) => opt.id === optionId);
    if (!updatedOption) return;
  };

  return (
    <div>
      {options.length > 0 && (
        <div className="mb-6 flex flex-col gap-y-6">
          {options.map((option) => (
            <ProductOptionInput
              option={option}
              handleAddOptionValue={handleAddOptionValue}
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

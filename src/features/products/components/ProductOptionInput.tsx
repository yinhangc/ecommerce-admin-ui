import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { AddProductSchemaType, Option } from '../types';

type ProductOptionInputProps = {
  option: Option;
  optionIndex: number;
  handleUpdateOption: (option: Option) => void;
  handleRemoveOption: (id: string) => void;
};
// const requiredError = '請填寫此欄位';
// const schema = z.object({
//   id: z.string().min(1, requiredError),
//   name: z.string().min(1, requiredError),
//   values: z
//     .array(
//       z.object({
//         label: z.string(),
//         price: z.number(),
//       }),
//     )
//     .superRefine((values, ctx) => {
//       if (values.length === 1 && values[0].label.trim() === '') {
//         ctx.addIssue({
//           code: z.ZodIssueCode.custom,
//           message: requiredError,
//           path: [0, 'label'],
//         });
//       }
//       for (let i = 0; i < values.length - 2; i++) {
//         if (values[i].label.trim() === '') {
//           ctx.addIssue({
//             code: z.ZodIssueCode.custom,
//             message: requiredError,
//             path: [i, 'label'],
//           });
//         }
//       }
//     }),
// });
// type ProductOptionSchemaType = z.infer<typeof schema>;

export const ProductOptionInput: React.FC<ProductOptionInputProps> = (
  props,
) => {
  const { option, optionIndex, handleUpdateOption, handleRemoveOption } = props;
  const [doneBefore, setDoneBefore] = useState(false);
  // const {
  //   register,
  // control,
  // watch,
  // trigger,
  // getValues,
  // formState: { errors, isValid },
  // } = useForm<ProductOptionSchemaType>({
  //   resolver: zodResolver(schema),
  //   defaultValues: {
  //     id: option.id,
  //     name: option.name,
  //     values: [...option.values, { label: '', price: 0 }],
  //   },
  // });
  const {
    register,
    control,
    watch,
    trigger,
    getValues,
    formState: { errors, isValid },
  } = useFormContext<AddProductSchemaType>();
  const { fields, append, remove } = useFieldArray({
    control,
    name: `options.${optionIndex}.values`,
  });

  const handleRemove = () => handleRemoveOption(option.id);

  const handleCancel = () => {
    if (option.name === '' && option.values.length === 0) handleRemove();
    else handleUpdateOption({ ...option, isEditing: false });
  };

  const handleSubmit = () => {
    setDoneBefore(true);
    trigger();
    const updatedOption = find(getValues().options, { id: option.id });
    if (!updatedOption) return;
    updatedOption.values = updatedOption.values.filter(
      (values) => values.label !== '',
    );
    console.log('SUBMIT errors & values', { errors, values: updatedOption });
    if (isValid) handleUpdateOption({ ...updatedOption, isEditing: false });
  };

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      console.log('WATCH', value, name);
      const { name: optionName = '', values = [] } =
        value.options?.[optionIndex] || {};
      if (doneBefore) trigger();
      // Add option value if there isn't any yet
      const hasName =
        name === `options.${optionIndex}.name` &&
        optionName.length > 0 &&
        values.length === 0;
      const valueHasLabel =
        name?.includes(`options.${optionIndex}.values.`) &&
        values[values.length - 1]?.label !== '';
      if (hasName || valueHasLabel)
        append({ label: '', price: 0 }, { shouldFocus: false });
      // Remove input with empty value but not the last element
      for (let i = values.length - 1; i >= 0; i--) {
        if (values[i]?.label?.trim() === '' && i < values.length - 1) {
          remove(i);
          break;
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [append, remove, watch, trigger, doneBefore, optionIndex]);

  return (
    <div className="flex w-full flex-col gap-y-3">
      <div className="flex flex-col">
        <label htmlFor={`options.${optionIndex}.name`}>選項名字</label>
        <input
          placeholder="Option Name"
          className="rounded border border-gray-400 px-4 py-2"
          {...register(`options.${optionIndex}.name` as const)}
        />
        {!!errors.name && (
          <p className="text-sm text-red-600">{errors.name.message}</p>
        )}
      </div>
      {fields.length > 0 && (
        <div className="ml-6 flex flex-col gap-y-1">
          {fields.map((field, index) => {
            const valueError = errors?.options?.[optionIndex]?.values?.[index];
            return (
              <div className="flex flex-col" key={field.id}>
                <label
                  htmlFor={
                    `options.${optionIndex}.values.${index}.label` as const
                  }
                >
                  選項數值
                </label>
                <input
                  key={field.id}
                  placeholder="Option Value"
                  className="rounded border border-gray-400 px-4 py-2"
                  {...register(
                    `options.${optionIndex}.values.${index}.label` as const,
                  )}
                />
                {!!valueError?.label?.message && (
                  <p className="text-sm text-red-600">
                    {valueError?.label?.message}
                  </p>
                )}
              </div>
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
          onClick={handleSubmit}
          className="w-fit rounded border border-green-600 bg-white px-4 py-1 text-green-600 shadow"
        >
          完成
        </button>
      </div>
    </div>
  );
};

import { InputHTMLAttributes } from 'react';
import {
  FieldError,
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type InputFieldProps<T extends FieldValues> = {
  name: FieldPath<T>;
  register: UseFormRegister<T>;
  label?: string;
  type?: 'text' | 'number';
  placeholder?: string;
  registerOptions?: RegisterOptions;
  error?: FieldError | null;
  classes?: string;
  prepend?: string;
};

export const FormInputField = <T extends FieldValues>(
  props: InputFieldProps<T>,
) => {
  const {
    name,
    register,
    label,
    type = 'text',
    placeholder,
    registerOptions,
    error,
    classes,
    prepend,
  } = props;

  // Control html input behavior
  const inputAttributes: InputHTMLAttributes<HTMLInputElement> = {};
  if (typeof registerOptions?.min === 'number')
    inputAttributes.min = registerOptions.min;
  if (typeof registerOptions?.max === 'number')
    inputAttributes.max = registerOptions.max;

  return (
    <div className={`flex w-full flex-col gap-y-1 ${!!classes && classes}`}>
      {!!label && (
        <label htmlFor={name}>
          {label}
          {registerOptions?.required && (
            <span className="ml-1 text-red">*</span>
          )}
        </label>
      )}
      <div className="flex items-center">
        {prepend && (
          <div className="mr-1 rounded border bg-gray-200 px-2 py-2">
            <span>{prepend}</span>
          </div>
        )}
        <input
          placeholder={placeholder}
          className="w-full rounded border border-gray-400 px-4 py-2"
          type={type}
          {...inputAttributes}
          {...register(name, registerOptions)}
        />
      </div>
      {!!error && <p className="text-sm text-red">{error.message}</p>}
    </div>
  );
};

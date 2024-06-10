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
  } = props;

  // control html input behavior
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
            <span className="ml-1 text-red-600">*</span>
          )}
        </label>
      )}
      <input
        placeholder={placeholder}
        className="rounded border border-gray-400 px-4 py-2"
        type={type}
        {...inputAttributes}
        {...register(name, registerOptions)}
      />
      {!!error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

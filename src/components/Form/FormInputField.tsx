import React from 'react';
import { FieldError, UseFormRegister } from 'react-hook-form';

type InputFieldProps = {
  name: string;
  label: string;
  placeholder?: string;
  register: UseFormRegister<any>;
  required?: boolean;
  error?: FieldError;
  classes?: string;
};

export const FormInputField: React.FC<InputFieldProps> = (props) => {
  const {
    name,
    label,
    placeholder,
    register,
    required = false,
    error,
    classes,
  } = props;

  return (
    <div className={`flex w-full flex-col gap-y-1 ${!!classes && classes}`}>
      <label htmlFor={name}>
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>
      <input
        placeholder={placeholder}
        {...register(name, { required })}
        className="rounded border border-gray-400 px-4 py-2"
      />
      {!!error && <p className="text-sm text-red-600">{error.message}</p>}
    </div>
  );
};

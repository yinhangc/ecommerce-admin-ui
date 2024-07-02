import React from 'react';
import { FieldPath, FieldValues, UseFormRegister } from 'react-hook-form';

export type FormDropdownProps<T extends FieldValues> = {
  name: FieldPath<T>;
  label?: string;
  options: {
    label: string;
    value: string | undefined;
  }[];
  register: UseFormRegister<T>;
  required?: boolean;
  classes?: string;
};

export const FormDropdown = <T extends FieldValues>(
  props: FormDropdownProps<T>,
) => {
  const { name, label, options, required = false, register, classes } = props;

  return (
    <div className={`flex flex-col gap-y-1 ${!!classes && classes}`}>
      {!!label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="text-red ml-1">*</span>}
        </label>
      )}
      <select
        {...register(name)}
        className="cursor-pointer rounded border border-gray-400 p-2"
      >
        {options.map(({ label, value }) => (
          <option key={value || 'form-dropdown-default-value'} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

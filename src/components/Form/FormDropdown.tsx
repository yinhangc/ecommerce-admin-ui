import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type FormDropdownProps = {
  name: string;
  label?: string;
  options: {
    label: string;
    value: string;
  }[];
  required?: boolean;
  register: UseFormRegister<any>;
  classes?: string;
};

export const FormDropdown: React.FC<FormDropdownProps> = (props) => {
  const { name, label, options, required = false, register, classes } = props;

  return (
    <div className={`flex flex-col gap-y-1 ${!!classes && classes}`}>
      {!!label && (
        <label htmlFor={name}>
          {label}
          {required && <span className="ml-1 text-red-600">*</span>}
        </label>
      )}
      <select
        {...register(name)}
        className="cursor-pointer rounded border border-gray-400 p-2"
      >
        {options.map(({ label, value }) => (
          <option key={value} value={value}>
            {label}
          </option>
        ))}
      </select>
    </div>
  );
};

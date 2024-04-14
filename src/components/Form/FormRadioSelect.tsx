import React from 'react';
import { UseFormRegister } from 'react-hook-form';

type FormRadioSelectProps = {
  name: string;
  options: {
    label: string;
    value: string;
  }[];
  register: UseFormRegister<any>;
  classes?: string;
};

export const FormRadioSelect: React.FC<FormRadioSelectProps> = (props) => {
  const { name, options, register, classes } = props;
  return (
    <div className={`flex w-full flex-wrap gap-x-6 ${!!classes && classes}`}>
      {options.map(({ label, value }) => (
        <label
          key={value}
          htmlFor={value}
          className="flex flex-1 cursor-pointer gap-2 rounded border border-gray-400 px-4 py-2 accent-leather-500"
        >
          <input
            {...register(name)}
            type="radio"
            id={value}
            value={value}
            className="cursor-pointer"
          />
          {label}
        </label>
      ))}
    </div>
  );
};

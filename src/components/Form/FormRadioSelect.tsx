import {
  FieldPath,
  FieldValues,
  RegisterOptions,
  UseFormRegister,
} from 'react-hook-form';

type FormRadioSelectProps<T extends FieldValues> = {
  name: FieldPath<T>;
  options: {
    label: string;
    value: string;
  }[];
  register: UseFormRegister<T>;
  registerOptions?: RegisterOptions;
  classes?: string;
};

export const FormRadioSelect = <T extends FieldValues>(
  props: FormRadioSelectProps<T>,
) => {
  const { name, options, register, registerOptions, classes } = props;
  return (
    <div className={`flex w-full flex-wrap gap-x-6 ${!!classes && classes}`}>
      {options.map(({ label, value }) => (
        <label
          key={value}
          htmlFor={value}
          className="accent-leather-500 flex flex-1 cursor-pointer gap-2 rounded border border-gray-400 px-4 py-2"
        >
          <input
            {...register(name, registerOptions)}
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

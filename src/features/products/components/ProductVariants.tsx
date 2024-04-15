import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useState } from 'react';

type Option = {
  name: string;
  values: {
    label: string;
    price: number;
  }[];
};
type ProductOptionInputProps = {
  option: Option;
  setOptions: any;
};

const ProductOptionInput: React.FC<ProductOptionInputProps> = (props) => {
  const { option, setOptions } = props;
  return (
    <div className="flex w-full flex-col gap-y-1">
      <label htmlFor="name">選項名字</label>
      <input
        placeholder="Option Name"
        id="name"
        className="rounded border border-gray-400 px-4 py-2"
      />
    </div>
  );
};

export const ProductVariants = () => {
  const [options, setOptions] = useState<Option[]>([]);

  const handleAdd = () => {
    setOptions([...options, { name: '', values: [] }]);
  };

  return (
    <div>
      {options.length > 0 && (
        <div className="mb-6">
          {options.map((option) => (
            <ProductOptionInput option={option} setOptions={setOptions} />
          ))}
        </div>
      )}
      <button
        type="button"
        className="rounded border border-blue-600 px-4 py-1 text-blue-600"
        onClick={handleAdd}
      >
        <FontAwesomeIcon icon={faPlus} className="mr-1" />
        增加選項
      </button>
    </div>
  );
};

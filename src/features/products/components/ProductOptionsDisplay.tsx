import { TOption } from '../types/upsertProduct';

type ProductOptionsInputProps = {
  option: TOption;
  handleUpdateOption: (option: TOption) => void;
};

export const ProductOptionsDisplay: React.FC<ProductOptionsInputProps> = (
  props,
) => {
  const { option, handleUpdateOption } = props;

  const handleEdit = () => handleUpdateOption({ ...option, isEditing: true });

  return (
    <div className="flex items-center">
      <div>
        <h4 className="mb-1 font-bold">{option.label}</h4>
        <div className="flex flex-wrap gap-x-1">
          {option.values.map(({ value }, i) => (
            <div
              className="rounded-2xl bg-gray-200 px-3 py-1 text-center"
              key={i}
            >
              {value}
            </div>
          ))}
        </div>
      </div>
      <button
        type="button"
        className="ml-auto rounded bg-white px-3 py-1 shadow"
        onClick={handleEdit}
      >
        編輯
      </button>
    </div>
  );
};

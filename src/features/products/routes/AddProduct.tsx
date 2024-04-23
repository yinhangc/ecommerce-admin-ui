import {
  FormDropdown,
  FormInputField,
  FromTextEditor,
} from '@/components/Form';
import { FormImageUpload } from '@/components/Form/FormImageUpload';
import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import { ProductVariants } from '../components/ProductVariants';
import { AddProductSchemaType, addProductSchema } from '../types';

export const AddProduct = () => {
  const methods: UseFormReturn<AddProductSchemaType> =
    useForm<AddProductSchemaType>({
      resolver: zodResolver(addProductSchema),
      defaultValues: {
        name: '',
        description: '',
        status: 'inactive',
        images: [],
        options: [],
        variants: [],
      },
    });
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const onSubmit: SubmitHandler<AddProductSchemaType> = (data) => {
    console.log('data', data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  return (
    <NavigationLayout>
      <h2 className="mb-4 text-2xl font-medium">創建產品</h2>
      <FormProvider {...methods}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full"
          onKeyDown={handleKeyDown}
        >
          <div className="grid grid-cols-12 gap-x-4">
            <div className="col-span-8 flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
                <h3 className="font-medium">一般資料</h3>
                <div className="w-full">
                  <FormInputField<AddProductSchemaType>
                    register={register}
                    name="name"
                    validationSchema={{ required: true }}
                    label="名字"
                    placeholder="Name"
                    error={errors['name']}
                  />
                </div>
                <div className="w-full">
                  <label className="mb-1 inline-block">描述</label>
                  <Controller
                    control={control}
                    name="description"
                    render={({ field: { onChange } }) => (
                      <FromTextEditor onChange={onChange} />
                    )}
                  ></Controller>
                </div>
              </div>
              <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
                <h3 className="font-medium">相片</h3>
                <Controller
                  control={control}
                  name="images"
                  render={({ field: { onChange } }) => (
                    <FormImageUpload onChange={onChange} />
                  )}
                ></Controller>
              </div>
              <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
                <h3 className="font-medium">選項、價格和庫存</h3>
                <ProductVariants />
              </div>
            </div>
            <div className="col-span-4 flex flex-col gap-y-6">
              <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
                <h3 className="font-medium">狀態</h3>
                <FormDropdown
                  name="status"
                  required={true}
                  register={register}
                  options={[
                    { label: 'Active', value: 'active' },
                    { label: 'Inactive', value: 'inactive' },
                  ]}
                  classes="flex-1"
                />
              </div>
            </div>
          </div>
          <div className="mt-8 flex justify-end gap-x-4">
            <button className="rounded bg-gray-500 px-4 py-2 text-white">
              儲存草稿
            </button>
            <button
              type="submit"
              className="rounded bg-blue-600 px-4 py-2 text-white"
            >
              發佈
            </button>
          </div>
        </form>
      </FormProvider>
    </NavigationLayout>
  );
};

import {
  FormDropdown,
  FormInputField,
  FromTextEditor,
} from '@/components/Form';
import { FormImageUpload } from '@/components/Form/FormImageUpload';
import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { z } from 'zod';

const requiredError = '請填寫此欄位';
const schema = z.object({
  name: z.string().min(1, requiredError),
  description: z.string(),
  status: z.string().refine((value) => ['active', 'inactive'].includes(value), {
    message: '無效的數值',
  }),
  images: z.any().refine(
    (value) => {
      for (const im of value) {
        if (!(im instanceof File)) return false;
      }
      return true;
    },
    {
      message: '上載的照片格式不符',
    },
  ),
});
type AddProductSchemaType = z.infer<typeof schema>;

export const AddProduct = () => {
  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<AddProductSchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      description: '',
      status: 'inactive',
      images: [],
    },
  });

  const onSubmit: SubmitHandler<AddProductSchemaType> = (data) => {
    console.log('data', data);
  };

  return (
    <NavigationLayout>
      <h2 className="mb-4 text-2xl font-medium">創建產品</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="w-full">
        <div className="grid grid-cols-12 gap-x-4">
          <div className="col-span-8 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
              <h3 className="font-medium">一般資料</h3>
              <div className="w-full">
                <FormInputField
                  name="name"
                  label="名字"
                  placeholder="Name"
                  required={true}
                  register={register}
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
            <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
              <h3 className="font-medium">相片</h3>
              {/* TODO: File Upload */}
              <Controller
                control={control}
                name="images"
                render={({ field: { onChange } }) => (
                  <FormImageUpload onChange={onChange} />
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
              <h3 className="font-medium">選項</h3>
              {/* TODO: Variants */}
            </div>
          </div>
          <div className="col-span-4 flex flex-col gap-y-6">
            <div className="flex flex-col gap-y-4 rounded-md bg-white p-4 shadow-md">
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
    </NavigationLayout>
  );
};

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
import { Product, productSchema } from '../types';
import { useCreateProductMutation } from '../api/products';
import { useUploadFilesMutation } from '@/features/blobs/api/blobs';

export const AddProduct = () => {
  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation();
  const [uploadFiles, { isLoading: isUploadFilesLoading }] =
    useUploadFilesMutation();
  const methods: UseFormReturn<Product> = useForm<Product>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'INACTIVE',
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
    getValues,
  } = methods;
  const onSubmit: SubmitHandler<Product> = async (data) => {
    console.log('data', data);
    let uploadImagesRes: string[] = [];
    if (data.images.length > 0) {
      const formData = new FormData();
      for (const image of data.images) formData.append('image', image);
      uploadImagesRes = await uploadFiles(formData).unwrap();
      console.log('uploadImagesRes', uploadImagesRes);
    }
    await createProduct({
      ...data,
      imageUrls: uploadImagesRes,
    });
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
                  <FormInputField<Product>
                    register={register}
                    name="name"
                    registerOptions={{ required: true }}
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
                    { label: 'Active', value: 'ACTIVE' },
                    { label: 'Inactive', value: 'INACTIVE' },
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

import {
  FormDropdown,
  FormInputField,
  FromTextEditor,
} from '@/components/Form';
import { FormImageUpload } from '@/components/Form/FormImageUpload';
import { Loader } from '@/components/Ui/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { useEffect } from 'react';
import {
  Controller,
  FormProvider,
  SubmitHandler,
  UseFormReturn,
  useForm,
} from 'react-hook-form';
import {
  useCreateProductMutation,
  useUpdateProductMutation,
} from '../api/products';
import { Product, productSchema } from '../types/addProduct';
import { ProductVariants } from './ProductVariants';

type UpsertProductFormProps = {
  existingData?: Product;
  loadData?: (id: string) => QueryActionCreatorResult<any>;
};

export const UpsertProductForm: React.FC<UpsertProductFormProps> = (props) => {
  const { existingData, loadData } = props;
  // console.log('existingData', existingData);

  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateProductLoading }] =
    useUpdateProductMutation();

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
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = methods;
  // console.log('ERRORS!', errors, getValues());

  const onSubmit: SubmitHandler<Product> = async (data: Product) => {
    console.log('onSubmit', data);
    const formData = new FormData();
    // append product image files
    if (data.images.length > 0)
      for (const image of data.images) formData.append('file', image);
    // append other product data
    Object.keys(data).forEach((key: string) => {
      const productKey = key as keyof Product;
      formData.append(
        key,
        typeof data[productKey] === 'object'
          ? JSON.stringify(data[productKey])
          : data[productKey],
      );
    });
    try {
      if (existingData) {
        const product = await updateProduct(formData).unwrap();
        alert('您已成功更新產品！');
        if (loadData) loadData((product.id as number).toString());
      } else {
        await createProduct(formData).unwrap();
        alert('您已成功創建產品！');
        reset();
      }
    } catch (e) {
      console.log('ERROR!', e);
      alert('產品創建失敗');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLFormElement>) => {
    if (e.key === 'Enter') e.preventDefault();
  };

  useEffect(() => {
    if (existingData) reset(existingData);
  }, [existingData, reset]);

  if (isCreateProductLoading || isUpdateProductLoading)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader size="large" />
      </div>
    );

  return (
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
                  render={({ field: { onChange, value } }) => (
                    <FromTextEditor onChange={onChange} value={value} />
                  )}
                ></Controller>
              </div>
            </div>
            <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
              <h3 className="font-medium">相片</h3>
              <Controller
                control={control}
                name="images"
                render={({ field: { onChange, value } }) => (
                  <FormImageUpload onChange={onChange} value={value} />
                )}
              ></Controller>
            </div>
            <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
              <h3 className="font-medium">選項、價格和庫存</h3>
              <ProductVariants existingData={existingData} />
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
  );
};

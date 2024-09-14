import {
  FormDropdown,
  FormDropdownProps,
  FormInputField,
  FromTextEditor,
} from '@/components/Form';
import { FormImageUpload } from '@/components/Form/FormImageUpload';
import { Loader } from '@/components/Ui/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { useEffect, useState } from 'react';
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
import { TProduct, productSchema } from '../types/upsertProduct';
import { ProductVariants } from './ProductVariants';
import { useGetAllCategoriesForDropdownQuery } from '../api/categories';
import { TCategory } from '../types/categories';

type TProductFormProps = {
  existingData?: TProduct;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadData?: (id: string) => QueryActionCreatorResult<any>;
};

export const ProductForm: React.FC<TProductFormProps> = (props) => {
  const { existingData, loadData } = props;
  const [categoryOptions, setCategoryOptions] = useState<
    FormDropdownProps<TCategory>['options']
  >([]);

  const { data: categories, isLoading: isListCategoryLoading } =
    useGetAllCategoriesForDropdownQuery();
  const [createProduct, { isLoading: isCreateProductLoading }] =
    useCreateProductMutation();
  const [updateProduct, { isLoading: isUpdateProductLoading }] =
    useUpdateProductMutation();

  const methods: UseFormReturn<TProduct> = useForm<TProduct>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: '',
      description: '',
      status: 'INACTIVE',
      categoryId: null,
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

  const onSubmit: SubmitHandler<TProduct> = async (data: TProduct) => {
    console.log('onSubmit', data);
    const formData = new FormData();
    // append product image files
    if (data.images.length > 0)
      for (const image of data.images) formData.append('file', image);
    // append other product data
    Object.keys(data).forEach((key: string) => {
      const productKey = key as keyof TProduct;
      console.log('productKey:', productKey, typeof data[productKey]);
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

  // set dropdown options and data (if any) on init render
  useEffect(() => {
    const selectable: FormDropdownProps<TCategory>['options'] = [
      { label: '<-- NO PARENT CATEGORY -->', value: '' },
    ];
    console.log('getAll categories', categories);
    if (categories && categories.length > 0)
      selectable.push(
        ...categories.map((cat: TCategory) => ({
          label: `${cat.name} (${cat.slug}) `,
          value: cat.id ? cat.id.toString() : '',
        })),
      );
    setCategoryOptions(selectable);
    if (existingData) reset(existingData);
  }, [categories, existingData, getValues, reset]);

  if (isListCategoryLoading || isCreateProductLoading || isUpdateProductLoading)
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
                <FormInputField<TProduct>
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
              <FormDropdown<TProduct>
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
            <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
              <h3 className="font-medium">分類</h3>
              <FormDropdown<TProduct>
                name="categoryId"
                register={register}
                options={categoryOptions}
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
            className="rounded bg-green px-4 py-2 text-white"
          >
            發佈
          </button>
        </div>
      </form>
    </FormProvider>
  );
};

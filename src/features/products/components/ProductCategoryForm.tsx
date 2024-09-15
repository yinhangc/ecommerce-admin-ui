import {
  FormDropdown,
  FormDropdownProps,
  FormInputField,
} from '@/components/Form';
import { Loader } from '@/components/Ui/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { QueryActionCreatorResult } from '@reduxjs/toolkit/query';
import { find } from 'lodash';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import {
  useCreateCategoryMutation,
  useGetAllCategoriesForDropdownQuery,
  useUpdateCategoryMutation,
} from '../api/categories';
import { TCategory, categorySchema } from '../types/category.type';

type TProductCategoryFormProps = {
  existingData?: TCategory;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  loadData?: (id: string) => QueryActionCreatorResult<any>;
};

export const ProductCategoryForm: React.FC<TProductCategoryFormProps> = (
  props,
) => {
  const { existingData, loadData } = props;

  const [categoryOptions, setCategoryOptions] = useState<
    FormDropdownProps<TCategory>['options']
  >([]);
  const [prependSlug, setPrependSlug] = useState('/');

  const {
    data: categories,
    isLoading: isListCategoryLoading,
    refetch: refetchCategories,
  } = useGetAllCategoriesForDropdownQuery(undefined, {
    refetchOnMountOrArgChange: true,
  });
  const [createCategory, { isLoading: isCreateCategoryLoading }] =
    useCreateCategoryMutation();
  const [updateCategory, { isLoading: isUpdateCategoryLoading }] =
    useUpdateCategoryMutation();

  const {
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<TCategory>({
    resolver: zodResolver(categorySchema),
  });
  const watchParentCategoryId = useWatch({ control, name: 'parentId' });
  // console.log('ERRORS!', errors, getValues());

  const onSubmit: SubmitHandler<TCategory> = async (data: TCategory) => {
    data.slug = prependSlug + data.slug;
    console.log('onSubmit', data);
    // return;
    try {
      if (existingData) {
        const category = await updateCategory(data).unwrap();
        alert('您已成功更新分類！');
        if (loadData) loadData((category.id as number).toString());
      } else {
        const category = await createCategory(data).unwrap();
        console.log('created category', category);
        alert('您已成功創建分類！');
        reset();
      }
      refetchCategories();
    } catch (e) {
      console.log('ERROR!', e);
      alert('分類創建失敗');
    }
  };

  // Set dropdown options and set data if have existing data on init render
  useEffect(() => {
    const options: FormDropdownProps<TCategory>['options'] = [
      { label: '<-- NO PARENT CATEGORY -->', value: '' },
    ];
    console.log('getAll categories', categories);
    if (categories && categories.length > 0)
      options.push(
        ...categories
          .map((cat: TCategory) => ({
            label: `${cat.name} (${cat.slug}) `,
            value: cat.id ? cat.id.toString() : '',
          }))
          .filter((cat) => cat.value !== getValues('id')?.toString()),
      );
    setCategoryOptions(options);
    if (existingData) {
      const trimmedSlug = existingData.slug.match(/[^/]+$/);
      console.log('ex', {
        ...existingData,
        slug: trimmedSlug?.[0] || existingData.slug,
      });
      reset({ ...existingData, slug: trimmedSlug?.[0] || existingData.slug });
    }
  }, [categories, getValues, existingData, reset]);

  // Set prepend slug
  useEffect(() => {
    let prepend = '/';
    if (watchParentCategoryId) {
      const parent = find(categories, { id: Number(watchParentCategoryId) });
      if (parent) prepend = `${parent.slug}/`;
    }
    setPrependSlug(prepend);
  }, [categories, watchParentCategoryId]);

  if (
    isListCategoryLoading ||
    categoryOptions.length === 0 ||
    isCreateCategoryLoading ||
    isUpdateCategoryLoading
  )
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader size="large" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
        <div className="w-full">
          <FormInputField<TCategory>
            register={register}
            name="name"
            registerOptions={{ required: true }}
            label="名字"
            placeholder="Name"
            error={errors['name']}
          />
        </div>
        <div className="w-full">
          <FormInputField<TCategory>
            register={register}
            name="slug"
            registerOptions={{ required: true }}
            label="URL Slug"
            placeholder="URL Slug"
            error={errors['slug']}
            prepend={prependSlug}
          />
        </div>
        <div className="w-full">
          <FormDropdown<TCategory>
            register={register}
            name="parentId"
            label="母分類"
            options={categoryOptions}
            classes="flex-1"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-x-4">
        <button type="submit" className="rounded bg-green px-4 py-2 text-white">
          儲存
        </button>
      </div>
    </form>
  );
};

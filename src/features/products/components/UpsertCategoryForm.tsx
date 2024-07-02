import {
  FormDropdown,
  FormDropdownProps,
  FormInputField,
} from '@/components/Form';
import { Loader } from '@/components/Ui/Loader';
import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import {
  useCreateCategoryMutation,
  useListCategoryQuery,
} from '../api/categories';
import { Category, categorySchema } from '../types/categories';
import { find } from 'lodash';

export const UpsertCategoryForm = () => {
  const {
    reset,
    control,
    register,
    getValues,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
  });
  const watchParentCategoryId = useWatch({ control, name: 'parentCategoryId' });
  console.log('ERRORS!', errors, getValues());

  const [selectableCategories, setSelectableCategories] = useState<
    FormDropdownProps<Category>['options']
  >([]);
  const [prependSlug, setPrependSlug] = useState('');

  const { data: categories, isLoading: isListCategoryLoading } =
    useListCategoryQuery();
  // control this, set categories allow to be selected
  const [createCategory, { isLoading: isCreateCategoryLoading }] =
    useCreateCategoryMutation();
  console.log(categories);

  const onSubmit: SubmitHandler<Category> = async (data: Category) => {
    console.log('data', data);
    data.slug = prependSlug + data.slug;
    // return;
    try {
      const category = await createCategory(data).unwrap();
      console.log('created category', category);
      alert('您已成功創建分類！');
      reset();
    } catch (e) {
      console.log('ERROR!', e);
      alert('分類創建失敗');
    }
  };

  useEffect(() => {
    const selectable: FormDropdownProps<Category>['options'] = [
      { label: '<-- NO PARENT CATEGORY -->', value: '' },
    ];
    if (categories && categories.length > 0)
      selectable.push(
        ...categories.map((cat) => ({
          label: cat.name,
          value: cat.id ? cat.id.toString() : '',
        })),
      );
    setSelectableCategories(selectable);
  }, [categories]);

  useEffect(() => {
    let prepend = '/';
    // TODO: if (categorySchema.safeParse(watchParentCategoryId).success) {
    if (watchParentCategoryId) {
      const parent = find(categories, { id: Number(watchParentCategoryId) });
      console.log('parent', parent);
      if (parent) prepend = `${parent.slug}/`;
    }
    setPrependSlug(prepend);
    console.log('prepend', prepend);
  }, [categories, watchParentCategoryId]);

  if (isListCategoryLoading || selectableCategories.length === 0)
    return (
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <Loader size="large" />
      </div>
    );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="w-full">
      <div className="flex flex-col gap-y-4 rounded-md bg-white px-6 py-4 shadow-md">
        <div className="w-full">
          <FormInputField<Category>
            register={register}
            name="name"
            registerOptions={{ required: true }}
            label="名字"
            placeholder="Name"
            error={errors['name']}
          />
        </div>
        <div className="w-full">
          <FormInputField<Category>
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
          <FormDropdown<Category>
            register={register}
            name="parentCategoryId"
            label="母分類"
            options={selectableCategories}
            classes="flex-1"
          />
        </div>
      </div>
      <div className="mt-8 flex justify-end gap-x-4">
        <button type="button" className="rounded bg-gray-500 text-white">
          <Link to="/products/categories" className="block px-4 py-2">
            返回
          </Link>
        </button>
        <button type="submit" className="rounded bg-green px-4 py-2 text-white">
          儲存
        </button>
      </div>
    </form>
  );
};

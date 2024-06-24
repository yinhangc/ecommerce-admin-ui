import { FormDropdown, FormInputField } from '@/components/Form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Category, categorySchema } from '../types/categories';
import { Link } from 'react-router-dom';

export const UpsertCategoryForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Category>({
    resolver: zodResolver(categorySchema),
  });

  const onSubmit: SubmitHandler<Category> = async (data: Category) => {
    console.log('data', data);
  };

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
          />
        </div>
        <div className="w-full">
          <FormDropdown<Category>
            register={register}
            name="parentCategory"
            label="母分類"
            options={[
              { label: 'Active', value: 'ACTIVE' },
              { label: 'Inactive', value: 'INACTIVE' },
            ]}
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
        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          儲存
        </button>
      </div>
    </form>
  );
};

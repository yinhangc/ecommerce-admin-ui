import { getBaseQuery } from '@/lib/rtk-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { Category } from '../types/categories';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: getBaseQuery('categories'),
  endpoints: (builder) => ({
    createCategory: builder.mutation<Category, Category>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    listCategory: builder.query<Category[], void>({
      query: () => ({ url: '/list' }),
    }),
    getCategory: builder.query<Category, string>({
      query: (id) => ({ url: `/${id}` }),
    }),
    updateCategory: builder.mutation<Category, Category>({
      query: (body) => ({
        url: `/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const { useCreateCategoryMutation, useListCategoryQuery } =
  categoriesApi;

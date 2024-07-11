import { getBaseQuery } from '@/lib/rtk-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { TCategory, TCategoryInList } from '../types/categories';
import { TListQuery } from '@/types';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: getBaseQuery('categories'),
  endpoints: (builder) => ({
    createCategory: builder.mutation<TCategory, TCategory>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
    listCategories: builder.mutation<
      { rows: TCategoryInList[]; count: number },
      TListQuery
    >({
      query: (body) => ({ url: '/list', method: 'POST', body }),
    }),
    getAllCategoriesForDropdown: builder.query<TCategory[], void>({
      query: () => ({ url: '/all' }),
    }),
    getCategory: builder.query<TCategory, string>({
      query: (id) => ({ url: `/${id}` }),
    }),
    updateCategory: builder.mutation<TCategory, TCategory>({
      query: (body) => ({
        url: `/${body.id}`,
        method: 'PUT',
        body,
      }),
    }),
  }),
});

export const {
  useCreateCategoryMutation,
  useListCategoriesMutation,
  useGetAllCategoriesForDropdownQuery,
  useGetCategoryQuery,
  useUpdateCategoryMutation,
} = categoriesApi;

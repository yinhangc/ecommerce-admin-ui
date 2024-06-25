import { getBaseQuery } from '@/lib/rtk-query';
import { createApi } from '@reduxjs/toolkit/query';
import { Category } from '../types/categories';

export const categoriesApi = createApi({
  reducerPath: 'categoriesApi',
  baseQuery: getBaseQuery('categories'),
  endpoints: (builder) => ({
    listCategory: builder.query<Category[], void>({
      query: (id) => ({ url: '/' }),
    }),
  }),
});

export const {} = categoriesApi;

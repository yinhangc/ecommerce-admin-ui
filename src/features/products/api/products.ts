import { getBaseQuery } from '@/lib/rtk-query';
import { createApi } from '@reduxjs/toolkit/query/react';
import { TListProduct } from '../types/listProduct';
import { TProduct } from '../types/upsertProduct';
import { TListQuery } from '@/types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: getBaseQuery('products'),
  endpoints: (builder) => ({
    createProduct: builder.mutation<TProduct, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
    }),
    listProducts: builder.mutation<
      { rows: TListProduct[]; count: number },
      TListQuery
    >({
      query: (body) => ({
        url: '/list',
        method: 'POST',
        body,
      }),
    }),
    getProduct: builder.query<TProduct, string>({
      query: (id) => ({ url: `/${id}` }),
      // TODO: remove isEditing here
      transformResponse: (response: TProduct, meta, arg) => {
        for (const option of response.options) option.isEditing = false;
        return response;
      },
    }),
    updateProduct: builder.mutation<TProduct, FormData>({
      query: (formData) => ({
        url: `/${formData.get('id')}`,
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useListProductsMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} = productsApi;

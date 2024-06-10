import { getBaseQuery } from '@/lib/rtk-query';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ListProductPayload, Product, ProductInList } from '../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: getBaseQuery('products'),
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: '',
        method: 'POST',
        body: formData,
      }),
    }),
    listProduct: builder.mutation<
      { rows: ProductInList[]; count: number },
      ListProductPayload
    >({
      query: (body) => ({
        url: '/list',
        method: 'POST',
        body,
      }),
    }),
    getProduct: builder.query<Product, string>({
      query: (id) => ({ url: `/${id}` }),
      transformResponse: (response: Product, meta, arg) => {
        for (const option of response.options) option.isEditing = false;
        return response;
      },
    }),
    updateProduct: builder.mutation<Product, FormData>({
      query: (formData) => ({
        url: `/${formData.get('id')}`,
        // url: '',
        method: 'PUT',
        body: formData,
      }),
    }),
  }),
});

export const {
  useCreateProductMutation,
  useListProductMutation,
  useGetProductQuery,
  useUpdateProductMutation,
} = productsApi;

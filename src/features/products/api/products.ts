import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Product } from '../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://127.0.0.1:8888/v1/api/products`,
  }),
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useCreateProductMutation } = productsApi;

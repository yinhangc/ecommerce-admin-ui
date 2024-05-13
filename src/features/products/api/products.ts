import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { ListProductPayload, Product, ProductInList } from '../types';

export const productsApi = createApi({
  reducerPath: 'productsApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `http://127.0.0.1:8888/v1/api/products`,
  }),
  endpoints: (builder) => ({
    createProduct: builder.mutation<Product, Product>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
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
    updateProduct: builder.mutation<Product, Product & Pick<Product, 'id'>>({
      query: ({ id, ...body }) => ({
        url: `/${id}`,
        method: 'PUT',
        body,
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

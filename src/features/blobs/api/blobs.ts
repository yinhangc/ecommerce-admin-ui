import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const blobsApi = createApi({
  reducerPath: 'blobsApi',
  baseQuery: fetchBaseQuery({ baseUrl: `http://127.0.0.1:8888/v1/api/blobs` }),
  endpoints: (builder) => ({
    uploadFiles: builder.mutation<string[], FormData>({
      query: (body) => ({
        url: '',
        method: 'POST',
        body,
      }),
    }),
  }),
});

export const { useUploadFilesMutation } = blobsApi;

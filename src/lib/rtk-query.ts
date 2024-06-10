import {
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  fetchBaseQuery,
} from '@reduxjs/toolkit/query';

interface IResponse {
  code: number;
  message: string;
  data: unknown;
}

const rawBaseQuery = (baseUrl: string) => fetchBaseQuery({ baseUrl: baseUrl });

export const getBaseQuery = (
  path: string,
): BaseQueryFn<string | FetchArgs, unknown, FetchBaseQueryError> => {
  return async (args, api, extraOptions) => {
    const response = await rawBaseQuery(`http://127.0.0.1:8888/v1/api/${path}`)(
      args,
      api,
      extraOptions,
    );
    console.log('getBaseQuery response error', response.error);
    // only extract "data" from api response
    if (response.data) {
      response.data = (response.data as IResponse).data;
    }
    return response;
  };
};

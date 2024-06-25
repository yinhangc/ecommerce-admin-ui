import { blobsApi } from '@/features/blobs/api/blobs';
import { categoriesApi } from '@/features/products/api/categories';
import { productsApi } from '@/features/products/api/products';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [categoriesApi.reducerPath]: categoriesApi.reducer,
    [blobsApi.reducerPath]: blobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productsApi.middleware,
      categoriesApi.middleware,
      blobsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

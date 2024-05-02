import { blobsApi } from '@/features/blobs/api/blobs';
import { productsApi } from '@/features/products/api/products';
import { configureStore } from '@reduxjs/toolkit';

export const store = configureStore({
  reducer: {
    [productsApi.reducerPath]: productsApi.reducer,
    [blobsApi.reducerPath]: blobsApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat([
      productsApi.middleware,
      blobsApi.middleware,
    ]),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

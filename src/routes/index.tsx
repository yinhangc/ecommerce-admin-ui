import { Orders } from '@/features/orders';
import { ProductsRoute } from '@/features/products/routes';
import { Navigate, useRoutes } from 'react-router-dom';

export const AppRoutes = () => {
  const element = useRoutes([
    { path: '/products/*', element: <ProductsRoute /> },
    { path: '/orders', element: <Orders /> },
    { path: '*', element: <Navigate to="/products/list" /> },
  ]);
  return <>{element}</>;
};

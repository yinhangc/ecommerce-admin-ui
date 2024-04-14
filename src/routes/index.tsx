import { Orders } from '@/features/orders';
import { ProductsRoute } from '@/features/products/routes';
import { useRoutes } from 'react-router-dom';

export const AppRoutes = () => {
  const element = useRoutes([
    { path: '/products/*', element: <ProductsRoute /> },
    { path: '/orders', element: <Orders /> },
  ]);
  return <>{element}</>;
};

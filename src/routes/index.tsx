import { Orders } from '@/features/orders';
import { Products } from '@/features/products';
import { useRoutes } from 'react-router-dom';

export const AppRoutes = () => {
  const element = useRoutes([
    { path: '/products', element: <Products /> },
    { path: '/orders', element: <Orders /> },
  ]);
  return <>{element}</>;
};

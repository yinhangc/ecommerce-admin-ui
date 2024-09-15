import { RouteItem } from '@/types';
import { faTag } from '@fortawesome/free-solid-svg-icons';
import { Categories } from './Categories';
import { CategoryDetail } from './CategoryDetail';
import { CreateCategory } from './CreateCategory';
import { CreateProduct } from './CreateProduct';
import { ListProduct } from './ListProduct';
import { ProductDetail } from './ProductDetail';

export const productsRoutes: RouteItem[] = [
  {
    path: '/products',
    icon: faTag,
    name: '產品',
    isNav: true,
    element: null,
    children: [
      {
        path: '/list',
        element: <ListProduct />,
        name: '檢視產品',
        isNav: true,
      },
      {
        path: '/list/:id',
        element: <ProductDetail />,
      },
      {
        path: '/create',
        element: <CreateProduct />,
        name: '創建產品',
        isNav: true,
      },
      {
        path: '/categories',
        element: <Categories />,
        name: '管理分類',
        isNav: true,
      },
      {
        path: '/categories/create',
        element: <CreateCategory />,
      },
      {
        path: '/categories/:id',
        element: <CategoryDetail />,
      },
    ],
  },
];

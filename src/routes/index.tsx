import { configurationsRoutes } from '@/features/configurations/routes';
import { productsRoutes } from '@/features/products/routes';
import { Navigate, useRoutes } from 'react-router-dom';

export const routeItems = [...productsRoutes, ...configurationsRoutes];

export const AppRoutes = () => {
  const convertRouteItemsToRouteObjects = () => {
    const routeObjects = [];
    for (const item of routeItems) {
      if (!!item.element) {
        routeObjects.push({
          path: item.path,
          element: item.element,
        });
      }
      if (Array.isArray(item.children)) {
        for (const child of item.children) {
          if (child.element)
            routeObjects.push({
              path: item.path + child.path,
              element: child.element,
            });
        }
      }
    }
    return routeObjects;
  };

  const element = useRoutes([
    ...convertRouteItemsToRouteObjects(),
    { path: '*', element: <Navigate to="/products/list" /> },
  ]);

  return <>{element}</>;
};

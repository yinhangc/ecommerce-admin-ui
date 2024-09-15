import { RouteItem } from '@/types';
import { faGear } from '@fortawesome/free-solid-svg-icons';
import { Navigation } from './Navigation';

export const configurationsRoutes: RouteItem[] = [
  {
    path: '/configurations',
    element: null,
    name: '配置',
    icon: faGear,
    isNav: true,
    children: [
      {
        path: '/navigation',
        element: <Navigation />,
        name: '管理瀏覽',
        isNav: true,
      },
    ],
  },
];

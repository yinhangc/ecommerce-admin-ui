import { IconProp } from '@fortawesome/fontawesome-svg-core';

export type RouteItem = {
  path: string;
  icon?: IconProp;
} & (
  | { isNav: true; name: string } // If isNav is true, name is required
  | { isNav?: never; name?: string }
) &
  (
    | { children: RouteItem[]; element: null } // If there are children, element must be null
    | { children?: never; element: React.ReactNode }
  );

export type TListQuery = {
  skip: number;
  take: number;
  filter: { [key: string]: string | number };
  orderBy: { [key: string]: 'asc' | 'desc' }[];
};

export type TCategoryInList = {
  id: number;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  parent: TCategoryInList;
};

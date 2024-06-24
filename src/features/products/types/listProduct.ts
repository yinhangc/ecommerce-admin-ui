export type ListProductPayload = {
  skip: number;
  take: number;
  filter: { [key: string]: string | number };
  orderBy: { [key: string]: 'asc' | 'desc' }[];
};

export type ProductInList = {
  id: number;
  name: string;
  description: string;
  skus: {
    sku: string;
    price: number;
  }[];
  status: 'ACTIVE' | 'INACTIVE';
  createdAt: string;
  updatedAt: string;
};

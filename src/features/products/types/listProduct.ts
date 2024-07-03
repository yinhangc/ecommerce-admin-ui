export type TListProduct = {
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

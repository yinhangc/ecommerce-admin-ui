import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { ProductForm } from '../components/ProductForm';

export const CreateProduct = () => {
  return (
    <NavigationLayout>
      <h2 className="mb-4 text-2xl font-medium">創建產品</h2>
      <ProductForm />
    </NavigationLayout>
  );
};

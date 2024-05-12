import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { UpsertProductForm } from '../components/UpsertProductForm';

export const CreateProduct = () => {
  return (
    <NavigationLayout>
      <h2 className="mb-4 text-2xl font-medium">創建產品</h2>
      <UpsertProductForm />
    </NavigationLayout>
  );
};

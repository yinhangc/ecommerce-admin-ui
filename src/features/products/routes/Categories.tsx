import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { Link } from 'react-router-dom';

export const Categories = () => {
  return (
    <NavigationLayout>
      <div className="mb-4 flex justify-between">
        <h2 className="text-2xl font-medium">管理分類</h2>
        <Link
          to="/products/categories/create"
          className="bg-orange rounded px-4 py-2 text-white"
        >
          創建
        </Link>
      </div>
    </NavigationLayout>
  );
};

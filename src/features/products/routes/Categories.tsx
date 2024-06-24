import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { Link } from 'react-router-dom';

export const Categories = () => {
  return (
    <NavigationLayout>
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-2xl font-medium">管理分類</h2>
        <Link
          to="/products/categories/create"
          className="rounded bg-blue-600 px-4 py-2 text-white"
        >
          創建
        </Link>
      </div>
    </NavigationLayout>
  );
};

import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';
import { ProductCategoryForm } from '../components/ProductCategoryForm';

export const CreateCategory = () => {
  return (
    <NavigationLayout>
      <div className="mb-4 flex items-center gap-x-4">
        <button>
          <Link to="/products/categories">
            <FontAwesomeIcon icon={faArrowLeftLong} />
          </Link>
        </button>
        <h2 className="text-2xl font-medium">創建分類</h2>
      </div>
      <ProductCategoryForm />
    </NavigationLayout>
  );
};

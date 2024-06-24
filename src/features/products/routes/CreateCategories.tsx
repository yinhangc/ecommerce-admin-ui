import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { UpsertCategoryForm } from '../components/UpsertCategoryForm';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';

export const CreateCategories = () => {
  return (
    <NavigationLayout>
      <h2 className="mb-4 flex items-center gap-2 text-2xl font-medium">
        管理分類
        <FontAwesomeIcon icon={faChevronRight} className="h-4 w-4" />
        創建
      </h2>
      <UpsertCategoryForm />
    </NavigationLayout>
  );
};

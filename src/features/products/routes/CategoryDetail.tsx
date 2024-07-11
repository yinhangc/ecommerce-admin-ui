import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { Loader } from '@/components/Ui/Loader';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';
import { useGetCategoryQuery } from '../api/categories';
import { UpsertCategoryForm } from '../components/UpsertCategoryForm';

export const CategoryDetail = () => {
  const { id: categoryId } = useParams();
  const { data, isLoading, refetch } = useGetCategoryQuery(
    categoryId as string,
  );

  return (
    <NavigationLayout>
      {isLoading && (
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <Loader size="large" />
        </div>
      )}
      {!isLoading && (
        <>
          <div className="mb-4 flex items-center gap-x-4">
            <button>
              <Link to="/products/categories">
                <FontAwesomeIcon icon={faArrowLeftLong} />
              </Link>
            </button>
            <h2 className=" text-2xl font-medium">分類詳情 #{categoryId}</h2>
          </div>
          <UpsertCategoryForm existingData={data} loadData={refetch} />
        </>
      )}
    </NavigationLayout>
  );
};

import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';
import { useGetProductQuery } from '../api/products';
import { UpsertProductForm } from '../components/UpsertProductForm';
import { Loader } from '@/components/Ui/Loader';

export const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useGetProductQuery(productId as string);

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
            <button onClick={() => navigate(-1)}>
              <FontAwesomeIcon icon={faArrowLeftLong} />
            </button>
            <h2 className="text-2xl font-medium">產品詳情 #{productId}</h2>
          </div>
          <UpsertProductForm existingData={data} loadData={refetch} />
        </>
      )}
    </NavigationLayout>
  );
};

import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { Loader } from '@/components/Ui/Loader';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link, useParams } from 'react-router-dom';
import { useGetProductQuery } from '../api/products';
import { ProductForm } from '../components/ProductForm';

export const ProductDetail = () => {
  const { id: productId } = useParams();
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
            <button>
              <Link to="/products/list">
                <FontAwesomeIcon icon={faArrowLeftLong} />
              </Link>
            </button>
            <h2 className=" text-2xl font-medium">產品詳情 #{productId}</h2>
          </div>
          <ProductForm existingData={data} loadData={refetch} />
        </>
      )}
    </NavigationLayout>
  );
};

import { NavigationLayout } from '@/components/Layout/NavigationLayout';
import { faArrowLeftLong } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useNavigate, useParams } from 'react-router-dom';

export const ProductDetail = () => {
  const { id: productId } = useParams();
  const navigate = useNavigate();

  return (
    <NavigationLayout>
      <div className="mb-4 flex items-center gap-x-4">
        <button onClick={() => navigate(-1)}>
          <FontAwesomeIcon icon={faArrowLeftLong} />
        </button>
        <h2 className="text-2xl font-medium">產品詳情 #{productId}</h2>
      </div>
    </NavigationLayout>
  );
};

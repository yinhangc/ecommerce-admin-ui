import { Navigate, Route, Routes } from 'react-router-dom';
import { CreateProduct } from './CreateProduct';
import { ListProducts } from './ListProducts';
import { ProductDetail } from './ProductDetail';

export const ProductsRoute = () => {
  return (
    <Routes>
      <Route path="/list" element={<ListProducts />}></Route>
      <Route path="/create" element={<CreateProduct />}></Route>
      <Route path="/list/:id/details" element={<ProductDetail />}></Route>
      <Route path="*" element={<Navigate to="/products/list" />}></Route>
    </Routes>
  );
};

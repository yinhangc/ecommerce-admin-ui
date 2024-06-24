import { Navigate, Route, Routes } from 'react-router-dom';
import { Categories } from './Categories';
import { CreateProduct } from './CreateProduct';
import { ListProducts } from './ListProducts';
import { ProductDetail } from './ProductDetail';
import { CreateCategories } from './CreateCategories';

export const ProductsRoute = () => {
  return (
    <Routes>
      <Route path="/list" element={<ListProducts />}></Route>
      <Route path="/list/:id" element={<ProductDetail />}></Route>
      <Route path="/create" element={<CreateProduct />}></Route>
      <Route path="/categories" element={<Categories />}></Route>
      <Route path="/categories/create" element={<CreateCategories />}></Route>
      <Route path="*" element={<Navigate to="/products/list" />}></Route>
    </Routes>
  );
};

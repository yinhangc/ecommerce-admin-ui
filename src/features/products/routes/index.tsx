import { Navigate, Route, Routes } from 'react-router-dom';
import { Categories } from './Categories';
import { CategoryDetail } from './CategoryDetail';
import { CreateCategory } from './CreateCategory';
import { CreateProduct } from './CreateProduct';
import { ListProduct } from './ListProduct';
import { ProductDetail } from './ProductDetail';

export const ProductsRoute = () => {
  return (
    <Routes>
      <Route path="/list" element={<ListProduct />}></Route>
      <Route path="/list/:id" element={<ProductDetail />}></Route>
      <Route path="/create" element={<CreateProduct />}></Route>
      <Route path="/categories" element={<Categories />}></Route>
      <Route path="/categories/create" element={<CreateCategory />}></Route>
      <Route path="/categories/:id" element={<CategoryDetail />}></Route>
      <Route path="*" element={<Navigate to="/products/list" />}></Route>
    </Routes>
  );
};

import { Navigate, Route, Routes } from "react-router-dom";
import { AddProduct } from "./AddProduct";
import { ListProduct } from './ListProduct';

export const ProductsRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products/list" />}></Route>
      <Route path="/list" element={<ListProduct />}></Route>
      <Route path="/add" element={<AddProduct />}></Route>
    </Routes>
  );
};

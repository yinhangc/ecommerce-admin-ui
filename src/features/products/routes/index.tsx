import { Navigate, Route, Routes } from "react-router-dom";
import { AddProduct } from "./AddProduct";

export const ProductsRoute = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/products/add" />}></Route>
      <Route path="/add" element={<AddProduct />}></Route>
    </Routes>
  );
};

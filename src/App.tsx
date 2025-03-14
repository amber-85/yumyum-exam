import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { Routes, Route } from "react-router-dom";
import MenuPage from "./pages/menu/menupage";
import CartPage from "./pages/cart/cartpage";
import OrderPage from "./pages/order/orderpage";
import "./App.css";
import ReceiptPage from "./pages/receipt";

function App() {
  return (
    <Routes>
      <Route path="/" element={<MenuPage />} />
      <Route path="/cart" element={<CartPage />} />
      <Route path="/receipt" element={<ReceiptPage />} />
      <Route path="/order" element={<OrderPage />}></Route>
    </Routes>
  );
}

export default App;

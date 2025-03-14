import Cart from "../../components/cartlist";
import Header from "../../components/header";
import "./cart.scss"


const CartPage = () => {
  return (
    <div className="cart">
      <Header/>
      <Cart />
    </div>
  );
};

export default CartPage;

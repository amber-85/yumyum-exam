
import OrderList from "../../components/orderlist";
import "./order.scss"


const OrderPage = () => {
    return (
        <div className="order__wrapper">
            <img src="src/imgs/menulogo.svg" alt="menu logo" className="logo"/>
            <OrderList/>    
        </div>
    )}

export default OrderPage;

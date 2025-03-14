import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import { RootState, AppDispatch} from "../redux/store";
import { useNavigate } from "react-router-dom";


const Header:React.FC=()=>{
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate();
    const handleCart= ()=>{
        navigate("/cart")
    }
    const{cartQuantity}=useSelector((state:RootState)=>state.cart);
    return(
        <header className="header">
            <section className="logo__frame">
            <img src="src/imgs/menulogo.svg" alt="menu logo" className="logo__frame__img"/>
            </section>
            <section className="cart__group">
                <p className="cart__group__quantity">{cartQuantity}</p>
                <img 
                    src="src/imgs/cart.svg" 
                    alt="cart icon" 
                    className="cart__group__img" 
                    onClick={handleCart}
                    />
            </section>
        </header>
    )
}

export default Header;
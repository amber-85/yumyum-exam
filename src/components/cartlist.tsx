import React from "react";
import { useDispatch,useSelector } from "react-redux";
import { RootState, AppDispatch } from "../redux/store";
import {incrementQuantity,decrementQuantity,deleteItem,submitOrder } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";
import {FaTrash} from "react-icons/fa";

const Cart:React.FC=()=>{
    // dispach the reducers
    const dispatch=useDispatch<AppDispatch>();
    const navigate=useNavigate(); //initialize useNavigate for futher use in the button of submit order;
    
    // accessing the cart state from redux store
    const {items,total,status}=useSelector((state:RootState)=>state.cart);



    return (
        <article className="cart__container">
            <h2 className="cart__container__title">varukorgen</h2>

            {items.length===0? (
                <section className="cart__container__empty">
                       <h2 className="cart__container__empty__cart">Din korg är tom! Beställ nu!</h2>
                    <button 
                    className="order__frame__btn" 
                    onClick={()=> navigate("/")}>GÖR EN NY BESTÄLLNING</button>
                </section>             
            ):(
            <article className="cart__container__order">
            {items.map((item)=>(
                <article className="cart__container__order__list" key={item.id}>
                    <section className="cart__container__order__list__item">
                        <p className="cart__container__order__list__item--title">{item.name}</p>
                        <section className="cart__container__order__list__item--dotted">..................</section>
                        <p className="cart__container__order__list__item--price">${item.itemTotalPrice}</p>
                    </section>
                    <section className="cart__container__order__list__item__btn">
                        <button className="cart__container__order__list__item__btn__decrement" onClick={()=>dispatch(decrementQuantity(item.id))}>-</button>
                        <section className="cart__container__order__list__item__btn__amount">{item.quantity}</section>
                        <button className="cart__container__order__list__itemt__btn__incremen" onClick={()=>dispatch(incrementQuantity(item.id))}>+</button>   
                        <button className="cart__container__order__list__item__btn__delete"  onClick={()=>dispatch(deleteItem(item.id))}>
                            <FaTrash />
                        </button>    
                    </section>                  
                </article>
            ))}
       
                <article className="cart__container__order__total">
                    <section className="cart__container__order__total__title">TOTAL</section>
                    <section className="cart__container__order__total__price"> {total} SEK</section>
                </article>
                <button 
                    className="cart__container__order__btn" 
                    onClick={async ()=>{const result=await dispatch(submitOrder());
                        if(result.meta.requestStatus==="fulfilled"){
                            navigate("/order");
                        }
                    }}                   
                    disabled={status==="loading"}>{status==="loading"? "Processing...": "TAKE MY MONEY!"}</button>
            </article>
            )}
        </article> 
)};

export default Cart;

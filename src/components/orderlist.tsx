import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { RootState,AppDispatch } from "../redux/store";
import { submitOrder } from "../redux/cartSlice";
import { useNavigate } from "react-router-dom";

const OrderList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate=useNavigate();
    const { orderId, orderState, etaTime, status } = useSelector((state: RootState) => state.cart);

    useEffect(() => {
        // Trigger the submitOrder to place the order
        dispatch(submitOrder());
    }, [dispatch]);


    // I learned that I can use useMemo to calculate the estimated time, but then I feel this is to complicated, and came up with the idea
    //to create a etaTime state in my cartState, and to calculate it in the extra reducers and store it in the cartState.
    // const etaTimeInMinutes = useMemo(() => {
    //     if (!eta || !timestamp) return null; // Ensure values exist before calculation
    //     const etaDate = new Date(eta);
    //     const timestampDate = new Date(timestamp);
    //     const differenceInMilliseconds = etaDate.getTime() - timestampDate.getTime();
    //     return Math.round(differenceInMilliseconds / (1000 * 60)); // Convert to minutes and round
    // }, [eta, timestamp]);



    // Loading or success state
    if (status === "loading") {
        return <div>Loading your order...</div>;
    }

    return (
        <section className="order">
            <section className="order__icon">
                        <img src="src/imgs/boxtop 1.png" alt="order image" className="order__icon__img" />
                    </section>
            {orderState === "waiting" ? (
                <article className="order__frame">                
                    <h2 className="order__frame__title">Dina wontons tillagas</h2>
                    <p className="order__frame__eta">Estimated Time:  {etaTime} minutes</p>
                    <p className="order__frame__orderid">Order Number: #{orderId}</p>
                    <button 
                        className="order__frame__btn" 
                        onClick={()=> navigate("/")}>GÖR EN NY BESTÄLLNING
                    </button>
                </article>
            ) : (
                <section className="order">
                    <h2 className="order__frame__title">Your order is complete!</h2>
                    <p className="order__frame__orderid">Order Number: #{orderId}</p>
                    <button 
                    className="order__frame__btn" 
                    onClick={()=> navigate("/")}>GÖR EN NY BESTÄLLNING</button>
                </section>
            )}
        </section>
    );
};

export default OrderList;

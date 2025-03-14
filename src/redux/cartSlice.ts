import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import {Food} from './menuSlice';  //import Food interface from menuSlice maybe I should create a type file to store all interfaces
import { placeOrder, registerTenant, fetchOrder } from "./orderState";

// use extends to inherit the Food interfaceand add a quantity property

interface CartItem extends Food{
    quantity:number;
    itemTotalPrice:number;
}

// state type
interface CartState{
    items:CartItem[];
    total:number;
    itemTotalPrice:number;
    cartQuantity:number;
    orderId:string|null;
    receipt:any|null;
    status:"idle"|"loading"|"success"|"error";  
    tenantId:string | null;
    eta:string|null;
    timestamp:string|null;
    etaTime:number|null;
    orderState:string|null;
}

// initial state
const savedTenantId=localStorage.getItem("tenantId");

const initialState:CartState={
    items:[],
    total:0,
    cartQuantity:0,
    itemTotalPrice:0,
    orderId:null,
    receipt:null,
    status:"idle",
    tenantId:savedTenantId? savedTenantId: null,
    eta:null,
    orderState:null,
    timestamp:null,
    etaTime:null
};


// async action to register Tenant, place order, and fetch order number and receipt;
export const submitOrder=createAsyncThunk(
    "cart/submitOrder",
    async(_, {getState, dispatch})=>{
        const state=getState() as {cart:CartState};

        // get tenantId from Redux, or hard code it in the code
        let tenantId=state.cart.tenantId || "47c3";
        if(!tenantId){
            tenantId=await dispatch(registerTenant()).unwrap();
            if (!tenantId) throw new Error ("Fialed to get tenantId");
        }
        
        // prepar order items with the item id, make sure which data type the API accept!!!!!!!
        const orderItems=state.cart.items.map(item=>item.id);

        // submit order
        const orderId=await placeOrder(tenantId, orderItems);
        
        // return specific data that need to be used
        const  orderData = await fetchOrder(tenantId, orderId);
            return{
            orderId:orderData.order.id,
            orderState:orderData.order.state,
            eta:orderData.order.eta,
            timestamp:orderData.order.timestamp
        }
    }
);




// create cart slice
const cartSlice=createSlice({
    name:"cart",
    initialState,
    reducers:{
        // try to catch the tenantID, it worked perfectly until I turned off my laptop. 
        // the data will be of course cleaned, so i tried to retrive the tenantId, which has failed
        //so i came up with the solution that to check if there is stored tenant Id in my localstorage 
        // and redux store, if no, use the hard code id, if none of them, create a new tenant. 

        setTenantId:(state, action:PayloadAction<string>)=>{
            state.tenantId=action.payload;
            localStorage.setItem("tenantId", action.payload);
        },
        // add item to cart, calcuate how many items have been added to the cart, and total price of the order
        addToCart:(state,action:PayloadAction<Food>)=>{
            const existingItem=state.items.find((item)=>item.id===action.payload.id);
            if(existingItem){
                existingItem.quantity+=1;
                existingItem.itemTotalPrice=existingItem.price*existingItem.quantity
            } else{
                state.items.push({...action.payload,quantity:1,itemTotalPrice:action.payload.price});
            }
            state.total+=action.payload.price
            state.cartQuantity=state.items.reduce((total,item)=>total+item.quantity,0);
        },

    // increase quantity of each item
        incrementQuantity:(state, action:PayloadAction<number>)=>{
            const item=state.items.find((item)=>item.id===action.payload);
            if(item){
                item.quantity+=1;
                item.itemTotalPrice=item.price*item.quantity
                state.total+=item.price;
                state.cartQuantity=state.items.reduce((total,item)=>total+item.quantity,0);
            }
        },

        // decrease quantity of each item

        decrementQuantity:(state,action:PayloadAction<number>)=>{
            const item=state.items.find((item)=>item.id===action.payload);
            if (item && item.quantity>1){
                item.quantity-=1;
                item.itemTotalPrice=item.price*item.quantity
                state.total-=item.price;
                state.cartQuantity=state.items.reduce((total,item)=>total+item.quantity,0);
            }
           
        },

        // delete item from cart
        deleteItem:(state,action:PayloadAction<number>)=>{
            const itemToDelete=state.items.find((item)=>item.id===action.payload);
            if(itemToDelete){
                state.total-=itemToDelete.price*itemToDelete.quantity;
                state.items=state.items.filter((item)=>item.id!==action.payload); 
                state.cartQuantity=state.items.reduce((total,item)=>total+item.quantity,0); 
            }
        },

        clearCart: (state) => {
            state.cartQuantity = 0;
        }
    },

    extraReducers:(builder)=>{
        builder
        .addCase(submitOrder.pending, (state)=>{
            state.status="loading";
        })
        .addCase(submitOrder.fulfilled, (state,action)=>{
            state.status="success";
            state.orderId=action.payload.orderId;
            state.eta=action.payload.eta;
            state.orderState=action.payload.orderState;            
            state.eta=action.payload.eta;
            state.timestamp=action.payload.timestamp;

            // calcualte the estTime here and update it in the cartState
            if (state.eta && state.timestamp){
                const etaData=new Date(state.eta);
                const timestampData=new Date(state.timestamp);
                state.etaTime=Math.round((etaData.getTime()-timestampData.getTime())/(1000*60));
            }
            
            // Clear cart after placing the order
            cartSlice.caseReducers.clearCart(state);
        })
     
        .addCase(submitOrder.rejected, (state,action)=>{
            state.status="error";
            console.error("Order submission failed", action.payload);
        });
    }
});

export const {setTenantId, addToCart,incrementQuantity,decrementQuantity,deleteItem}=cartSlice.actions;
export default cartSlice.reducer;

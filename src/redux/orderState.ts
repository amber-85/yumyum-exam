
// register Tenant

import { createAsyncThunk } from "@reduxjs/toolkit";
import { setTenantId } from "./cartSlice";

// fetch apiKey

const fetchApiKey=async ()=>{
    const keyResponse=await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys',{
    method:'POST'});

    if (!keyResponse.ok) throw new Error ("Failed to fetch API key")
    const keyData=await keyResponse.json();
    const apiKey=keyData.key;
    return apiKey;
}

// registerTenant 
export const registerTenant=createAsyncThunk(
    "cart/registerTenant",
    async (_, {dispatch})=>{
        try{
            const apiKey=await fetchApiKey();
            
            const tenantName="anbo-amber"; 
            //register tenant under my name, but it can only register once and the id unretrivable, hence i tried to store it
            //in localStorage and redux store, however, when i turned off laptop, all data has been cleaned. I undertand that I may solve this problem by 
            //updating local storage settings, but since i don't have enough time to solve this, i tried another method, to create a dynamic name everytime
            //if there is no tenantId stored in my redux and localStorage. but finally, I hard code the tenant Id I fetched from "anbo-amber" in the code. And with the submitOrder()
            //I will check redux store, if there is a Id, it will be used directly, if there isn't id, a new registerTenant function will be called.




            // const tenantName=`anbo-${Date.now()}`; I tried to create tenant with a dynamic name everytime,
            const response= await fetch ('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/tenants',{
                method:'POST',
                headers:{
                    "Content-Type": "application/json",
                    "x-zocom": apiKey
                },
                body:JSON.stringify({name:tenantName})
           
            });
          
            console.log('Response Status:', response.status);
    
            if (!response.ok) {
                const errorData=await response.json();
                console.error("tenant registeration failed:", errorData);
                throw new Error (`Failed to register tenant:${errorData.message||response.statusText}`);
            };
    
            const data=await response.json();
            console.log('Response Data:', data);
            console.log("tenant Id:", data.id)

            dispatch(setTenantId(data.id)); //dispatch and store the tennatId in redux;
            return data.id // return a tenant ID
           
            }catch (error){
            console.error ("Error registering tenant:", error);
            return null;
        }
    }
)
   
// Helper function to calculate ETA time in minutes


  
// submit order
export const placeOrder=async (tenantId:string, items:any[])=>{
    try{
        const apiKey=await fetchApiKey();

        const response=await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders`,{
            method:'POST',
            headers:{
                "Content-Type": "application/json",
                "x-zocom": apiKey
            },
            body: JSON.stringify({    
                items,            
            }),
        });
        console.log("resonse status:", response.statusText);

        if (!response.ok) {
            const errorData=await response.json();
            console.error("error in place order:", errorData);
            throw new Error(`Failed to place order: ${errorData.message||response.statusText}`);
        }

         const data=await response.json();
         console.log("order placed successfully:", data);
         console.log("order id",data.order.id)
         console.log("eta:", data.order.eta)

         const orderId=data.order?.id;
         if (!orderId){
            throw new Error("failed to get order ID");
         }
            return orderId;        
        }catch(error){
            console.error("Error placing order:", error);
            return null;
        }

};




export const fetchOrder = async(tenantId:string, orderId:string)=>{
    try{
        const apiKey=await fetchApiKey();
        const response=await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/${tenantId}/orders/${orderId}`,{
            method:'GET',
            headers:{"x-zocom": apiKey}
        });
        console.log("response status:", response.status)

        if (!response.ok) 
            {console.log("failed to fetch order eta:", response.statusText); //to check API error with fetchOrder
            throw new Error ("Failed to fetch receipt:")}

        const orderData=await response.json();
        console.log("order data:", orderData); //log orderData to check the API

        return orderData //return entire data set
    }
        catch(error){
        console.error("failed to fetch order:", error);
        throw error;
    };


};

// export const fetchReceipt=async(orderId:string)=>{
//     try{
//         const apiKey=await fetchApiKey();
//         const response=await fetch(`https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/receipts/${orderId}`,{
//             method:'GET',
//             headers:{"x-zocom": apiKey}
//         });
//         console.log("response status:", response.status)

//         if (!response.ok) 
//             {console.log("failed to fetch order eta:", response.statusText); //to check API error with fetchOrder
//             throw new Error ("Failed to fetch receipt:")}

//         const receiptData=await response.json();
//         console.log("order data:", receiptData); //log orderData to check the API

//         return receiptData //return entire data set
//     }catch(error){
//     console.error("failed to fetch receipt:", error);
//     throw error;
// };
// } don't have time to create the receipt. 




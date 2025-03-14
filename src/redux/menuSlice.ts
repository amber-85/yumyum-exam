import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

export interface Food{
    id: number,
    type: string,
    name: string,
    description: string,
    price: number,
    ingredients: string[]
}

export interface MenuState{
    items: Food[],
    loading:boolean,
    error:string | null,
}

const initialState: MenuState = {
    items: [],
    loading: false,
    error:null,

}

export const fetchMenu = createAsyncThunk('menu/fetchMenu', async () => {
    const keyResponse = await fetch('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/keys',{
        method:'POST'});
    const keyData = await keyResponse.json();
    const apiKey=keyData.key;
    const menuResponse=await fetch ('https://fdnzawlcf6.execute-api.eu-north-1.amazonaws.com/menu',{
        method:'GET',
        headers:{
            'x-zocom': apiKey
        }
    });
    const menuData=await menuResponse.json();
    let menuList=menuData.items;

    console.log(menuList);
    return menuList;
});

// create menu slice

const menuSlice=createSlice({
    name:"menu",
    initialState,
    reducers:{},
    extraReducers:(builder)=>{
        builder
        .addCase(fetchMenu.pending,(state)=>{
            state.loading=true;
            state.error=null;
        })
        .addCase(fetchMenu.fulfilled,(state,action)=>{
            state.loading=false;
            state.items=action.payload;
        })
        .addCase(fetchMenu.rejected,(state,action)=>{
            state.loading=false;
            state.error=action.error.message||"Fail to load menu"
        });
    },
});

export default menuSlice.reducer;
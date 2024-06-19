import { combineReducers } from "@reduxjs/toolkit";
import userSlice from "../slices/userSlice";
import productSlice from "slices/productSlice";


const rootReducer = combineReducers({
    user: userSlice,
    products: productSlice
})

export default rootReducer;
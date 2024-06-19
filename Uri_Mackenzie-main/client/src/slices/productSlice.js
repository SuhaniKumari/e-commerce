import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    cart: null,
    wishlist: null,
    orders: null,
    products: [],
    categories: [],
    returnProducts: [],
    colors: [],
    quickView: null
};

const productSlice = createSlice({
    name: "product",
    initialState: initialState,
    reducers: {
        setCart(state, value) {
            state.cart = value.payload;
        },
        setWishlist(state, value) {
            state.wishlist = value.payload;
        },
        setOrders(state, value) {
            state.orders = value.payload;
        },
        setProducts(state, value) {
            state.products = value.payload;
        },
        setCategories(state, value) {
            state.categories = value.payload;
        },
        setReturn(state, value) {
            state.returnProducts = value.payload;
        },
        setColors(state, value) {
            state.colors = value.payload;
        },
        setQuickView(state, value){
            state.quickView = value.payload;
        }
    },
});

export const { setCart, setWishlist, setOrders, setProducts, setCategories, setReturn, setColors, setQuickView } = productSlice.actions;

export default productSlice.reducer;
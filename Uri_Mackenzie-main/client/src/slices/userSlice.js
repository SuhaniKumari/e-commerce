import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: null,
    token: false,
    isLogin: localStorage.getItem("loggedIn") ? JSON.parse(localStorage.getItem("loggedIn")) : null
};

const userSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        setUser(state, value) {
            state.user = value.payload;
        },
        setToken(state, value) {
            state.token = value.payload;
        },
        setIsLogin(state, value) {
            state.isLogin = value.payload;
        }
    },
});

export const { setUser, setToken, setIsLogin } = userSlice.actions;

export default userSlice.reducer;
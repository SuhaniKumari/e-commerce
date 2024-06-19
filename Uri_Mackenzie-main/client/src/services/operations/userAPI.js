import toast from "react-hot-toast";
import { apiConnector } from "services/apiConnector";
import { userEndpoints } from "services/apis";
import { setIsLogin, setToken, setUser } from "slices/userSlice";

const { SIGN_UP, SIGN_IN, GET_USER, GET_ADDRESS, ADD_ADDRESS, UPDATE_ADDRESS, REMOVE_ADDRESS, GET_TOKEN, UPDATE_USER } = userEndpoints;


export const signupUser = async (data, setter) => {
    const toastId = toast.loading('Signing Up...');
    try {
        const response = await apiConnector('POST', SIGN_UP, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data?.message);
            setter('/login');
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const signinUser = async (data, dispatch) => {
    const toastId = toast.loading('Signing In...');
    try {
        const response = await apiConnector('POST', SIGN_IN, data, null, null, null)

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message)
            dispatch(setToken(true));
            sessionStorage.setItem('token', response.data.token);
            getUser(dispatch)
            localStorage.setItem('loggedIn', true);
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const getUser = async (dispatch) => {
    try {
        const response = await apiConnector('GET', GET_USER);
        if (response.data.success) {
            dispatch(setIsLogin(true));
            dispatch(setUser(response.data.user));
        }
        else {
            dispatch(setToken(null));
            localStorage.removeItem("loggedIn");
        }
    } catch (err) {
        dispatch(setToken(null));
        localStorage.removeItem("loggedIn");
        toast.error(err?.response?.data?.message);
    }
}

export const getToken = async (dispatch) => {
    try {
        const response = await apiConnector('GET', GET_TOKEN);

        if (response.data.success) {
            dispatch(setToken(true));
            getUser(dispatch)
        }

    } catch (err) {
        dispatch(setToken(null))
        localStorage.removeItem("loggedIn");
    }
}

export const getAddress = async (setter) => {
    try {
        const response = await apiConnector('GET', GET_ADDRESS);
        if (response.data.success) {
            if (response.data.address) {
                setter(response.data.address);
            }
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const addAddress = async (data, setter) => {
    try {
        const response = await apiConnector('POST', ADD_ADDRESS, data);

        if (response.data.success) {
            setter(response.data.address)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const removeAddress = async (data, setter) => {
    try {
        const response = await apiConnector('POST', REMOVE_ADDRESS, data);

        if (response.data.success) {
            setter(response.data.address);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const updateAddress = async (data, setter) => {
    try {
        const response = await apiConnector('POST', UPDATE_ADDRESS, data);

        if (response.data.success) {
            setter(response.data.address);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.err(err.resopnse.data.message);
    }
}

export const updateUser = async (data, dispatch) => {
    const toastId = toast.loading('Updating User...');
    try {
        const response = await apiConnector('POST', UPDATE_USER, data, { 'Content-Type': 'multipart/form-data' })

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            dispatch(setUser(response.data.updatedUser));
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
} 
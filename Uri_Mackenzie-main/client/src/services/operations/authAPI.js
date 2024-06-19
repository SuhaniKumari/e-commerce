import toast from "react-hot-toast";
import { apiConnector } from "services/apiConnector";
import { authEndpoints } from "services/apis";
import { setIsLogin, setToken, setUser } from "slices/userSlice";

const { GET_RESET_PASSWORD_LINK, GET_VERIFICATION_LINK, RESET_PASSWORD, VERIFIED_USER } = authEndpoints

export const getVerifyLink = async () => {
    const toastId = toast.loading('Loading...')
    try {
        const response = await apiConnector('POST', GET_VERIFICATION_LINK);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err.response.data.message);
    }
}

export const verifyAccount = async (data, setter, navigate) => {
    const toastId = toast.loading('Loading...')
    try {
        const response = await apiConnector('POST', VERIFIED_USER, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            if (setter) {
                setter(false);
            }
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err.response.data.message);
        if (navigate) {
            navigate('/');
        }
    }
}

export const getResetPasswordLink = async (data) => {
    const toastId = toast.loading('Loading...')
    try {
        const response = await apiConnector('POST', GET_RESET_PASSWORD_LINK, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err.response.data.message);
    }
}

export const resetPassword = async (data, dispatch, navigate) => {
    const toastId = toast.loading('Changing...')
    try {
        const response = await apiConnector('POST', RESET_PASSWORD, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            dispatch(setToken(null));
            dispatch(setUser(null));
            dispatch(setIsLogin(false));
            localStorage.removeItem("loggedIn");
            navigate('/login')
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err.response.data.message);
    }
}
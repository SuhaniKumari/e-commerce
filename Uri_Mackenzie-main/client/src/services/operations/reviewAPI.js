import toast from "react-hot-toast";
import { apiConnector } from "services/apiConnector";

const { reviewEndpoints } = require("services/apis");


const { GET_REVIEW, CREATE_REVIEW, UPDATE_REVIEW, DELETE_REVIEW } = reviewEndpoints;

export const getReview = async (data, setter, setMine) => {
    try {
        const response = await apiConnector('GET', GET_REVIEW, null, null, data);

        if (response.data.success) {
            setter(response.data.reviews)
            if (setMine && response?.data.myReview) {
                setMine(response.data.myReview);
            }
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const createReview = async (data, setter) => {
    const toastId = toast.loading('Posting Review');
    try {
        const response = await apiConnector('POST', CREATE_REVIEW, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(response.data.savedReview)
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const updateReview = async (data, setter) => {
    const toastId = toast.loading('Updating Review');
    try {
        const response = await apiConnector('POST', UPDATE_REVIEW, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(response.data.updatedReview)
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const deleteReview = async (data, setter) => {
    const toastId = toast.loading('Deleting Review');
    try {
        const response = await apiConnector('POST', DELETE_REVIEW, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(null);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}
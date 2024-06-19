import toast from "react-hot-toast"
import { apiConnector } from "services/apiConnector";
import { productEndpoints } from "services/apis";
import { setCategories, setColors } from "slices/productSlice";

const { CREATE_PRODUCT, UPDATE_PRODUCT, GET_ALL_PRODUCT, GET_PRODUCT, CATEGORY, VARIENT, GRAPH, COLORS } = productEndpoints

export const createProduct = async (data) => {
    const toastId = toast.loading('Creating Product');
    try {
        const response = await apiConnector('POST', CREATE_PRODUCT, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data?.message);
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const getProducts = async (query, setter, setPage) => {
    try {
        const response = await apiConnector('GET', GET_ALL_PRODUCT, null, null, query);

        if (response.data.success) {
            setter(response.data.products);
            if (setPage) {
                setPage(response.data.pagination);
            }
        }

    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const updateProduct = async (data) => {
    const toastId = toast.loading('Updating Product');
    try {

        const response = await apiConnector('POST', UPDATE_PRODUCT, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data?.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err?.response?.data?.message);
    }
}

export const getProduct = async (data, setter) => {
    const toastId = toast.loading('Fetching Product');
    try {
        const response = await apiConnector('POST', GET_PRODUCT, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(response.data.product)
        }
    } catch (err) {
        setter(null)
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const createVarient = async (data) => {
    const toastId = toast.loading('Adding Varient');
    try {
        const response = await apiConnector('POST', VARIENT, data, { 'Content-Type': 'multipart/form-data' });

        console.log(response);

        if (response.data.success) {
            toast.dismiss(toastId)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
    }
}

export const updateVarient = async (data) => {
    const toastId = toast.loading('Updating Varient');
    try {
        const response = await apiConnector('PUT', VARIENT, data, { 'Content-Type': 'multipart/form-data' });

        console.log(response);

        if (response.data.success) {
            toast.dismiss(toastId)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
    }
}

export const deleteVarient = async (data) => {
    const toastId = toast.loading('Deleting Varient');
    try {
        const response = await apiConnector('DELETE', VARIENT, data);

        console.log(response);

        if (response.data.success) {
            toast.dismiss(toastId)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
    }
}

export const getCategory = async (dispatch) => {
    try {
        const response = await apiConnector('GET', CATEGORY);

        if (response.data.success) {
            dispatch(setCategories(response.data.categories))
            console.log(response.data.categories);
        }
    } catch (err) {
        dispatch(setCategories(null))
    }
}

export const addCategory = async (dispatch, data) => {
    const toastId = toast.loading('Updating Category');
    try {
        const response = await apiConnector('POST', CATEGORY, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            dispatch(setCategories(response.data.categories))
            toast.dismiss(toastId)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const updateCategory = async (dispatch, data) => {
    const toastId = toast.loading('Updating Category');
    try {
        const response = await apiConnector('PUT', CATEGORY, data, { 'Content-Type': 'multipart/form-data' });

        if (response.data.success) {
            dispatch(setCategories(response.data.categories))
            toast.dismiss(toastId)
            toast.success(response.data.message);
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err.response.data.message);
    }
}

export const deleteCategory = async (dispatch, data) => {
    try {
        const response = await apiConnector('DELETE', CATEGORY, data);
        if (response.data.success) {
            dispatch(setCategories(response.data.categories))
        }
    } catch (err) {
        dispatch(setCategories(null))
    }
}

export const getGraphData = async (setProducts, setOrders, setUsers, setLoader) => {
    try {
        const response = await apiConnector('POST', GRAPH);
        if (response.data.success) {
            setProducts(response.data.products);
            setOrders(response.data.orders);
            setUsers(response.data.users);
            setLoader(false);
        }
    } catch (err) {
        setProducts([]);
        setOrders([]);
        setUsers([]);
        setLoader(false);
    }
}

export const getColors = async (dispatch) => {
    try {
        const response = await apiConnector('GET', COLORS);

        if (response.data.success) {
            dispatch(setColors(response.data.colors));
        }
    } catch (err) {
        dispatch(setColors([]));
    }
}
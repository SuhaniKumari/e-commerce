import toast from "react-hot-toast"
import { apiConnector } from "services/apiConnector";
import { orderEndpoints } from "services/apis";
import { setUser } from "slices/userSlice";
import { setCart, setWishlist } from 'slices/productSlice'
import logo from 'assets/images/logo.png'

const { UPDATE_MY_CART, UPDATE_MY_WISHLIST, GET_MY_WISHLIST, GET_MY_CART, GET_MY_ORDERS, CANCEL_MY_ORDER, CANCEL_ORDER, RETURN_ORDER, CASH_ON_DELIVERY, GET_ORDERS, CAPTURE_PAYMENT, VERIFY_PAYMENT } = orderEndpoints

export const updateMyCart = async (data) => {
    try {
        await apiConnector('POST', UPDATE_MY_CART, data);
    } catch (err) {
        toast.error(err.response?.data?.message);
    }
}

export const updateMyWishlist = async (data) => {
    try {
        await apiConnector('POST', UPDATE_MY_WISHLIST, data);
    } catch (err) {
        toast.error(err.response?.data?.message);
    }
}

export const getMyWishlist = async (dispatch) => {
    try {
        const response = await apiConnector('POST', GET_MY_WISHLIST);

        if (response.data.success) {
            dispatch(setWishlist(response.data.wishlist));
        }
    } catch (err) {
        toast.error(err.response?.data?.message);
    }
}

export const getMyCart = async (dispatch) => {
    try {
        const response = await apiConnector('POST', GET_MY_CART);

        if (response.data.success) {
            dispatch(setCart(response.data.cart));
        }
    } catch (err) {
        toast.error(err.response?.data?.message);
    }
}

export const cashOnDelivery = async (data, navigate, dispatch, user) => {
    const toastId = toast.loading('Booking Order');
    try {
        const response = await apiConnector('POST', CASH_ON_DELIVERY, data);

        if (response.data.success) {
            toast.dismiss(toastId)
            toast.success(response.data.message)
            dispatch(setUser({
                ...user,
                cart: []
            }));
            navigate('/orders');
        }
    } catch (err) {
        toast.dismiss(toastId)
        toast.error(err?.response?.data?.message);
    }
}

export const getMyOrders = async (setter) => {
    try {
        const response = await apiConnector('POST', GET_MY_ORDERS);

        if (response.data.success) {
            toast.success(response.data.message);
            setter(response.data.orders);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const getMyOrder = async (data, setter) => {
    try {
        const response = await apiConnector('POST', GET_MY_ORDERS, data);

        if (response.data.success) {
            toast.success(response.data.message);
            setter(response.data.orders);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export const cancelOrder = async (data, setter) => {
    const toastId = toast.loading('Canceling the order');
    try {
        const response = await apiConnector('POST', CANCEL_ORDER, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(response.data.order)
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const cancelMyOrder = async (data, setter) => {
    const toastId = toast.loading('Canceling the order');
    try {
        const response = await apiConnector('POST', CANCEL_MY_ORDER, data);

        if (response.data.success) {
            toast.dismiss(toastId);
            toast.success(response.data.message);
            setter(response.data.order)
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const returnOrder = async (data, navigate) => {
    const toastId = toast.loading('Returing');
    try {
        const response = await apiConnector('POST', RETURN_ORDER, data);

        if (response.data.success) {
            toast.success(response.data.message);
            toast.dismiss(toastId);
            navigate('/orders');
        }
    } catch (err) {
        toast.dismiss(toastId);
        toast.error(err?.response?.data?.message);
    }
}

export const getOrders = async (data, setter) => {
    try {
        const response = await apiConnector('POST', GET_ORDERS, data);

        if (response.data.success) {
            toast.success(response.data.message);
            setter(response.data.data);
        }
    } catch (err) {
        toast.error(err?.response?.data?.message);
    }
}

export function payOnline(data, navigate, dispatch, user) {
    function addModalAPI(src) {
        return new Promise((resolve) => {
            const script = document.createElement('script');
            script.src = src;

            script.onload = () => {
                resolve(true);
            }

            script.onerror = () => {
                resolve(false);
            }

            document.body.appendChild(script);
        })
    }

    async function verifyPayment(data) {
        const toastId = toast.loading('Verifying Payment');
        try {
            const response = await apiConnector('POST', VERIFY_PAYMENT, data)

            if (!response.data.success) {
                throw new Error();
            }
            dispatch(setUser({
                ...user,
                cart: []
            }));
            navigate('/orders')
            toast.dismiss(toastId);
            toast.success('Payment Verified successfully');
        } catch (err) {
            toast.dismiss(toastId);
            toast.error('Unable to Complete Payment');
        }
    }

    async function initiatePayment() {
        const toastId = toast.loading('Loading...');
        try {
            const modal = await addModalAPI('https://checkout.razorpay.com/v1/checkout.js');

            if (!modal) {
                throw new Error();
            }

            const response = await apiConnector('POST', CAPTURE_PAYMENT, data);

            const info = response.data.payment;

            const options = {
                key: process.env.RAZORPAY,
                amount: info.amount,
                currency: info.currency,
                name: 'URI & Mackenzie',
                description: 'Payment Intiated',
                order_id: info.id,
                image: logo,
                theme: {
                    color: "#3d405c"
                },
                prefills: {
                    name: 'Afnan',
                    email: 'm.afnan2018@gmail.com',
                    contact: '9554522980'
                },
                handler: function (response) {
                    toast.dismiss(toastId);
                    toast.success('Payment Successful');
                    verifyPayment({ ...response, ...data });
                }
            }

            const paymentWindow = new window.Razorpay(options);

            paymentWindow.open()
            paymentWindow.on("payment.failed", function (response) {
                toast.dismiss(toastId);
                toast.error("Oops! Payment Failed.")
            })
        } catch (err) {
            toast.dismiss(toastId);
            toast.error(err?.response?.data?.message);
        }
    }


    initiatePayment()
}

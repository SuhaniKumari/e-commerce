const BASE_URL = `${process.env.REACT_APP_BASE_URL}/api/v1`;

export const authEndpoints = {
    GET_VERIFICATION_LINK: `${BASE_URL}/auth/getVerificationLink`,
    VERIFIED_USER: `${BASE_URL}/auth/verification`,
    GET_RESET_PASSWORD_LINK: `${BASE_URL}/auth/getResetPasswordLink`,
    RESET_PASSWORD: `${BASE_URL}/auth/resetPassword`,
}

export const userEndpoints = {
    SIGN_IN: `${BASE_URL}/user/signin`,
    SIGN_UP: `${BASE_URL}/user/signup`,
    GET_TOKEN: `${BASE_URL}/user/getToken`,
    GET_USER: `${BASE_URL}/user/getUser`,
    UPDATE_USER: `${BASE_URL}/user/updateUser`,
    DELETE_USER: `${BASE_URL}/user/deleteUser`,
    GET_ALL_USERS: `${BASE_URL}/user/getAllUsers`,
    GET_ADDRESS: `${BASE_URL}/user/getAddress`,
    UPDATE_ADDRESS: `${BASE_URL}/user/updateAddress`,
    REMOVE_ADDRESS: `${BASE_URL}/user/removeAddress`,
    ADD_ADDRESS: `${BASE_URL}/user/addAddress`,
}

export const productEndpoints = {
    CREATE_PRODUCT: `${BASE_URL}/products/createProduct`,
    UPDATE_PRODUCT: `${BASE_URL}/products/updateProduct`,
    GET_ALL_PRODUCT: `${BASE_URL}/products/getAllProduct`,
    VARIENT: `${BASE_URL}/products/varient`,
    GET_PRODUCT: `${BASE_URL}/products/getProduct`,
    CATEGORY: `${BASE_URL}/products/category`,
    GRAPH: `${BASE_URL}/products/getGraphData`,
    COLORS: `${BASE_URL}/products/getColors`
}

export const orderEndpoints = {
    UPDATE_MY_CART: `${BASE_URL}/order/updateMyCart`,
    UPDATE_MY_WISHLIST: `${BASE_URL}/order/updateMyWishlist`,
    GET_MY_CART: `${BASE_URL}/order/getMyCart`,
    GET_MY_WISHLIST: `${BASE_URL}/order/getMyWishlist`,
    GET_MY_ORDERS: `${BASE_URL}/order/getMyOrders`,
    GET_ORDERS: `${BASE_URL}/order/getOrders`,
    UPDATE_ORDER: `${BASE_URL}/order/updateOrder`,
    CASH_ON_DELIVERY: `${BASE_URL}/order/cashOnDelivery`,
    CAPTURE_PAYMENT: `${BASE_URL}/order/capturePayment`,
    VERIFY_PAYMENT: `${BASE_URL}/order/verifyPayment`,
    CANCEL_MY_ORDER: `${BASE_URL}/order/cancelMyOrder`,
    CANCEL_ORDER: `${BASE_URL}/order/cancelOrder`,
    RETURN_ORDER: `${BASE_URL}/order/returnOrder`,
}

export const reviewEndpoints = {
    GET_REVIEW: `${BASE_URL}/review/getReview`,
    CREATE_REVIEW: `${BASE_URL}/review/createReview`,
    UPDATE_REVIEW: `${BASE_URL}/review/updateReview`,
    DELETE_REVIEW: `${BASE_URL}/review/deleteReview`,
}
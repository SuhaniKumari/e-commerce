import { Route, Routes } from 'react-router-dom';
import './App.css';
import NavBar from './components/common/NavBar/NavBar';
import Home from './pages/Home/Home';
import Footer from 'components/common/Footer/Footer';
import Search from 'pages/Search/Search';
import ProtectedRoute from 'routes/protectedRoute';
import AdminRoute from 'routes/adminRoute';
import Admin from 'pages/Admin/Admin';
import Login from 'pages/Login/Login';
import OpenRoute from 'routes/openRoute';
import Signup from 'pages/Signup/Signup';
import ResetPassword from 'pages/ResetPassword/ResetPassword';
import ContactUs from 'pages/Utils/ContactUs';
import AboutUs from 'pages/Utils/AboutUs';
import Privacy from 'pages/Utils/Privacy';
import Refund from 'pages/Utils/Refund';
import Order from 'pages/Order/Order';
import Cart from 'pages/Cart/Cart';
import Profile from 'pages/Profile/Profile';
import Product from 'pages/Product/Product';
import Booking from 'pages/Booking/Booking';
import Return from 'pages/Return/Return';
import Review from 'pages/Review/Review';
import ResetPasswordRoute from 'pages/ResetPassword/ResetPasswordRoute';
import Error from 'pages/Utils/Error';
import Verification from 'pages/Verification/Verification';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect } from 'react';
import { verifyAccount } from 'services/operations/authAPI';
import { getToken, getUser } from 'services/operations/userAPI';
import { getCategory, getColors } from 'services/operations/productAPI';
import Dashboard from 'components/core/Admin/Dashboard';
import ManageProducts from 'components/core/Admin/ManageProducts';
import EditProduct from 'components/core/Admin/EditProduct';
import AddCategory from 'components/core/Admin/AddCategory';
import ManageCategory from 'components/core/Admin/ManageCategory';
import ManageOrders from 'components/core/Admin/ManageOrders';
import OrderDetail from 'components/common/OrderDetail/OrderDetail';
import { getMyCart, getMyWishlist, updateMyCart, updateMyWishlist } from 'services/operations/orderAPI';
import Wishlist from 'pages/Wishlist/Wishlist';
import QuickView from 'components/common/QuickView/QuickView';

function App() {

    const { user, isLogin } = useSelector(state => state.user);
    const { cart, wishlist, quickView } = useSelector(state => state.products);

    const dispatch = useDispatch();

    const verify = async () => {
        await verifyAccount({ token: sessionStorage.getItem('verifyToken') });
        sessionStorage.removeItem('verifyToken');
        await getUser(dispatch);
    }

    useEffect(() => {
        getCategory(dispatch);
        getColors(dispatch);
        if (isLogin) {
            getToken(dispatch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (cart) {
            updateMyCart({ cart: JSON.stringify(cart) });
        }
    }, [cart])
    useEffect(() => {
        if (wishlist) {
            updateMyWishlist({ wishlist: JSON.stringify(wishlist) });
        }
    }, [wishlist])

    useEffect(() => {
        if (user && sessionStorage.getItem('verifyToken') && !user.isVerified) {
            verify();
        }
        if (user) {
            getMyCart(dispatch);
            getMyWishlist(dispatch);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user])

    return (
        <div className="App">
            {
                quickView && <QuickView data={quickView} />
            }
            <NavBar />
            <Routes>
                <Route path='/' element={<Home />} />
                <Route path='/search' element={<Search />} />
                <Route path='/login' element={<OpenRoute><Login /></OpenRoute>} />
                <Route path='/signup' element={<OpenRoute><Signup /></OpenRoute>} />
                <Route path='/reset-password' element={<ResetPassword />} />
                <Route path='/reset-password/:id' element={<ResetPasswordRoute />} />
                <Route path='/contactUs' element={<ContactUs />} />
                <Route path='/aboutUs' element={<AboutUs />} />
                <Route path='/privacy' element={<Privacy />} />
                <Route path='/refund' element={<Refund />} />
                <Route path='/orders' element={<ProtectedRoute><Order /></ProtectedRoute>} />
                <Route path='/orders/:id' element={<ProtectedRoute><OrderDetail /></ProtectedRoute>} />
                <Route path='/return/:id' element={<ProtectedRoute><Return /></ProtectedRoute>} />
                <Route path='/verify/:token' element={<Verification />} />
                <Route path='/product/:id' element={<Product />} />
                <Route path='/reviews/:id' element={<Review />} />
                <Route path='/cart' element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path='/wishlist' element={<ProtectedRoute><Wishlist /></ProtectedRoute>} />
                <Route path='/myaccount' element={<ProtectedRoute><Profile /></ProtectedRoute>} />
                <Route path='/booking' element={<ProtectedRoute><Booking /></ProtectedRoute>} />
                <Route path='/admin' element={<AdminRoute><Admin /></AdminRoute>} >
                    <Route path='/admin/dashboard' element={<Dashboard />} />
                    <Route path='/admin/manage-products' element={<ManageProducts />} />
                    <Route path='/admin/product' element={<EditProduct />} />
                    <Route path='/admin/product/:id' element={<EditProduct />} />
                    <Route path='/admin/add-category' element={<AddCategory />} />
                    <Route path='/admin/add-category/:id' element={<AddCategory />} />
                    <Route path='/admin/manage-category' element={<ManageCategory />} />
                    <Route path='/admin/orders' element={<ManageOrders orderType={'Order'} />} />
                    <Route path='/admin/returns' element={<ManageOrders orderType={'Returns'} />} />
                </Route>
                <Route path='*' element={<Error />} />
            </Routes>
            <Footer />
        </div>
    );
}

export default App;

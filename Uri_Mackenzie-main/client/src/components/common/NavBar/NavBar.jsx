import React, { useEffect, useRef, useState } from 'react'
import style from './NavBar.module.css'
// import logo from 'assets/images/logo.png'
import shortLogo from 'assets/images/shortLogo.svg'
import longLogo from 'assets/images/longLogo.svg'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MdClose, MdOutlineAccountCircle, MdOutlineAdminPanelSettings, MdOutlineFavoriteBorder, MdOutlineLogin, MdOutlineMenu, MdOutlineSearch, MdOutlineShoppingBag, MdOutlineShoppingCart } from "react-icons/md";
import { useSelector } from 'react-redux'
import useOnClickOutside from 'hooks/useOnClickOutside'
import dashboardLink from 'assets/data/dashboardLinks'

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();

    const [searchParams] = useSearchParams();

    const { token, user } = useSelector(state => state.user);
    const { categories } = useSelector(state => state.products);

    const [showSidebar, setShowSidebar] = useState(false);
    const [search, setSearch] = useState('');
    const [searchBar, setSearchBar] = useState(false);

    const sidebarRef = useRef();

    useOnClickOutside(sidebarRef, () => setShowSidebar(false));

    useEffect(() => {
        if (location.pathname === '/search') {
            setSearchBar(true);
        } else {
            setSearchBar(false);
        }
        setShowSidebar(false);
    }, [location])

    useEffect(() => {
        if (searchParams.get('search')) {
            setSearch(searchParams.get('search'));
        }
    }, [searchParams]);

    const handleSearch = () => {
        if (search.length > 0) {
            setSearchBar(!searchBar)
            navigate(`/search?search=${search}`)
        }
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <div className={style.NavBar}>
            <div ref={sidebarRef} className={`${style.sidebar} ${showSidebar ? style.showSidebar : style.hideSidebar}`}>
                <div>
                    <button onClick={() => setShowSidebar(false)} className='secondary-btn'><MdClose /></button>
                    {user?.userType === 'Admin' && dashboardLink.map((data, index) => (
                        <button className='secondary-btn' key={index} style={{ backgroundColor: location.pathname === data.link && 'var(--sunset)', color: location.pathname === data.link && 'var(--delft-blue)' }} onClick={() => navigate(data.link)}>{data.title}</button>
                    ))}
                    {user?.userType !== 'Admin' && categories.map((data, index) => (
                        <button className='secondary-btn' key={index} onClick={() => navigate(`/search?category=${data._id}`)}>{data.name}</button>
                    ))}
                </div>
                <div>
                    {token && <button className='secondary-btn' onClick={() => navigate('/wishlist')}>My Wishlist</button>}
                    {token && <button className='secondary-btn' onClick={() => navigate('/orders')}>My Orders</button>}
                    {token && <button className='secondary-btn' onClick={() => navigate('/cart')}>My Cart</button>}
                    {token ? <button className='secondary-btn' onClick={() => navigate('/myaccount')}>My Account</button> : <button className='secondary-btn' onClick={() => navigate('/login')}>Login</button>}
                </div>
            </div>
            <nav className={style.MainArea}>
                <img src={searchBar && window.innerWidth < 600 ? shortLogo : longLogo} onClick={() => navigate('/')} alt='logo' />
                {searchBar && <div className={style.SearchArea} style={{ gap: '0' }}>
                    <input style={{ borderRight: '0' }} type='text' required placeholder='Search any item' value={search} onChange={(e) => setSearch(e.target.value)} onKeyDown={handleKeyDown} />
                    <button className={`border-round-btn`} style={{ borderRadius: '0', borderLeft: '0', borderRight: '0' }} onClick={() => setSearchBar(!searchBar)}><MdClose /></button>
                    <button className={`border-round-btn`} onClick={handleSearch}><MdOutlineSearch /></button>
                </div>}
                <div>
                    <MdOutlineSearch style={{ display: searchBar ? 'none' : 'flex' }} onClick={() => setSearchBar(!searchBar)} />
                    {user?.userType === 'Admin' && <MdOutlineAdminPanelSettings onClick={() => navigate('/admin/dashboard')} className={style.hide} />}
                    {token && <MdOutlineFavoriteBorder className={style.hide} onClick={() => navigate('/wishlist')} />}
                    {token && <MdOutlineShoppingBag className={style.hide} onClick={() => navigate('/cart')} />}
                    {token && <MdOutlineShoppingCart className={style.hide} onClick={() => navigate('/orders')} />}
                    {token ? <MdOutlineAccountCircle className={style.hide} onClick={() => navigate('/myaccount')} /> : <MdOutlineLogin onClick={() => navigate('/login')} className={style.hide} />}
                    <MdOutlineMenu className={style.show} onClick={() => setShowSidebar(true)} />
                </div>
            </nav>
        </div>
    )
}

export default NavBar
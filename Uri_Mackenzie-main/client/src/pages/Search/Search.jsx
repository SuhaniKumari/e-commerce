import React, { useEffect, useState } from 'react'
import style from './Search.module.css'
import { useSearchParams } from 'react-router-dom';
import { getProducts } from 'services/operations/productAPI';
import ProductCard from 'components/common/ProductCard/ProductCard';
import Pagination from 'components/common/Pagination/Pagination';
import { useSelector } from 'react-redux';
import background from 'assets/images/background.png'
import { MdClose } from 'react-icons/md';

const Search = () => {

    const [loader, setLoader] = useState(true)
    const [products, setProducts] = useState(null);
    const [query, setQuery] = useState(null);
    const [pageData, setPageData] = useState(null);

    const [searchParams, setSearchParams] = useSearchParams();

    const { categories, colors } = useSelector(state => state.products);

    useEffect(() => {
        const query = {};
        setLoader(true)
        setProducts(null);

        if (searchParams.get('page')) {
            query.page = parseInt(searchParams.get('page'), 10);
        }
        if (searchParams.get('limit')) {
            query.limit = parseInt(searchParams.get('limit'), 10);
        }
        if (searchParams.get('category')) {
            query.category = `category=${searchParams.get('category')}`;
        }
        if (searchParams.get('priceMin')) {
            query.price = `priceMin=${parseFloat(searchParams.get('priceMin'))}&priceMax=${parseFloat(searchParams.get('priceMax'))}`;
        }
        if (searchParams.get('discount')) {
            query.discount = `discount=${parseFloat(searchParams.get('discount'))}`;
        }
        if (searchParams.get('availibility')) {
            query.availibility = `availibility=${searchParams.get('availibility') === 'true'}`;
        }
        if (searchParams.get('location')) {
            query.location = `location=${searchParams.get('location')}`;
        }
        if (searchParams.get('payment')) {
            query.payment = `payment=${searchParams.get('payment')}`;
        }
        if (searchParams.get('sortBy')) {
            query.sortBy = `sortOrder=${searchParams.get('sortOrder')}&sortBy=${searchParams.get('sortBy')}`;
        }
        if (searchParams.get('search')) {
            query.search = `search=${searchParams.get('search')}`;
        }
        if (searchParams.get('color')) {
            query.color = `color=${searchParams.get('color')}`;
        }
        // Your code to fetch data with the `query` object

        setQuery(query);

        const tempObj = {};

        Object.keys(query).forEach(key => {
            const arr = query[key].split('&');

            arr.forEach(element => {
                const [id, value] = element.split('=');
                tempObj[id] = value;
            });
        })

        getProducts(tempObj, setProducts, setPageData)
    }, [searchParams]);

    const handleSelectChange = (event) => {
        const { value } = event.target;

        const arr = value.split('&');

        arr.forEach(element => {
            const [id, value] = element.split('=');
            searchParams.set(id, value);
            setSearchParams(searchParams);
        });
    };

    useEffect(() => {
        if (products && loader) {
            setLoader(false);
        } else if (!products && !loader) {
            setLoader(true)
        }
    }, [products, loader])

    return (
        <div className={style.Search} style={{ backgroundImage: `url(${background})` }}>
            <div className={style.sideBar}>
                <button className='border-round-btn' onClick={() => setSearchParams('')}>{window.innerWidth > 768 ? 'Clear filter' : <MdClose />}</button>
                <div>
                    <select value={query?.sortBy ? query.sortBy : ''} onChange={handleSelectChange}>
                        <option value="" disabled >Select Sorting</option>
                        <option value="sortOrder=asc&sortBy=price">Price (High to low)</option>
                        <option value="sortOrder=desc&sortBy=price">Price (Low to Highs)</option>
                        <option value="sortOrder=desc&sortBy=viewed">Most Popular</option>
                        <option value="sortOrder=asc&sortBy=viewed">Least Popular</option>
                        <option value="sortOrder=desc&sortBy=purchased">Best Selling</option>
                    </select>
                </div>
                <div>
                    <select value={query?.category ? query.category : ''} onChange={handleSelectChange}>
                        <option value="" >Select a category</option>
                        {categories.map(category => (
                            <option value={`category=${category._id}`}>{category.name}</option>
                        ))}
                    </select>
                </div>
                <div>
                    <select value={query?.price ? query.price : ''} onChange={handleSelectChange}>
                        <option value="" disabled >Select a price range</option>
                        <option value="priceMin=0&priceMax=500">0-500</option>
                        <option value="priceMin=500&priceMax=1000">500-1000</option>
                        <option value="priceMin=1000&priceMax=2000">1000-2000</option>
                        <option value="priceMin=2000&priceMax=4000">2000-4000</option>
                        <option value="priceMin=4000&priceMax=7000">4000-7000</option>
                        <option value="priceMin=7000&priceMax=10000">7000-10000</option>
                    </select>
                </div>
                <div>
                    <select value={query?.availibility ? query.availibility : ''} onChange={handleSelectChange}>
                        <option value="" disabled >Select Availability</option>
                        <option value={`availibility=${true}`}>In Stock</option>
                        <option value={`availibility=${false}`}>Both</option>
                    </select>
                </div>
                <div>
                    <select value={query?.payment ? query.payment : ''} onChange={handleSelectChange}>
                        <option value="" disabled >Select payment type</option>
                        <option value="payment=Off">Cash On Delivery</option>
                        <option value="payment=On">Online</option>
                    </select>
                </div>
                {colors && <div>
                    <select value={query?.color ? query.color : ''} onChange={handleSelectChange}>
                        <option value="" disabled >Select color</option>
                        {
                            colors.map((color, index) => <option key={index} style={{ color: color.colorCode, fontWeight: 700 }} value={`color=${color.colorCode}`}>{color.colorName}</option>)
                        }
                    </select>
                </div>}
            </div>
            <div className={style.main}>
                {loader ? <div className='loaderBg' style={{ borderRadius: '0px' }}><div className='loader'></div></div> :
                    products.length > 0 ? <div>
                        {products.map((product, index) => (
                            <ProductCard key={index} data={product} />
                        ))}
                    </div> :
                        <div style={{ textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: '1', fontWeight: '700', fontSize: '2rem' }}> No Item Found</div>
                }
                {pageData && <Pagination pageData={pageData} />}
            </div>
        </div>
    )
}

export default Search
import React, { useEffect, useState } from 'react'
import style from './Home.module.css'
import heros from 'assets/images/Heros.jpg'
import Category from 'components/core/Home/Category'
import Review from 'components/core/Home/Review'
import ProductSlider from 'components/common/ProductSlider/ProductSlider'
import { getProducts } from 'services/operations/productAPI'
import Showcase from 'components/core/Home/Showcase'
import Why from 'components/core/Home/Why'

const Home = () => {

    const [bestProducts, setBestProducts] = useState(null);
    const [affordableProducts, setAffordableProducts] = useState(null);
    const [popularProducts, setPopularProducts] = useState(null);

    useEffect(() => {
        const query = {};
        query.limit = 5;
        query.sortOrder = 'desc'
        query.sortBy = 'purchased'
        getProducts(query, setBestProducts);
        query.sortBy = 'price'
        getProducts(query, setAffordableProducts);
        query.sortBy = 'viewed'
        getProducts(query, setPopularProducts);
    }, [])

    return (
        <div className={style.Home}>
            <Category />
            <img src={heros} alt='heros' />
            <Why />
            {bestProducts && <ProductSlider products={bestProducts} heading={'Best selling products'} click={'/search?sortOrder=desc&sortBy=purchased'} />}
            {bestProducts && affordableProducts && popularProducts && <Showcase products={[...bestProducts, ...affordableProducts, ...popularProducts]} />}
            {affordableProducts && <ProductSlider products={affordableProducts} heading={'Value for money deals'} click={'/search?sortOrder=desc&sortBy=price'} />}
            <Review />
            {popularProducts && <ProductSlider products={popularProducts} heading={'Most popular products'} click={'/search?sortOrder=desc&sortBy=viewed'} />}
        </div>
    )
}

export default Home
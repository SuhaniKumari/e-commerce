import React, { useEffect, useState } from 'react'
import style from './Product.module.css'
import { useNavigate, useParams } from 'react-router-dom'
import { getProduct, getProducts } from 'services/operations/productAPI';
import '../../../node_modules/react-image-gallery/styles/css/image-gallery.css'
import RatingAndReview from 'components/core/Product/RatingAndReview';
import ProductDetail from 'components/core/Product/ProductDetail';
import ProductSlider from 'components/common/ProductSlider/ProductSlider';

const Product = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [product, setProduct] = useState(undefined);
    const [bestProduct, setBestProduct] = useState([]);
    const [loader, setLoader] = useState(true);

    useEffect(() => {
        setLoader(true);
        getProduct({ id }, setProduct);
        getProducts({ limit: 5, sortOrder: 'desc', sortBy: 'purchased' }, setBestProduct);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])

    useEffect(() => {
        if (product) {
            setLoader(false);
        } else if (product === null) {
            navigate('/')
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [product]);




    if (loader) {
        return <div className='loaderBg'><div className='loader'></div></div>
    }

    return (
        <div className={style.Product}>
            <ProductDetail product={product} />
            {product.suggestions && product.suggestions.length > 0 && <ProductSlider products={product.suggestions} heading={'Suggestions'} click={'/search?sortOrder=desc&sortBy=viewed'}/>}
            <RatingAndReview />
            <ProductSlider products={bestProduct} heading={'Best Selling products'} click={'/search?sortOrder=desc&sortBy=purchased'} />
        </div>
    )
}

export default Product
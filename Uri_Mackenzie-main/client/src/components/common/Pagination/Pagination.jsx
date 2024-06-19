import React from 'react'
import style from './Pagination.module.css'
import { useSearchParams } from 'react-router-dom'

const Pagination = ({ pageData }) => {

    const [searchParams, setSearchParams] = useSearchParams();

    const handleSearch = (page) => {
        searchParams.set('page', page);
        setSearchParams(searchParams)
    }

    const { currentPage, totalPages } = pageData;

    if(totalPages <= 1){
        return;
    }

    return (
        <div className={style.Pagination}>
            {
                currentPage > 1 && <button onClick={()=>handleSearch(currentPage-1)}>Prev</button>
            }
            {currentPage > 2 && <h2 onClick={()=>handleSearch(currentPage-2)}>{currentPage - 2}</h2>}
            {currentPage > 1 && <h2 onClick={()=>handleSearch(currentPage-1)}>{currentPage - 1}</h2>}
            <p>{currentPage}</p>
            {currentPage < totalPages && <h2 onClick={()=>handleSearch(currentPage+1)}>{currentPage + 1}</h2>}
            {currentPage < totalPages - 1 && <h2 onClick={()=>handleSearch(currentPage+2)}>{currentPage + 2}</h2>}
            {
                currentPage < totalPages && <button onClick={()=>handleSearch(currentPage+1)}>Next</button>
            }
        </div>
    )
}

export default Pagination
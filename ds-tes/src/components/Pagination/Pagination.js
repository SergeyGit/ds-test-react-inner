import React from 'react';
import './Pagination.scss';


const Pagination = (props) => {
    return (
        <div className="Pagination">
            {
                props.pageNumber > 1 ?
                    <div className="Pagination_button left"
                         onClick={() => props.changePageNumber()}
                    />
                    : null
            }

            <div className="Pagination_info">{props.pageNumber}-{props.pageLength}</div>
            {
                props.pageNumber < props.pageLength ?
                    <div className="Pagination_button right"
                         onClick={() => props.changePageNumber(true)}
                    />
                    : null
            }
        </div>
    )
}

export default Pagination;

import React from 'react';

// import request from "superagent";


const Marker = (props) => {
    return (
        <div
            className={`checkout_main_point_map_infobox fade-in ${props.pharm.branch_id === props.selectPharmId ? "active" : ""}`}
            onClick={() => props.handleClick(props.pharm.branch_id, props.pharm.id)}>
            {
                props.pharm.branch_id !== props.selectPharmId ?
                        <div className={`checkout_main_point_map_infobox_content ${props.pharm.sort_index === 3 ? "all" : ""}`}>
                            <div className={'checkout_main_point_map_infobox_name'}>{props.pharm.name}</div>
                            <div className="checkout_main_point_map_infobox_content_bottom">
                                {
                                    props.pharm.sort_index !== 3 ?
                                        <div className="checkout_main_point_map_infobox_content_quantity">{props.pharm.products.map(product =>
                                            parseInt(product.in_stock, 10) > parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                        )
                                            .reduce(function (sum, current) {
                                                return (sum + current)
                                            }, 0)}/{props.sumProducts}</div>
                                        : null
                                }
                                <div className="checkout_main_point_map_infobox_content_price">{props.pharm.price.toFixed(2)} грн</div>
                            </div>
                        </div>
                    :
                    !props.selectPharm ?
                        <div className={`checkout_main_point_map_infobox_content ${props.pharm.sort_index === 3 ? "all" : ""}`}>
                            <div className={'checkout_main_point_map_infobox_name'}>{props.pharm.name}</div>
                            <div className="checkout_main_point_map_infobox_content_bottom">
                                {
                                    props.pharm.sort_index !== 3 ?
                                        <div className="checkout_main_point_map_infobox_content_quantity">{props.pharm.products.map(product =>
                                            parseInt(product.in_stock, 10) > parseInt(product.in_cart, 10) ? parseInt(product.in_cart, 10) : parseInt(product.in_stock, 10)
                                        )
                                            .reduce(function (sum, current) {
                                                return (sum + current)
                                            }, 0)}/{props.sumProducts}</div>
                                        : null
                                }
                                <div className="checkout_main_point_map_infobox_content_price">{props.pharm.price.toFixed(2)} грн</div>
                            </div>
                        </div>
                        :
                        <div className={`checkout_main_point_map_infobox_content ${props.selectPharm.total_available_count < props.sumProducts ? "" : "all"}`}>
                            <div className={'checkout_main_point_map_infobox_name'}>{props.pharm.name}</div>
                            <div className="checkout_main_point_map_infobox_content_bottom">
                                {
                                    props.selectPharm.total_available_count < props.sumProducts ?
                                        <div className="checkout_main_point_map_infobox_content_quantity">{props.selectPharm.total_available_count}/{props.sumProducts}</div>
                                        : null
                                }
                                <div className="checkout_main_point_map_infobox_content_price">{props.selectPharm.total_price.toFixed(2)} грн</div>
                            </div>
                        </div>
            }


        </div>
    )
    

}

export default Marker
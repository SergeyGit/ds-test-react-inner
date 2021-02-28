import React from 'react';

// const linkStart = "https://doc.ua/doc-audio";
// const linkStart = "https://stage1.r2rx.doc.ua";
// const linkStart = "";


const ProductItem = props =>  {
    return (
        <div className={props.nameClass}
            key={props.product.medicine_id}>
            <div className="checkout_side_line_cnt">
                <div className="checkout_side_name">{props.product.name}</div>
                <div className="checkout_side_col">
                    <div className="range">
                        <div className="range_btn down-col"
                             onClick={() => props.changeProductQuantity(props.product.count > 1 ? props.product.count - 1 : 1, props.product.medicine_id)}/>
                        <div className="col-tovar">{props.product.count}</div>
                        <div className="range_btn up-col"
                             onClick={() => props.changeProductQuantity(props.product.count + 1, props.product.medicine_id)}/>
                    </div>
                </div>
                <div
                    className="checkout_side_price">от {(props.product.price * props.product.count).toFixed(2)} грн
                </div>
                <div className="checkout_side_remove"><span className="icon-close"
                                                            onClick={() => props.deleteProduct(props.product.medicine_id)}/>
                </div>
            </div>
            {/*{*/}
            {/*    props.product.count > props.product.quantity ?*/}
            {/*        <div className="checkout_side_product-item_alert">*/}
            {/*            <span className="icon icon-basket-2"/>*/}
            {/*            <span>В наличии {*/}
            {/*                props.product.quantity < 2*/}
            {/*                ? props.product.quantity + " товар"*/}
            {/*                    : props.product.quantity < 5 ?*/}
            {/*                    props.product.quantity + " товара"*/}
            {/*                    : props.product.quantity + " товаров"*/}
            {/*            }</span>*/}
            {/*        </div>*/}
            {/*        : null*/}
            {/*}*/}

        </div>
    )

}
export default ProductItem
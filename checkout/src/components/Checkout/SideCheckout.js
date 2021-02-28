import React from 'react';
import pills from "../../img/pills.svg";


const SideCheckout = props => {
    return (
        <div className="checkout_side">
            <div className="checkout_side_log">
                <img src={pills} alt="pills" />
            </div>
            <div className="checkout_side_line first">
                <div>ВАШ ЗАКАЗ</div>
                <a href="">Редактировать</a>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">43,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">43,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">43,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">43,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">43,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="checkout_side_line ord">
                <div className="checkout_side_name">Доктор Мом пастилки c фруктовым вкусом №20</div>
                <div className="checkout_side_col">2 шт</div>
                <div className="checkout_side_price">1232,45 грн</div>
                <div className="checkout_side_remove"><span className="icon-close"></span></div>
            </div>
            <div className="basket_line_point">
                <div className="basket_line_point_head">Промокод:</div>
                <div className="basket_line_point_promo">
                    <div className="icon-promocode"></div>
                    <input className="" type="text" />
                </div>
            </div>
            <div className="checkout_side_line ">
                <div>Стоимость:</div>
                <div className="b">12.80 грн</div>
            </div>
            <div className="checkout_side_line promo">
                <div>Скидка по промокоду:</div>
                <div className="b">12.80 грн</div>
            </div>
            <div className="checkout_side_line last">
                <div>ИТОГО:</div>
                <div className="b">12.80 грн</div>
            </div>
        </div>
    );
}

export default SideCheckout;

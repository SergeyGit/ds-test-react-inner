import React from 'react';
import './Pagination.scss'


const Pagination = props => {
    return (
        <section className="naming">
            <div className="container">
                <div className="breadcrumbs">
                    <div className="breadcrumb">
                        <span><a href="/" title="Главная">Главная</a></span>
                        <span><a href="/apteka">Аптека</a></span>
                        <span><a href="/apteka/catalog">Каталог лекарств</a></span>
                        <span>Оформление заказа</span></div>
                </div>
            </div>
        </section>
    );
}

export default Pagination;

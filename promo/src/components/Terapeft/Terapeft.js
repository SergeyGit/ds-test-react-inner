import React from 'react'

import './Terapeft.scss'

const Terapeft = props => (
    <div className={"Terapeft"} key={props.keyDoc}>
        <div className="Terapeft_point">
            <div className="Terapeft_caption h3">Сейчас консультацию проводит дежурный терапевт</div>
            <div className="Terapeft_main" >
                <div className="Terapeft_main_img  fade-in">
                    <img src={props.expresDoc.img} alt=""/>
                </div>
                <div className="Terapeft_main_text  fade-in">
                    <div className="Terapeft_main_name h3">{props.expresDoc.name} <span>{props.expresDoc.nameOther}</span></div>
                    <div className="Terapeft_main_position">{props.expresDoc.position}</div>

                    <div className="Terapeft_main_class">{props.expresDoc.cat}
                        <div className={"Terapeft_main_class_expr"}>
                            <span className={"Terapeft_main_class_expr_year"}>{props.expresDoc.year}</span>
                            лет опыта
                        </div>
                    </div>
                    <a href={props.expresDoc.link} className="Terapeft_main_link">Смотреть профиль на Doc.ua</a>
                </div>
                <div className="Terapeft_main_stats">Дежурный</div>
                <div className="Terapeft_main_prev" onClick={props.onSliderClickMinus}></div>
                <div className="Terapeft_main_next" onClick={props.onSliderClick}></div>
            </div>
        </div>
        <div className="Terapeft_point">
            <div className="Terapeft_caption bgc h3">Врач может ответить на Ваш вопрос через <span>20</span> минут</div>
            <div className="Terapeft_point_list  fade-in">
                <div className="Terapeft_point_list_point">
                    <div className="Terapeft_point_list_point_text">
                        <div className="Terapeft_point_list_point_text_cap h4">
                            Консультация врача 10 мин
                        </div>
                        Быстрый ответ на один конкретный вопрос
                    </div>
                    <div className="Terapeft_point_list_point_price">
                        <span>{props.expresDoc.price[0]} грн</span>/10 мин
                    </div>
                    <div className="Terapeft_point_list_point_button">Заказать</div>
                </div>
                <div className="Terapeft_point_list_point">
                    <div className="Terapeft_point_list_point_text">
                        <div className="Terapeft_point_list_point_text_cap h4">
                            Консультация врача 20 мин
                        </div>
                        Быстрый ответ на один конкретный вопрос
                    </div>
                    <div className="Terapeft_point_list_point_price">
                        <span>{props.expresDoc.price[1]} грн</span>/20 мин
                    </div>
                    <div className="Terapeft_point_list_point_button">Заказать</div>
                </div>
                <div className="Terapeft_point_list_point">
                    <div className="Terapeft_point_list_point_text">
                        <div className="Terapeft_point_list_point_text_cap h4">
                            Консультация врача 30 мин
                        </div>
                        Быстрый ответ на один конкретный вопрос
                    </div>
                    <div className="Terapeft_point_list_point_price">
                        <span>{props.expresDoc.price[2]} грн</span>/30 мин
                    </div>
                    <div className="Terapeft_point_list_point_button">Заказать</div>
                </div>
            </div>
        </div>
    </div>
)
export default Terapeft
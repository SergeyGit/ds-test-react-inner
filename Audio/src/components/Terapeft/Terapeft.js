import React from 'react'
import {Link} from 'react-router-dom'

import './Terapeft.scss'

const Terapeft = props => (
    <div className={"Terapeft"} id={'express'} key={props.keyDoc}>
        <div className="Terapeft_point">
            <div className="Terapeft_caption h3">Дежурные терапевты</div>
            <div className="Terapeft_main" >
                <div className="Terapeft_main_img  fade-in">
                    <img src={props.expresDoc.img} alt="doctor"/>
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
                    <a target="_blank" rel="noreferrer noopener" href={"https://doc.ua"+props.expresDoc.link} className="Terapeft_main_link">Смотреть профиль на Doc.ua</a>
                </div>
                <div className="Terapeft_main_stats">Дежурный</div>
                <div className="Terapeft_main_prev" onClick={props.onSliderClickMinus}></div>
                <div className="Terapeft_main_next" onClick={props.onSliderClick}></div>
            </div>
        </div>
        <div className="Terapeft_point">
            <div className="Terapeft_caption bgc h3">Врач может ответить на Ваш вопрос через <span>30</span> минут</div>
            <div className="Terapeft_point_list  fade-in">
                {
                    props.expresDoc.price ? props.expresDoc.price.map((point, index) => {
                        // console.log("Terapeft_point_list_point_button")
                        return(
                            <div className="Terapeft_point_list_point" key={index}>
                                <div className="Terapeft_point_list_point_text">
                                    <div className="Terapeft_point_list_point_text_cap h4">
                                        Консультация врача {point.duration} мин
                                    </div>
                                    {
                                        index === 1 ? "Развёрнутый ответ на 1-2 вопроса" :
                                            index === 2 ? "Развёрнутый ответ на 3-4 вопроса" :
                                                " Быстрый ответ на один конкретный вопрос"
                                    }

                                </div>
                                <div className="Terapeft_point_list_point_price">
                                    <span>{point.price} грн</span>/{point.duration} мин
                                </div>
                                <Link
                                    to={{
                                        pathname: "/audio/doctor/" + props.expresDoc.id,
                                        state: {
                                            img:  props.expresDoc.img,
                                            name:  props.expresDoc.name,
                                            nameOther:  props.expresDoc.nameOther,
                                            position: props.expresDoc.position,
                                            price: point.price,
                                            duration: point.duration,
                                            id:  props.expresDoc.id,
                                            activeSlides: props.activeSlides,
                                            tariff_id: index===1 ? 3944: index===2 ? 3945 : 3943
                                        }
                                    }}
                                >
                                    <div className="Terapeft_point_list_point_button">Заказать</div>
                                </Link>

                            </div>
                        )
                    }):null
                }
            </div>
        </div>
    </div>
)
export default Terapeft
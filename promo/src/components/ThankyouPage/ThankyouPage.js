import React from 'react'
import './ThankyouPage.scss'
// import gift from "../../../img/gift.svg";
import warn from "../../img/warn.svg";

// import shouldUpdate from "recompose/shouldUpdate";
// import pure from 'recompose/pure';



const ThankyouPage = props => {
    return (
        <div className="ThankyouPage thanq">
            <div className="container thanq_cnt">
                <div className="thanq_caption h2">Спасибо за заявку!</div>
                <div className="h5">Ближайшее время мы расмотрим Вашую заявку и свяжемся с Вами</div>
                <div className="thanq_numb">
                    <div className="thanq_numb_main">№654832</div>
                    <div className="h5">Ваш номер заказа</div>
                </div>
                <div className="thanq_warn">
                    <img src={warn} alt=""/>
                        <div className="h6">Обратите внимание: купон сгенерирован специально для Вас для
                            использования в лабораторном центре Днепролаб (Дніпролаб) и распространяется на весь
                            список анализов
                        </div>
                </div>
                <div className="thanq_table">
                    <div className="thanq_table_point">
                        <div className="thanq_table_line">
                            <div className="f-b">Ваши данные:</div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Имя и Фамилия пациента</div>
                            <div className="h5">Огурчик Василь</div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Номер телефона</div>
                            <div className="h5">+38 (050) 452 81 26</div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Email (не обязательно)</div>
                            <div className="h5">example@gmail.com</div>
                        </div>
                    </div>
                    <div className="thanq_table_point">
                        <div className="thanq_table_line">
                            <div className="checkout_main_point_adres-list_line_head_logo">
                                {/*<img src="../img/logo-apteka.jpg" alt="logo apteka"/>*/}
                            </div>
                            <div className="thanq_table_point_text">
                                <div className="f-b">Аптека Доброго Дня</div>
                                <div className="h5">ул. Академика Ефремова, 3 (бывшая Командарма Уборевича)</div>
                            </div>
                        </div>
                    </div>
                    <div className="thanq_table_point">
                        <div className="thanq_table_line">
                            <div className="f-b">Дата и время самовывоза</div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Завтра с 10:00 - 12:00</div>
                        </div>
                    </div>
                    <div className="thanq_table_point">
                        <div className="thanq_table_line">
                            <div className="f-b">Ваш заказ:</div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="thanq_table_point_name h5">Доктор Мом пастилки c фруктовым вкусом №20
                            </div>
                            <div className="thanq_table_point_amount">11 <span className="h5">шт</span></div>
                            <div className="thanq_table_point_price f-b">43,45 <span className="h5">грн</span></div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="thanq_table_point_name h5">Стрепсилс №24 леденцы мед-лимон</div>
                            <div className="thanq_table_point_amount">1 <span className="h5">шт</span></div>
                            <div className="thanq_table_point_price f-b">43,5 <span className="h5">грн</span></div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="thanq_table_point_name h5">Доктор Мом пастилки c фруктовым вкусом №20
                            </div>
                            <div className="thanq_table_point_amount">11 <span className="h5">шт</span></div>
                            <div className="thanq_table_point_price f-b">43,45 <span className="h5">грн</span></div>
                        </div>
                    </div>
                    <div className="thanq_table_point">
                        <div className="thanq_table_line">
                            <div className="h5">Сумма:</div>
                            <div>1280,45 <span className="h5">грн</span></div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Промокод “Doc.ua”</div>
                            <div>-12 <span className="h5">грн</span></div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5">Насчитано бонусов</div>
                            <div>5<span className="h5">бонусов</span></div>
                        </div>
                        <div className="thanq_table_line">
                            <div className="h5 f-b">К оплате:</div>
                            <div className="f-b">1080.80<span className="h5">грн</span></div>
                        </div>
                    </div>
                </div>
                <div className="thanq_sale">
                    <div className="thanq_sale_numb">
                        10%
                    </div>
                    <div className="thanq_sale_text">Ви отримали знижку на послуги в клініці <br/> Лікувально-діагностичний центр ”Добробут”</div>
                </div>
                <div className="thanq_txt">
                    Благодарим вас за выбор сервиса DOC.ua! Для связи по любым вопросам обращайтесь по телефонам <a
                    href="tel:3424234234">(044) 337-07-07</a> и <a href="tel:1312312312">(067) 337-07-07</a> или по
                    адресу info@doc.ua
                    <br/>
                        С уважением, команда DOC.ua
                </div>
            </div>
            <div className="container">
                <div className="thanq_btn-line">
                    <a href="/">Добавить событие в Google Calendar</a>
                    <a href="/">На главную</a>
                </div>
            </div>
        </div>
    )
}

export default ThankyouPage
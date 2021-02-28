import React from 'react';

import TerapeftListCardOrder from "./TerapeftListCardOrder";
import TerapeftListCardAboutText from "./TerapeftListCardAboutText";


// import avaDoc from '../../img/doctor.jpg'


const TerapeftListCard = props => {
    return (
        <div className="doctor fade-in">
            <div className="doctor_ava">
                <img src={props.img} alt="doctor"/>
                <div className="doctor_rate_stars">
                    <span className="icon-star"></span>
                    {props.rate}
                </div>
            </div>
            <div className="doctor_content">
                <a href={"https://doc.ua"+props.link} rel="noreferrer noopener" target={"_blank"}
                   className={'doctor_name f-w-m'}>{props.name} <br/> {props.nameOther}</a>
                <div className="f-w-m">{props.specialties.map(ittem => ittem.name).join(", ")}</div>
                <div>{props.category_name}</div>
                <div className={"Terapeft_main_class_expr"}>
                    <span className={"Terapeft_main_class_expr_year"}>{props.year}</span>
                    лет опыта
                    {
                        !props.review_count < 1 ?
                            <a href={"https://doc.ua"+props.link} rel="noreferrer noopener" target={"_blank"}
                               className="doctor_rate_link"><span>{props.review_count} </span>отзывов</a>
                            : null
                    }

                </div>
                <TerapeftListCardAboutText
                    short_about={props.short_about}
                />
                {/*<div className="Terapeft_main_stats">Дежурный</div>*/}
                {/*<div className={'doctor_coast'}>Стоимость по акции: <span*/}
                {/*    className={'w-b'}>{props.price}</span> грн*/}
                {/*</div>*/}
            </div>
            <div className="doctor_point">
                <div className="doctor_point_timer">
                    <div className="h7">Врач доступен <br/>через:</div>
                    <div className="doctor_point_timer_time">
                        <div className="doctor_point_timer_time_cycle"/>
                        <div className="tor-pulsate"/>
                        <div>30:00</div>
                        <div className="h7"> мин</div>
                    </div>
                </div>
                <TerapeftListCardOrder
                    price={props.price}
                    id={props.id}
                    position={props.specialties.map(ittem => ittem.name)}
                    nameOther={props.nameOther}
                    img={props.img}
                    name={props.name}
                    affiliates={props.affiliates}
                    activeSlides={props.activeSlides}
                    />
            </div>
        </div>
    );
}

export default TerapeftListCard;

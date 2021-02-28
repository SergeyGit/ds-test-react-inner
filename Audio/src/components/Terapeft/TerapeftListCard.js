import React from 'react';

import TerapeftListCardOrder from "./TerapeftListCardOrder";
import TerapeftListCardAboutText from "./TerapeftListCardAboutText";
import {LazyLoadImage} from "react-lazy-load-image-component";
const TerapeftListCard = props => {
    return (
        <div className={`doctor fade-in ${props.id === 11244 || props.id === 16057 || props.id === 21472 ? " assistance" : "" }`}>
            <div className="doctor_ava">
                <LazyLoadImage
                    alt={"doctor"}
                    src={props.img}/>
                <div className="doctor_rate_stars">
                    <span className="icon-star"/>
                    {props.rate}
                </div>
            </div>
            <div className="doctor_content">
                {
                    props.link === '' ?
                        <div className={'doctor_name f-w-m'}>  {props.name} <br/> {props.nameOther}</div>
                        : <a href={"https://doc.ua"+props.link} rel="noreferrer noopener" target={"_blank"}
                             className={'doctor_name f-w-m'}>{props.name} <br/> {props.nameOther}</a>
                }
                <div className="f-b">{props.specialties.map(ittem => ittem.name).join(", ")}</div>
                <div>{props.category_name}</div>
                <div className={"Terapeft_main_class_expr"}>
                    <span className={"Terapeft_main_class_expr_year"}>{props.year}</span>
                    {props.lang === 'ru' ? 'лет опыта' : 'років досвіду'}
                    {
                        !props.review_count < 1 ?
                            <div className="doctor_rate_link"><span>{props.review_count} </span>{props.lang === 'ru' ? 'отзывов' : 'відгуки'}</div>
                            : null
                    }

                </div>
                <TerapeftListCardAboutText
                    short_about={props.short_about}
                    lang={props.lang}
                />
                {/*<div className="Terapeft_main_stats">Дежурный</div>*/}
                {/*<div className={'doctor_coast'}>Стоимость по акции: <span*/}
                {/*    className={'w-b'}>{props.price}</span> грн*/}
                {/*</div>*/}
            </div>
            <div className="doctor_point">
                {/*<div className="doctor_point_timer">*/}
                    {/*<div className="h7">Врач доступен <br/>через:</div>*/}
                    {/*<div className="doctor_point_timer_time">*/}
                        {/*<div className="doctor_point_timer_time_cycle"/>*/}
                        {/*<div className="tor-pulsate"/>*/}
                        {/*<div>30:00</div>*/}
                        {/*<div className="h7"> мин</div>*/}
                    {/*</div>*/}
                {/*</div>*/}
                <TerapeftListCardOrder
                    price={props.price}
                    id={props.id}
                    position={props.specialties.map(ittem => ittem.name)}
                    category_name={props.category_name}
                    nameOther={props.nameOther}
                    img={props.img}
                    name={props.name}
                    affiliates={props.affiliates}
                    webInfo={props.webInfo}
                    domainName={props.domainName}
                    lang={props.lang}
                    />
            </div>
            {
                props.id === 11244 || props.id === 16057 || props.id === 21472 ?
                    <div className="Terapeft_main_stats"><span>{props.lang === 'ru' ? 'Дежурный' : 'Черговий'}</span></div>
                    : null
            }

        </div>
    );
}

export default TerapeftListCard;

import React from 'react';

import './SingleDoctors.scss'
import {Link} from "react-router-dom";
// import avaDoc from '../../img/doctor.jpg'


const SingleDoctors = props => {
    return (
        <React.Fragment>
            <div className='Single_name'>{props.name}</div>
            <div className="Single_container doctor-wrap fade-in-2">
                {
                    props.doctors.map((doctor, index) => {
                        return (
                            <div className="doctor" key={doctor.id}>
                                <div className="doctor_ava">
                                    <div className="PromoCard_clinics_slider_card_head_cont_rate">
                                        <span className="icon-star"/>
                                        {doctor.rate}
                                    </div>
                                    <img src={"https://doc.ua/api/image/image/"+doctor.media_id+"/96/130"} alt="doctor"/>
                                </div>
                                <div className="doctor_content">
                                    <a href={"/doctor/"+props.city+"/"+doctor.alias} className='h4 doctor_name'>{doctor.name} {doctor.name_other}</a>
                                    {/*<div className='h4 doctor_name'>{doctor.name} {doctor.name_other}</div>*/}
                                    <div className="w-b">{doctor.specialties}</div>
                                    <div className="doctor_category">{doctor.category}</div>
                                    <div className="PromoCard_clinics_slider_card_head_cont_line">
                                        {/*<a href={"https://doc.ua"+doctor.link} rel="noreferrer noopener" target={"_blank"} className="PromoCard_clinics_slider_card_head_cont_rev"><span>185</span>отзывов</a>*/}
                                        {
                                            doctor.review_count < 1 ? null
                                                :
                                                <a href={"/doctor/"+props.city+"/"+doctor.alias+"/review"} rel="noreferrer noopener" target={"_blank"} className="PromoCard_clinics_slider_card_head_cont_rev"><span>{doctor.review_count}</span>{props.uaProp ? "вiдгукiв" : "отзывов"}</a>
                                        }
                                    </div>
                                </div>
                                <div className="doctor_point">
                                    <div className='doctor_coast'>Стоимость по акции:
                                        {
                                            +props.price > 0  ?
                                               <span>
                                                   <b>{props.price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</b> грн
                                               </span>
                                                : <b>{props.uaProp ? "безкоштовно" : "бесплатно"}</b>
                                        }

                                    </div>
                                    <Link to={{
                                        pathname: '/promotions/checkout/' + props.idPromo,
                                        state: {
                                            doctor_index: index+1,
                                            linkInfo: props.linkInfo
                                        }
                                    }}
                                           className="PromoCard_clinics_slider_card_button">{props.uaProp ? "Записатись" : "Записаться"}
                                    </Link>

                                </div>
                                <script type="application/ld+json">
                                    {`{
                                        "@context": "http://schema.org",
                                        "@type": "Physician",
                                        "medicalSpecialty": "${doctor.specialties}",
                                        "priceRange": "${props.price}",
                                        "currenciesAccepted": "UAH",
                                        "name": "${doctor.name} ${doctor.name_other}",    
                                        "image":"https://doc.ua/api/image/image/${doctor.id}/70/94",
                                        "aggregateRating": {
                                        "@type": "AggregateRating",
                                        "ratingValue": "${doctor.rate}",
                                        "reviewCount": "${doctor.review_count}" 
                                        }
                                    }`}
                                </script>
                            </div>
                        )
                    })
                }


            </div>

        </React.Fragment>

    );
}

export default SingleDoctors;

import React from 'react';

import './SingleSlider.scss'
import {Link} from 'react-router-dom'

import Slider from "react-slick";
import Timer from "../Section/Promo/Timer";
import gift from "../../img/gift.svg"
import percent from "../../img/percent.svg";

const settingsSlider = {
    className: "Single_slider",
    dots: false,
    infinite: false,
    slidesToShow: 3,
    arrows: true,
    autoplay: false,
    speed: 200,
    swipeToSlide: true,
    cssEase: "linear",
    // variableWidth: true,
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                variableWidth: true,
                autoSlidesToShow: true,
                slidesToShow: 1,
                dots: true
            }
        },
        {
            breakpoint: 991,
            settings: {
                variableWidth: true,
                arrows: false,
                dots: true,
                slidesToShow: 1,
            }
        },
    ]

}
function pecentCoast(old, main) {
    return Math.floor((old - main)*100/ old);
}

const SingleSlider = props => {
    // let promoPercent = Math.floor((props.price_old - props.price)*100/ props.price_old);
    return (
        <>
            {
                props.array.length < 2
                    ? null
                    :<>
                        <div className={'Single_name mb-0'}><span>{props.name}</span>
                            {/*<a className={'Single_name_all'} href={'/promotions/'+props.city+'/all'}>Все акции <svg width="15" height="11" viewBox="0 0 15 11" fill="none" xmlns="http://www.w3.org/2000/svg">*/}
                            {/*    <path d="M13.8824 5.24247L10.5113 1.29192C10.3428 1.09439 10.0297 1.0697 9.83711 1.24253C9.64448 1.41537 9.6204 1.73635 9.78895 1.93388L12.4618 5.06963H1.48159C1.21671 5.06963 1 5.29185 1 5.56345C1 5.83505 1.21671 6.05727 1.48159 6.05727H12.4618L9.78895 9.19303C9.6204 9.39055 9.64448 9.71153 9.83711 9.88437C10.0297 10.0572 10.3428 10.0325 10.5113 9.83498L13.8824 5.88443C14.051 5.63752 14.0269 5.44 13.8824 5.24247Z" fill="#0957C3" stroke="#0957C3" strokeWidth="0.75" strokeMiterlimit="10"/>*/}
                            {/*</svg></a>*/}
                        </div>
                        <Slider {...settingsSlider}>
                            {props.array.map((slide) => {
                                return (
                                    slide.alias === props.activeAlias ? null
                                        :
                                    <div className="PromoCard" key={slide.id}>

                                        <div className="PromoCard_container">
                                            <div className="PromoCard_direct">{slide.specialties[0].name}</div>
                                            {
                                                slide.id
                                                    ? <Link className="PromoCard_tittle w-b h5" to={"/promotions/"+props.city+"/"+slide.alias} >{slide.name}</Link>
                                                    : <h5 className="PromoCard_tittle w-b">{slide.name}</h5>
                                            }
                                            <div className="PromoCard_content">

                                                <div className="PromoCard_clinics_slider_card_price">

                                                    {
                                                        slide.new_price && slide.old_price > 0 ? <div className="PromoCard_clinics_slider_card_price_other">
                                                            <div className="PromoCard_clinics_slider_card_price_old">{slide.old_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                                        </div> : null
                                                    }
                                                    {
                                                        slide.new_price ?
                                                            <div className="PromoCard_clinics_slider_card_price_main">{slide.new_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')} <span>грн</span></div>
                                                            : <div className="free">{props.uaProp ? "Безкоштовно" : "Бесплатно"}</div>
                                                    }
                                                </div>
                                                <div className="PromoCard_clinics_slider_card_price_mob">
                                                    {
                                                        slide.new_price && slide.old_price > 0 ?
                                                            <div className="PromoCard_clinics_slider_card_price_other">
                                                                <div
                                                                    className="PromoCard_clinics_slider_card_price_old">{slide.old_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                                            </div> : null
                                                    }
                                                    {
                                                        slide.new_price ?
                                                            <div className="PromoCard_clinics_slider_card_price_main">{slide.new_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}
                                                                <span> грн</span></div>
                                                            : <div className="h3">{props.uaProp ? "Безкоштовно" : "Бесплатно"}</div>
                                                    }
                                                </div>
                                                <div className="PromoCard_clinics_slider_card_flex-line">
                                                    {
                                                        slide.date === null ? null :
                                                            <div className="PromoCard_timer">
                                                                <div className="PromoCard_timer_sale">
                                                                    {
                                                                        slide.old_price === null || slide.old_price < 1 ?
                                                                            slide.new_price < 1 ?
                                                                                <div className="h3 w-b PromoCard_timer_sale_free">
                                                                                    <img className='PromoCard_timer_sale_free' src={gift} alt="free"/>
                                                                                </div>
                                                                                :
                                                                                <div className="h3 w-b PromoCard_timer_sale_free">
                                                                                    <img className='PromoCard_timer_sale_free' src={percent} alt="percent"/>
                                                                                </div>
                                                                            : pecentCoast(slide.old_price, slide.new_price) > 99
                                                                            ? <div className={'h3 w-b PromoCard_timer_sale_free'}><img src={gift} alt="free"/></div>
                                                                            : <div className={'PromoCard_timer_sale_percent w-b'}>{"-"+pecentCoast(slide.old_price, slide.new_price)+"%"}</div>
                                                                    }
                                                                </div>
                                                                <Timer
                                                                    date={slide.date_to}
                                                                    key={slide.id}
                                                                />
                                                            </div>
                                                    }
                                                    <Link to={{
                                                        pathname: `${props.uaProp ? "/ua" : ""}/promotions/checkout/${slide.alias}`,
                                                        state: {
                                                            linkInfo: props.linkInfo
                                                        }
                                                    }}
                                                          className="PromoCard_clinics_slider_card_button"
                                                    >{props.uaProp ? "Записатись" : "Записаться"}
                                                    </Link>

                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                )
                            })
                            }
                        </Slider>
                    </>
            }

        </>

    );
}

export default SingleSlider;

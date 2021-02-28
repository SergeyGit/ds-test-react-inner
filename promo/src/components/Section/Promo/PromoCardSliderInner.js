import React, {Component} from 'react'
// import img from '../../../img/image.jpg'
import shouldUpdate from 'recompose/shouldUpdate'
import Slider from "react-slick";
import {Link} from "react-router-dom";
import MapModal from "./modalMap/MapModal";

const settingsSlider = {
    className: "PromoCard_clinics_slider",
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    // vertical: true,
    autoplay: false,
    // verticalSwiping: true,
    speed: 450,
    // easing: "linear"
    responsive: [
        {
            breakpoint: 1199,
            settings: {
                vertical: false,
                swipeToSlide: true,
                // verticalSwiping: false,
                arrow: false,
                dots: true,
            }
        }
    ]
};
class PromoCardSliderInner extends Component {
    state = {
        showOnMap: false,
        mapCoordinateLatitude: undefined,
        mapCoordinateLongitude: undefined,
    }

    constructor(props) {
        super(props);
        this.closeFunction = this.closeFunction.bind(this);
    }

    showModals(lat, long) {
        document.documentElement.className = "overflow";
        document.getElementById('head').className = "Header open-modal";
        this.setState({
            mapCoordinateLatitude: lat,
            mapCoordinateLongitude: long,
            showOnMap: true
        })
    }
    closeFunction () {
        document.documentElement.className = "";
        document.getElementById('head').className = "Header";
        this.setState({
            showOnMap: false
        })
    }


    render() {
        return (
            <>
                {
                    this.state.showOnMap && this.state.mapCoordinateLatitude ?
                        <MapModal
                            latitude={this.state.mapCoordinateLatitude}
                            longitude={this.state.mapCoordinateLongitude}
                            closeFunction={this.closeFunction}
                        />
                        : null
                }
            <div className={`PromoCard_clinics ${this.props.slidesAffilates.length === 1 ? "only" : ""} ${this.state.showOnMap ? "open-modal" : ""}`}
            >

                <Slider {...settingsSlider}>
                    {this.props.slidesAffilates.map((slide, index) => {
                        return (
                            <div className="PromoCard_clinics_slider_card " key={slide.id}>
                                <div className="PromoCard_clinics_slider_card_head">
                                    <div className="PromoCard_clinics_slider_card_head_ava">
                                        <div className="PromoCard_clinics_slider_card_head_cont_rate">
                                            <span className="icon-star"/>
                                            {slide.rate}
                                        </div>
                                        <img src={"https://doc.ua/api/image/image/" + slide.media_id + "/96/96"}
                                             alt={slide.alias}/>
                                    </div>
                                    <div className="PromoCard_clinics_slider_card_head_cont">
                                        {/*<div className="h5 w-b">{slide.name.length > 34 ? slide.name.slice(0,34) + "..." : slide.name}</div>*/}
                                        <a href={"/klinika/"+this.props.city+"/"+slide.hospital_alias+"/"+slide.alias} className="PromoCard_clinics_slider_card_head_link w-b">{slide.name}</a>
                                        <div className="PromoCard_clinics_slider_card_head_cont_line">
                                            <a href={"/klinika/"+this.props.city+"/"+slide.hospital_alias+"/"+slide.alias+"/review"}
                                           className="PromoCard_clinics_slider_card_head_cont_rev"><span>{slide.review_count}</span> {this.props.uaProp ? "вiдгукiв" : "отзывов"}</a>
                                        </div>
                                        <div className="PromoCard_clinics_slider_card_head_cont_mob">
                                            <div className="PromoCard_clinics_slider_card_point show"
                                                 onClick={() => this.showModals(slide.latitude, slide.longitude)}
                                            >
                                                <div className="PromoCard_clinics_slider_card_point_icon icon-locate"/>
                                                <div className='PromoCard_clinics_slider_card_point_text'><span>{slide.address}</span> <span className="icon-in-map"/></div>
                                            </div>
                                            {
                                                slide.metro ?
                                                    <div className="PromoCard_clinics_slider_card_point last">
                                                        <div className="PromoCard_clinics_slider_card_point_icon icon-metro"/>
                                                        <div
                                                            className="PromoCard_clinics_slider_card_point_text">{slide.metro}</div>
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                </div>
                                <div className={`PromoCard_clinics_slider_card_point show ${!slide.metro ? "last" : ""}`}
                                     onClick={() => this.showModals(slide.latitude, slide.longitude)}
                                >
                                    <div className="PromoCard_clinics_slider_card_point_icon icon-locate"/>
                                    <div className='PromoCard_clinics_slider_card_point_text'><span>{slide.address}</span> <span className="icon-in-map"/></div>
                                </div>
                                {
                                    slide.metro ?
                                        <div className="PromoCard_clinics_slider_card_point last">
                                            <div className="PromoCard_clinics_slider_card_point_icon icon-metro"/>
                                            <div
                                                className="PromoCard_clinics_slider_card_point_text">{slide.metro}</div>
                                        </div>
                                        : null
                                }

                                <div className="PromoCard_clinics_slider_card_price">
                                    {
                                        this.props.mainPrice && this.props.oldPrice > 0 ?
                                            <div className="PromoCard_clinics_slider_card_price_other">
                                                <div
                                                    className="PromoCard_clinics_slider_card_price_old">{this.props.oldPrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                            </div> : null
                                    }
                                    {
                                        this.props.mainPrice ?
                                            <div className="PromoCard_clinics_slider_card_price_main">{this.props.mainPrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}
                                                <span> грн</span></div>
                                            : <div className="h3">{this.props.uaProp ? "Безкоштовно" : "Бесплатно"}</div>
                                    }
                                </div>
                                <div className="PromoCard_clinics_slider_card_button_cnt">
                                    <div className="PromoCard_clinics_slider_card_price_mob">
                                        {
                                            this.props.mainPrice && this.props.oldPrice > 0 ?
                                                <div className="PromoCard_clinics_slider_card_price_other">
                                                    <div
                                                        className="PromoCard_clinics_slider_card_price_old">{this.props.oldPrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                                </div> : null
                                        }
                                        {
                                            this.props.mainPrice ?
                                                <div className="PromoCard_clinics_slider_card_price_main">{this.props.mainPrice.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}
                                                    <span> грн</span></div>
                                                : <div className="h3">{this.props.uaProp ? "Безкоштовно" : "Бесплатно"}</div>
                                        }
                                    </div>
                                    <Link
                                        to={{
                                            pathname: `${this.props.uaProp ? "/ua" : ""}/promotions/checkout/${this.props.idPromo}`,
                                            state: {
                                                clinic_index: index,
                                                linkInfo: this.props.linkInfo
                                            }
                                        }}
                                        className='PromoCard_clinics_slider_card_button'
                                        // onClick="fbq('track', 'InitiateCheckout');ga('send', 'pageview','/go-to-action/');"
                                    >
                                        {this.props.uaProp ? "Записатись" : "Записаться"}
                                    </Link>
                                </div>

                                {/*{*/}
                                {/*    this.props.slidesAffilates.length > 1 ?*/}
                                {/*        <div className="PromoCard_clinics_slider_card_numb">{index + 1}*/}
                                {/*            <span> {this.props.slidesAffilates.length}</span></div> : null*/}
                                {/*}*/}

                            </div>
                        )
                    })
                    }
                </Slider>
            </div>
                </>
        )
    }

};
const checkPropsChange = (props, nextProps) =>
    (nextProps.slidesAffilates !== props.slidesAffilates);

export default shouldUpdate(checkPropsChange)(PromoCardSliderInner)
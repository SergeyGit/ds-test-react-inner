import React from 'react'


import Timer from './Timer'
import {Link} from 'react-router-dom'
import PromoCardSliderInner from "./PromoCardSliderInner";
import gift from "../../../img/gift.svg";
import percent from "../../../img/percent.svg";
// import PromoCardText from "./PromoCardText";

// import shouldUpdate from "recompose/shouldUpdate";
// import pure from 'recompose/pure';



const PromoCard = props => {
    let promoPercent = Math.floor((props.oldPrice - props.mainPrice)*100/ props.oldPrice);

    return (
        <div className="PromoCard ">
            <div className="PromoCard_container">

                <div className="PromoCard_content">
                    {
                        props.id ?
                            props.activeSpecielty ?
                                props.activeSpecielty !== "free" && props.activeSpecielty !== "hot" ?
                                    <div className={`PromoCard_direct ${props.activeSpecielty ?
                                    props.activeSpecielty !== "free" && props.activeSpecielty !== "hot" ? "blue" : ""
                                    : ""
                                }`}>{props.direction}</div>
                                    :
                                    <Link
                                        className="PromoCard_direct link"
                                        to={{
                                            pathname: `${props.uaProp ? "/ua" : ""}/promotions/${props.city}/all/${props.directionLink}`,
                                        }}
                                    >{props.direction}</Link>
                                :
                                <Link
                                    className="PromoCard_direct link"
                                    to={{
                                        pathname: `${props.uaProp ? "/ua" : ""}/promotions/${props.city}/all/${props.directionLink}`
                                    }}
                                >{props.direction}</Link>
                            : <div className={`PromoCard_direct ${props.activeSpecielty ?
                            props.activeSpecielty !== "free" && props.activeSpecielty !== "hot" ? "blue" : ""
                            : ""
                            }`}>{props.direction}</div>
                    }
                    {/*<div className={`PromoCard_direct ${props.activeSpecielty ? */}
                    {/*    props.activeSpecielty !== "free" && props.activeSpecielty !== "hot" ? "blue" : ""*/}
                    {/*    : ""*/}
                    {/*}`}>{props.direction}</div>*/}

                    {
                       props.id ? <Link
                            className="PromoCard_tittle w-b h2"
                            to={{
                                pathname: `${props.uaProp ? "/ua" : ""}/promotions/${props.city}/${props.alias}`,
                                state: {id: props.id, linkInfo: props.linkInfo}
                            }}
                        >{props.title}</Link>
                           : <h1 className="PromoCard_tittle w-b h2">{props.title}</h1>
                    }
                    <p >
                        {
                            props.text.length > 340 ?
                                props.text.slice(0, 340).replace(/<[^>]+>/g, '') + "..."
                                :
                                props.text.replace(/<[^>]+>/g, '')

                        }
                    </p>

                    {/*<PromoCardText*/}
                    {/*    short_about={props.text}*/}
                    {/*/>*/}
                    {
                        props.date === null ? null :
                            <div className="PromoCard_timer">
                                {
                                    props.oldPrice === null || props.oldPrice < 1 ?
                                        props.mainPrice < 1 ?
                                            <div className="PromoCard_timer_sale">
                                                <img className='PromoCard_timer_sale_free' src={gift} alt="free"/>
                                            </div>
                                            :
                                            <div className="PromoCard_timer_sale">
                                                <img className='PromoCard_timer_sale_free' src={percent} alt="percent"/>
                                            </div>
                                         :
                                        promoPercent > 99 ?
                                            <div className="PromoCard_timer_sale">
                                                <img className='PromoCard_timer_sale_free' src={gift} alt="free"/>
                                            </div> :
                                            <div className="PromoCard_timer_sale">
                                                <div>{props.uaProp ? "Знижка" : "Скидка"}</div>
                                                <div className='PromoCard_timer_sale_percent w-b'>{"-"+promoPercent+"%"}</div>
                                            </div>

                                }

                                <Timer
                                    date={props.date}
                                    // keyDate={props.idPromo}
                                    key={props.idPromo}
                                    uaProp={props.uaProp}
                                />
                            </div>
                    }

                </div>
                <PromoCardSliderInner
                    slidesAffilates={props.slidesAffilates}
                    mainPrice={props.mainPrice}
                    oldPrice={props.oldPrice}
                    city={props.city}
                    idPromo={props.alias ? props.alias : props.idPromo}
                    linkInfo={props.linkInfo}
                    uaProp={props.uaProp}
                />
            </div>

        </div>
    )
}
// const checkPropsChange = (props, nextProps) =>
//     (nextProps.id !== props.id);

// export default shouldUpdate(checkPropsChange)(PromoCard)
export default PromoCard
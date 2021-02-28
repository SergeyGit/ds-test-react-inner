import React from "react";

import './SectionThree.scss'

import TerapeftList from "../../Terapeft/TerapeftList";



const SectionThree = props => {
    let stateVar = {
        h1: 'Экспресс-консультация',
        h4: "Советуйтесь с врачом, а не с интернетом ",
        imgSec: require("../../../img/sec-3-im.svg"),
        ul: [
            "Экспресс-консультация подойдет Вам, если Вам нужен быстрый ответ на вопрос.",
            "Врач свяжется с Вами в течение 30 минут.",
            "Врач доступен каждый день с 8:00 до 21:00."
        ],
        activeDoc: 0,
        expresDoc: undefined
    }
    return(
            <section className={"SectionThree"} >
                <div className="container">
                    <div className="SectionThree_container">
                        <div className="SectionThree_point">
                            <div className="caption h1 image">{stateVar.h1}</div>
                            <div className="h4">{stateVar.h4}</div>
                            <div className="SectionThree_list">
                                {stateVar.ul.map((li, index) => {
                                    return(
                                        <div key={index} className="SectionThree_list_point h4">{li}</div>
                                    )
                                })
                                }

                            </div>
                        </div>
                        <img src={stateVar.imgSec} className={"SectionThree_point_img"} alt="section3 img"/>
                    </div>
                    <TerapeftList
                        activeSlides={props.activeSlidesArr}
                    />
                </div>
            </section>
        )
}

export default SectionThree
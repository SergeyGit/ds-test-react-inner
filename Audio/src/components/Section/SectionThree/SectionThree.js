import React, { Component } from "react";
import request from "superagent"

import './SectionThree.scss'
import grayImg from '../../../img/gray-im-1.png'

import Terapeft from '../../Terapeft/Terapeft'



class SectionThree extends Component {
    state = {
        h1: 'Онлайн-консультация',
        h4: "Советуйтесь с врачом, а не с интернетом ",
        imgSec: require("../../../img/sec-3-im.svg"),
        ul: [
            "Онлайн-консультация подойдет вам, если вам нужен быстрый ответ на вопрос связанный со здоровьем",
            "Врач может связаться с вами уже через 30 минут",
            "Врачи доступны каждый день с 8:00 до 20:00"
        ],
        activeDoc: 0,
        expresDoc: undefined
    }
    componentDidMount() {
        request
            // .get('/go/doctors')
            .get('http://localhost:3000/doctors.json')
            .then(response => {
                // const dataJson = response.body;
                this.setState({
                    expresDoc: response.body.doctors
                });
            })
            .catch(err => {
                console.log("Error doctors")
            })

    }
    onDocHandler = () =>  {
        if ( this.state.activeDoc + 1 === this.state.expresDoc.length) {
            this.setState( {
                activeDoc: 0
            });
        } else {
            this.setState( {
                activeDoc: this.state.activeDoc + 1
            });
        }

    }
    onDocHandlerMinus = () =>  {

        if ( this.state.activeDoc - 1 < 0) {
            this.setState( {
                activeDoc: this.state.expresDoc.length - 1
            });
        } else {
            this.setState( {
                activeDoc: this.state.activeDoc - 1
            });
        }

    }

    render() {
        return(
            <section className={"SectionThree"} >
                <div className="container white-sec_cnt">
                    <div className="gray-sec_img">
                        <img className="lazy gray-sec_img-tw" alt="about" src={grayImg} />
                    </div>
                    <div className="gray-sec_point">
                        <div className="gray-sec_point_caption h2  fadeIn">Мобільний додаток <br/>«DOC.ua Лікар» це:</div>
                        <div className="main-sec_side_text_list">
                            <div className="main-sec_side_text_list_point">Отримувати щомісячну виплату винагород</div>
                            <div className="main-sec_side_text_list_point">Відслідковувати виконання призначень
                                пацієнтом
                            </div>
                            <div className="main-sec_side_text_list_point">Автоматично відправляти нагадування пацієнту
                                про призначеня
                            </div>
                            <div className="main-sec_side_text_list_point">Можливість відслідковувати підсумки
                                співпраці
                            </div>
                            <div className="main-sec_side_text_list_point">Через мобільний додаток “Doc.ua Likar” ви
                                можете легітимно заробляти не відволікаючись від основної роботи
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container">
                    <div className="SectionThree_container">
                        <div className="SectionThree_point">
                            <div className="caption h1 image">{this.state.h1}</div>
                            <div className="h4">{this.state.h4}</div>
                            <div className="SectionThree_list">
                                {this.state.ul.map((li, index) => {
                                        return(
                                            <div key={index} className="SectionThree_list_point h4">{li}</div>
                                        )
                                    })
                                }

                            </div>
                        </div>
                        <img src={this.state.imgSec} className={"SectionThree_point_img"} alt="section3 img"/>
                    </div>
                    {
                        !this.state.expresDoc || !this.state.expresDoc.length
                        ? null
                        :
                         <Terapeft
                                keyDoc={this.state.activeDoc}
                                onSliderClick={this.onDocHandler}
                                onSliderClickMinus={this.onDocHandlerMinus}
                                expresDoc={this.state.expresDoc[this.state.activeDoc]}
                                activeSlides={this.props.activeSlidesArr}
                            />
                    }
                </div>
            </section>
        )
    }
}

export default SectionThree
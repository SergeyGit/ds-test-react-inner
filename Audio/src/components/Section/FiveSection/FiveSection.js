import React, { Component } from "react";
import Slider from "react-slick";
import './FiveSection.scss'

class FiveSection extends Component{
    state = {

        h11: this.props.lang === 'ru' ? [
            "Что такое аудио консультация и для чего она нужна?",
            "Как заказать?"
        ] : [
            "Что такое аудио консультация и для чего она нужна?",
            "Як замовити?"
        ],
        steps: {
            img: require("../../../img/doctor-icon.png"),
            texts: [
                "Выберите, что вас тревожит \n" +
                "и подходящего врача",
                "Введите ваши контактные \n" +
                "данные",
                "Оставьте комментарий и/или \n" +
                "добавьте мед. документы или результаты анализов",
                "Оплатите выбранную услугу\n" +
                "и ожидайте звонка врача",
            ],
            textsukr: [
                "Оберіть, що вас турбує, або відповідного лікаря",
                "Введіть ваші контактні дані",
                "При необхідності, залиште коментар або додайте медичні документи та/або результати аналізів",
                "Оплатіть обрану послугу та очікуйте на дзвінок лікаря"
            ]
        },
        stars: require('../../../img/stars.svg'),
        finger: require('../../../img/finger.svg'),
        slider: [
            {
                text: "Возникла необходимость обратиться за консультацией к врачу из-за того, что поднялась температура. В результате разговора врач настоял на вызове скорой помощи и как оказалось не зря. Сейчас уже иду на поправку. Спасибо! ",
                image: "",
                link: "www.facebook.com",
                textLink: "Facebook",
                name: "Софья",
                age: "26 лет",
                date: "29 февраля 2020"

            },
            {
                text: "Все очень понравилось! Это как раз тот случай, когда можно проконсультироваться с доктором по поводу любых своим проблем со здоровьем, не опасаясь, что он будет что-то навязывать или давать рекомендации по покупке ненужных медикаментов. ",
                image: "",
                link: "www.facebook.com",
                textLink: "Facebook",
                name: "Сергей",
                age: "32 лет",
                date: "3 марта 2020"
            },
            {
                text: "Была проблема с болью в горле. Очень боялась, что ангина. Но врач меня успокоила и рассказала как поступить. Не пришлось ехать к врачу. Большое спасибо!",
                image: "",
                link: "www.instagram.com",
                textLink: "Inst",
                name: "Марина",
                age: "21 год",
                date: "10 марта 2020"
            },
        ]
    }

    render() {
        const settingsSlider = {
            className: "FiveSection_slider",
            dots: false,
            infinite: true,
            // slidesToShow: 3,
            autoplay: false,
            speed: 200,
            swipeToSlide: true,
            cssEase: "linear",
            variableWidth: true,
            responsive: [
                {
                    breakpoint: 991,
                    settings: {
                        arrows: false
                    }
                },
            ]

        };
        return (
            <>
                <section className={'FiveSection'} id={"how-book"}>
                    <div className="container">
                        <div className="caption h2">{this.props.lang === 'ru' ? 'Как заказать?' : 'Як замовити?'}</div>
                        <div className="FourSection_steps">
                            {
                                this.props.lang === 'ru' ?
                                    this.state.steps.texts.map((text, index) => {
                                        if (index + 1 === this.state.steps.texts.length) {
                                            return (
                                                <div key={index} className={'FourSection_steps_point'}>
                                                    <img src={this.state.steps.img} alt="doctor"/>
                                                    {text}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={index} className={'FourSection_steps_point'}>
                                                    <div className="FourSection_steps_point_numb">{index + 1}</div>
                                                    {text}
                                                </div>
                                            )
                                        }
                                    }) :
                                    this.state.steps.textsukr.map((text, index) => {
                                        if (index + 1 === this.state.steps.texts.length) {
                                            return (
                                                <div key={index} className={'FourSection_steps_point'}>
                                                    <img src={this.state.steps.img} alt="doctor"/>
                                                    {text}
                                                </div>
                                            )
                                        } else {
                                            return (
                                                <div key={index} className={'FourSection_steps_point'}>
                                                    <div className="FourSection_steps_point_numb">{index + 1}</div>
                                                    {text}
                                                </div>
                                            )
                                        }

                                    })
                            }
                        </div>
                        {
                            this.props.domainName === 'audio.doc.online' ?
                                <div className="FourSection_min-text">*Стоимость консультации указана в долларах. При оплате консультации ваш банк может удержать комиссию за конвертирование валюты вашей карты в доллары.</div>
                                : null
                        }

                    </div>
                </section>
                <div className="container FiveSection_slider_sec ">
                    <div className={'caption h2'}
                         id={'review'}>{this.props.lang === 'ru' ? 'Отзывы пользователей' : 'Відгуки користувачів'}</div>
                    <Slider {...settingsSlider}>
                        {this.state.slider.map((slide, index) => {
                            return (
                                <div className="FiveSection_slider_point" key={index}>
                                    <img src={this.state.stars} alt="rate" className="FiveSection_slider_point_stars"/>
                                    <div className="FiveSection_slider_point_text">{slide.text}</div>
                                    <div className="FiveSection_slider_point_people">
                                        {/* <img src={slide.image} alt="avatar" className="FiveSection_slider_point_people_ava"/> */}
                                        <div className="FiveSection_slider_point_people_info">
                                            <div
                                                className="FiveSection_slider_point_people_info_name h4">{slide.name}&nbsp; - <span
                                                className="FiveSection_slider_point_people_info_name_age">{slide.age}</span>
                                            </div>
                                            {/*<a href={slide.link} className="FiveSection_slider_point_people_info_link">{slide.textLink}</a>*/}
                                        </div>
                                        <div className="FiveSection_slider_point_people_date">{slide.date}</div>
                                    </div>
                                </div>
                            )
                        })
                        }
                    </Slider>
                    <img alt={'tex'} src={this.state.finger} className="FiveSection_slider_finger"/>
                </div>

            </>
        )
    }
}
export default FiveSection
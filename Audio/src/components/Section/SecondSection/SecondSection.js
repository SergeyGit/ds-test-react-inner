import React, { Component } from "react";

import './SecondSection.scss';

import SecondSectionSlider from "./SecondSectionSlider";

class SecondSection extends Component{
    state = {
        slider: [
            {
                text: 'Подозрение на коронавирус',
                image: require( "../../../img/slider12.svg" )
            },
            {
                text: 'Грипп и ОРВИ',
                image: require( "../../../img/slider2.svg" )
            },
            {
                text: 'Заболел ребенок',
                image: require( "../../../img/slider1.svg" )
            },
            {
                text: 'Кожные заболевания',
                image: require( "../../../img/slider3.svg" )
            },
            {
                text: 'Расстройство пищеварения',
                image: require( "../../../img/slider6.svg" )
            },
            {
                text: 'Боль в спине или суставах',
                image: require( "../../../img/slider9.svg" )
            },
            {
                text: 'Проблемы с давлением',
                image: require( "../../../img/slider13.svg" )
            },
            {
                text: 'Расшифровка анализов',
                image: require( "../../../img/slider5.svg" )
            },
            {
                text: '«Женское здоровье»',
                image: require( "../../../img/slider14.svg" )
            },
            {
                text: '«Мужское здоровье»',
                image: require( "../../../img/slider15.svg" )
            },
            {
                text: 'Другой вопрос',
                image: require( "../../../img/slider11.svg" )
            }
        ],
        sliderukr: [
            {
                text: 'Підозра на коронавірус',
                image: require( "../../../img/slider12.svg" )
            },
            {
                text: 'Грип і ГРВІ',
                image: require( "../../../img/slider2.svg" )
            },
            {
                text: 'Захворіла дитина',
                image: require( "../../../img/slider1.svg" )
            },
            {
                text: 'Хвороби шкіри',
                image: require( "../../../img/slider3.svg" )
            },
            {
                text: 'Розлад травлення',
                image: require( "../../../img/slider6.svg" )
            },
            {
                text: 'Біль у спині чи суглобах',
                image: require( "../../../img/slider9.svg" )
            },
            {
                text: 'Проблеми з тиском',
                image: require( "../../../img/slider13.svg" )
            },
            {
                text: 'Розшифровка аналізів',
                image: require( "../../../img/slider5.svg" )
            },
            {
                text: '«Жіноче здоров\'я»',
                image: require( "../../../img/slider14.svg" )
            },
            {
                text: '«Чоловіче здоров\'я»',
                image: require( "../../../img/slider15.svg" )
            },
            {
                text: 'Інше запитання',
                image: require( "../../../img/slider11.svg" )
            }
        ]
    };
    // handleClick = (event) => {
    //     event.currentTarget.classList.toggle("active")
    // }

    render() {

        return (
            <section className={'SecondSection'} id={'symptoms'}>
                <div className="container">
                    <div className={'caption h1'}>{this.props.lang === 'ru' ? 'Выберите, что вас тревожит?' : 'Оберіть, що вас турбує?'}</div>
                    <SecondSectionSlider
                        activeSlidesArr={this.props.activeSlidesArr}
                        sliderInfo={this.props.lang === 'ru' ? this.state.slider : this.state.sliderukr}
                        handleClickSlide={this.props.activeSlides}
                    />
                </div>

            </section>
        )
    }
}
export default SecondSection
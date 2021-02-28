import React from "react";
import Slider from "react-slick";
import img from "../../../img/emptyslider.svg"

const settingsSlider = {
    className: "SecondSection_slider",
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: false,
    speed: 200,
    cssEase: "linear",
    responsive: [
        {
            breakpoint: 1190,
            settings: {
                slidesToShow: 4
            }
        },
        {
            breakpoint: 900,
            settings: {
                slidesToShow: 3
            }
        },
        {
            breakpoint: 600,
            settings: {
                slidesToShow: 2,
            }
        },
        {
            breakpoint: 370,
            settings: {
                slidesToShow: 1,
            }
        }
    ]
};

const SecondSectionSlider = props => (

    <Slider {...settingsSlider}>
        {props.sliderInfo.map((slide, index) => {
            return (
                <div className={props.activeSlidesArr.indexOf(index) > -1 ?  "SecondSection_slider_point active" : "SecondSection_slider_point"}
                     onClick={(e) => props.handleClickSlide(index, e)} key={index}
                     // data-checked={props.activeSlidesArr.indexOf(slide.text) > -1}
                     data-value={slide.text}
                >
                    <img src={slide.image} alt="" className={'SecondSection_slider_point_img'}/>
                    <div className="SecondSection_slider_point_text">{slide.text}</div>
                </div>
            )
            })
        }
    </Slider>
)
export default SecondSectionSlider
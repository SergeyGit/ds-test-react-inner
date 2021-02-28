import React from 'react'
import './FirstSection.scss'
import Bradcrumb from "../../Navigation/Bradcrumbs/Bradcrumb";
import {LazyLoadImage} from "react-lazy-load-image-component";
// import LazyLoad from 'react-lazyload';
// import imgFirstSec from '../../../img/first-sec-im.png'
import imgFirstSec_one from '../../../img/first-sec-im-1.png'
import imgFirstSec_two from '../../../img/first-sec-im-2.png'
import imgFirstSec_thr from '../../../img/first-sec-im-3.png'
import imgFirstSec_fr from '../../../img/first-sec-im-4.png'

const FirstSection = (props) => {
    return(
        <section className="FirstSection " >
            <div className="container">
                <Bradcrumb
                    {...props}
                    inner={true}
                />
                {/*<div className="FirstSection_container">*/}
                {/*    /!*<div className="FirstSection_content">*!/*/}
                {/*    /!*    <h1 className={'FirstSection_caption'}>Акции</h1>*!/*/}
                {/*    /!*    <h5 className="FirstSection_text">только через DOC.ua</h5>*!/*/}
                {/*    /!*</div>*!/*/}


                {/*        <div className="FirstSection_img">*/}
                {/*            <LazyLoad>*/}
                {/*                <img src={imgFirstSec} alt=" first"/>*/}
                {/*            </LazyLoad>*/}
                {/*        </div>*/}


                {/*</div>*/}
                <h1 className="FirstSection_content">
                    <div className={'FirstSection_caption'}>{props.uaProp ? "Акції" : "Акции"}</div>
                </h1>
                <img
                    className="FirstSection_img_point_one"
                    src={imgFirstSec_one}
                    alt="1"
                />
                <img
                    className="FirstSection_img_point_two"
                    src={imgFirstSec_two}
                    alt="2"
                />
                <LazyLoadImage
                    className="FirstSection_img_point_thr"
                    src={imgFirstSec_thr}
                />
                <LazyLoadImage
                    className="FirstSection_img_point_fr"
                    src={imgFirstSec_fr}
                />
                <LazyLoadImage
                    className="FirstSection_img_point_thr double"
                    src={imgFirstSec_thr}
                />
                <LazyLoadImage
                    className="FirstSection_img_point_fr double"
                    src={imgFirstSec_fr}
                />
            </div>
        </section>
    )
}


export default FirstSection
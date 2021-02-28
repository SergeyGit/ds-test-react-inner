import React from 'react';
import './ExpressConsultation.scss';
import {LazyLoadImage} from "react-lazy-load-image-component";
import {Link} from 'react-router-dom'
import docIconImg1 from "../../../img/exp-doc-1.png";
import docIconImg2 from "../../../img/exp-doc-2.png";

const ExpressConsultation = props => {
    return (
        <div className="SectionThree_container ">
            <div className="gray-sec_point">
                <div className="gray-sec_point_caption h2  fadeIn">{props.lang === 'ru' ? 'Экспресс консультация' : 'Експрес консультація'}</div>
                <div className="h4">{props.lang === 'ru' ? "Советуйтесь с врачом, а не с интернетом " : 'Краще порадитися з лікарем, аніж з інтернетом'}</div>
                <div className="main-sec_side_text_list">
                    {
                        props.domainName === 'audio.doc.online' ?
                            props.ulOnline.map((li, index) => {
                                return (
                                    <div key={index} className="main-sec_side_text_list_point">{li}</div>
                                )
                            })
                            :
                            props.ul.map((li, index) => {
                                return (
                                    <div key={index} className="main-sec_side_text_list_point">{li}</div>
                                )
                            })
                    }
                </div>
            </div>
            <div className="ExpressConsultation_doc">
                <div className="ExpressConsultation_doc_point">
                    <div className="ExpressConsultation_doc_point_img">
                        <LazyLoadImage
                            alt={"doc"}
                            src={docIconImg1}/>
                    </div>
                    <div className="ExpressConsultation_doc_point_text">
                        <div className="f-b">{props.lang === 'ru' ? 'Дежурный терапевт' : 'Черговий терапевт'}</div>
                        <span className="f-b">150 грн</span>
                        <Link className="doctor_button"
                              to={{
                                  pathname: `${props.domainName === 'audio.doc.online' ? '': '/audio'}/doctor/33252`,

                              }}
                        >{props.lang === 'ru' ? 'Записаться' : 'Записатись'}</Link>
                    </div>
                </div>
                <div className="ExpressConsultation_doc_point">
                    <div className="ExpressConsultation_doc_point_img">
                        <LazyLoadImage
                            alt={"doc"}
                            src={docIconImg2}/>
                    </div>
                    <div className="ExpressConsultation_doc_point_text">
                        <div className="f-b">{props.lang === 'ru' ? 'Дежурный педиатр' : 'Записатись'}</div>
                        <span className="f-b">150 грн</span>
                        <Link className="doctor_button"
                              to={{
                                  pathname: `${props.domainName === 'audio.doc.online' ? '': '/audio'}/doctor/33678`,
                              }}
                        >{props.lang === 'ru' ? 'Записаться' : 'Записатись'}</Link>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ExpressConsultation;

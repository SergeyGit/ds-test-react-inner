import React, { Component }  from 'react';
import {Redirect, withRouter} from 'react-router-dom';
import {connect} from "react-redux";
import request from 'superagent';
// import DatePicker, {registerLocale} from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import 'react-phone-number-input/style.css'
import PhoneInput, {  isValidPhoneNumber} from 'react-phone-number-input'
import {scroller} from "react-scroll";

import {fetchJsonById} from "../../store/actions/mainPageAction";
import './Checkout.scss'
// import DoctorCard from "../Section/DoctorCard/DoctorCard";
// import SInfoTabs from "./InfoTabs/SInfoTabs";
// import NearDoctors from "./NearDoctors/NearDoctors";
// import ru from 'date-fns/locale/ru';
import Bradcrumb from "../Navigation/Bradcrumbs/Bradcrumb";
import Helmet from "react-helmet";
// registerLocale('ru', ru);

// const linkStart = "http://stage1.r2rx.doc.ua";
// const linkStart = "";
class Checkout extends Component {
    state = {
        // clinica: this.props.location.state ?
        //     this.props.location.state.indexPromo ?
        //         this.props.location.state.indexPromo : 0
        //     : 0,
        clinica: !this.props.location.state ? 0 :
            !this.props.location.state.clinic_index || this.props.location.state.clinic_index < 0 ? 0 : this.props.location.state.clinic_index ,
        recomendDoctors:  undefined,
        showTextarea: false,
        phone: '',
        contactPeopleInfo: {
            name: '',
            comment: '',
            doctor_id: '',
            affiliate_id: '',
            desired_date: '',
            email: '',
            promocode: ''
        },
        doctorId: undefined,
        validPhone: true,
        validName: true,
        startDate: new Date(1990, 0, 1),
        selectDate: new Date(1990, 0, 1),
        promoClass: '',
        promoDone: undefined,
        promoStatus: false,
        rulesAccept: true,
        classAccept: '',
        loading: false,
    }
    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputPhone = this.handleInputPhone.bind(this);
    }
    componentDidMount() {
        window.scrollTo(0, 0);
        document.body.classList.remove('scroll')
        document.body.classList.add('no-menu')
        // console.log(this.props.dataJson)
        // console.log(this.props.match.params.id)
        this.props.fetchJsonById(this.props.match.params.alias)
        // console.log(this.props.location.state)
    }
    handlePromoSubmit() {
        // e.preventDefault();
        this.setState({
                promoClass: 'error'
            }
        )
    }
    handlePromoClear() {
        this.setState(prevState => ({
                promoClass: '',
                contactPeopleInfo: {...prevState.contactPeopleInfo, promocode: ''},
            })
        )
    }
    handleFormSubmit(e) {
        e.preventDefault();
        if (this.state.contactPeopleInfo.name.length >= 2) {
            this.setState({
                validName: true
            })
            if (isValidPhoneNumber(this.state.phone)) {
                if(this.state.rulesAccept) {
                    this.setState({
                        loading: true,
                        doctorId: this.props.location.state ? this.props.location.state.doctor_id ? this.props.info.doctors.find((doc) => doc.id === +(this.props.location.state.doctor_id)) : undefined : undefined
                    }, function () {
                        request
                            .post(process.env.REACT_APP_REQUEST_PATH+'/api/order/create')
                            // .set('Content-Type', 'multipart/form-data')
                            .send({ token: '6B8ikqKatHWVR',
                                doctor_id:  this.state.doctorId ? +this.state.doctorId.id : undefined,
                                affiliate_id: this.props.info.promotion.affiliates[this.state.clinica].id,
                                name: this.state.contactPeopleInfo.name,
                                email: this.state.contactPeopleInfo.email,
                                phone: this.state.phone,
                                comment: this.state.contactPeopleInfo.comment,
                                specialOffer_id: this.props.info.promotion.id,
                                source: this.props.location.state ? this.props.location.state.linkInfo ? this.props.location.state.linkInfo : 20 : 20
                            })
                            // .field('price',this.props.location.state.price)
                            .then(res => {
                                let e = new Date(new Date().getTime() + 1000 * 3600 * 24 * 30);
                                let domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
                                document.cookie = "user_order_id=" +res.body.id+ "; domain=."+domain+"; path=/; expires=" + e.toUTCString();
                                setTimeout(function () {
                                    window.location.href = "/thankyou";
                                }, 700);
                                console.log('Send')
                            })
                            .catch(err => {
                                console.log("Error " + err);
                                this.setState({
                                    loading: false
                                })
                            });
                    })
                } else {
                    this.setState({
                        classAccept: 'red'
                    })
                }
            } else {
                this.setState({
                    validPhone: false
                }, function () {
                    scroller.scrollTo('phoneInp', {
                        duration: 500,
                        smooth: true,
                        offset: -150,
                    });
                })
            }
        } else {
            this.setState({
                validName: false
            }, function () {
                scroller.scrollTo('nameInput', {
                    duration: 500,
                    smooth: true,
                    offset: -150,
                });
            })
        }


    }
    handleInput(e) {
        let value = e.target.value;
        let name = e.target.name;
        this.setState( prevState => {
                return {
                    contactPeopleInfo : {
                        ...prevState.contactPeopleInfo, [name]: value
                    }
                }
            }
            // , () => console.log(this.state.contactPeopleInfo)
        )
    }
    handleInputPhone(e) {
        this.setState({
            phone:  !e ? '' : e,
            validPhone: true
        })
    }
    // handleChangeDate= date => {
    //     this.setState({
    //         selectDate: date
    //     });
    //     console.log(date.toLocaleDateString('ru-RU'))
    // };

    render() {
        return (
            <section>
                <Helmet>
                    <meta name="robots" content="noindex, nofollow"/>
                </Helmet>
                <Bradcrumb
                    {...this.props}
                    check={true}

                />
                {
                    !this.props.info ? null
                        :
                        <div className="Checkout fade-in-2">
                            <div className="container Checkout_cnt">
                                <div className="Checkout_caption">{this.props.uaProp ? "Запис на прийом" : "Запись на прием"}</div>
                                <div className="Checkout_point">
                                    <div className="Checkout_point_caption m-w h5">{this.props.uaProp ? "Акція" : "Акция"}</div>
                                    <div className="Checkout_point_line">
                                        <div className="PromoCard_tittle w-b h5" >{this.props.info.promotion.name}</div>
                                        {/*{*/}
                                        {/*    this.props.info.promotion.date_to === null ? null :*/}
                                        {/*        <div className="PromoCard_timer small check">*/}
                                        {/*            <div className="PromoCard_timer_sale">*/}
                                        {/*                {*/}
                                        {/*                    this.props.info.promotion.old_price === null || this.props.info.promotion.new_price === 0 || this.props.info.promotion.old_price <= 0 ? <img src={gift}    alt="free"/>*/}
                                        {/*                        : pecentCoast(this.props.info.promotion.old_price, this.props.info.promotion.new_price) > 99*/}
                                        {/*                        ? <img src={gift}  alt="free"/>*/}
                                        {/*                        : <div className={'PromoCard_timer_sale_percent w-b'}>{"-"+pecentCoast(this.props.info.promotion.old_price, this.props.info.promotion.new_price)+"%"}</div>*/}
                                        {/*                }*/}
                                        {/*            </div>*/}
                                        {/*            <Timer*/}
                                        {/*                date={this.props.info.promotion.date_to}*/}
                                        {/*                key={this.props.info.promotion.id}*/}
                                        {/*            />*/}
                                        {/*        </div>*/}
                                        {/*}*/}
                                        <div className="PromoCard_clinics_slider_card_price">
                                            {
                                                this.props.info.promotion.new_price && this.props.info.promotion.old_price > 0 ? <div className="PromoCard_clinics_slider_card_price_other">
                                                    <div className="PromoCard_clinics_slider_card_price_old">{this.props.info.promotion.old_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                                </div> : null
                                            }
                                            {
                                                this.props.info.promotion.new_price ?
                                                    <div className="PromoCard_clinics_slider_card_price_main">{this.props.info.promotion.new_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')} <span>грн</span></div>
                                                    : <div className="h5">{this.props.uaProp ? "Безкоштово" : "Бесплатно"}</div>
                                            }
                                        </div>
                                    </div>

                                </div>
                                <div className="Checkout_point">
                                    <div className="Checkout_point_caption m-w h5">{this.props.uaProp ? "Клініка" : "Клиника"}</div>
                                    <div className="doctor">
                                        <div className="doctor_ava">
                                            {/*<div className="PromoCard_clinics_slider_card_head_cont_rate"><span*/}
                                            {/*    className="icon-star"/>{this.props.info.promotion.affiliates[this.state.clinica].rate}*/}
                                            {/*</div>*/}
                                            <img src={"https://doc.ua/api/image/image/" + this.props.info.promotion.affiliates[this.state.clinica].media_id + "/96/96"}
                                                 alt={this.props.info.promotion.affiliates[this.state.clinica].alias}/>
                                        </div>
                                        <div className="doctor_content">
                                            <div  rel="noreferrer noopener" target="_blank" className="h5 doctor_name">{this.props.info.promotion.affiliates[this.state.clinica].name}</div>
                                            {/*<div className="w-b"> param </div>*/}
                                            <div className="h8">
                                                {
                                                    this.props.info.promotion.specialties.map((category, index) => {
                                                        return (
                                                            this.props.info.promotion.specialties.length === index + 1  ? category.name : category.name +', '
                                                        )
                                                    })
                                                }
                                            </div>
                                            {/*<div className="PromoCard_clinics_slider_card_head_cont_line">*/}
                                            {/*    {*/}
                                            {/*        this.props.info.promotion.affiliates[this.state.clinica].review_count < 1 ? null*/}
                                            {/*            :*/}
                                            {/*            <div className="PromoCard_clinics_slider_card_head_cont_rev"><span>{this.props.info.promotion.affiliates[this.state.clinica].review_count}</span>отзывов</div>*/}
                                            {/*    }*/}
                                            {/*</div>*/}
                                        </div>
                                    </div>
                                </div>
                                {
                                    !this.props.location.state ? null
                                        :
                                        !this.props.location.state.doctor_index || this.props.location.state.doctor_index < 0 ? null
                                            :
                                            <div className="Checkout_point">
                                                <div className="Checkout_point_caption m-w h5">Врач</div>
                                                <div className="doctor">
                                                    <div className="doctor_ava">
                                                        <div className="PromoCard_clinics_slider_card_head_cont_rate"><span
                                                            className="icon-star"/>{this.props.info.doctors[this.props.location.state.doctor_index - 1].rate}
                                                        </div>
                                                        <img src={"https://doc.ua/api/image/image/" + this.props.info.doctors[this.props.location.state.doctor_index - 1].media_id + "/96/96"} alt={this.props.info.doctors[this.props.location.state.doctor_index - 1].name}/>
                                                    </div>
                                                    <div className="doctor_content">
                                                        <div  rel="noreferrer noopener" target="_blank" className="h5 doctor_name">{this.props.info.doctors[this.props.location.state.doctor_index - 1].name} {this.props.info.doctors[this.props.location.state.doctor_index - 1].name_other}</div>
                                                        <div className="w-b"> {this.props.info.doctors[this.props.location.state.doctor_index - 1].specialties} </div>
                                                        <div className="doctor_category">
                                                            {
                                                                this.props.info.doctors[this.props.location.state.doctor_index - 1].category
                                                            }
                                                        </div>
                                                        <div className="PromoCard_clinics_slider_card_head_cont_line">
                                                            {
                                                                this.props.info.doctors[this.props.location.state.doctor_index - 1].review_count < 1 ? null
                                                                    :
                                                                    <div className="PromoCard_clinics_slider_card_head_cont_rev"><span>{this.props.info.doctors[this.props.location.state.doctor_index - 1].review_count}</span>{this.props.uaProp ? "відгуків" : "отзывов"}</div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                }
                                <div className="Checkout_point">
                                    <div className="Checkout_point_caption m-w h5">{this.props.uaProp ? "Ваші дані" : "Ваши данные"}</div>
                                    <div className="Checkout_form">
                                        <div className="Checkout_form_point">
                                            <div className="Checkout_form_point_label">{this.props.uaProp ? "Ім'я та прізвище" : "Имя и фамилия"}</div>
                                            <div className={`Checkout_form_point_input require ${this.state.validName ? '' : "err"}`}>
                                                <input
                                                    id={'nameInput'}
                                                    type="text" name='name'
                                                    value={this.state.contactPeopleInfo.name}
                                                    onChange={this.handleInput}
                                                />
                                            </div>
                                        </div>
                                        <div className="Checkout_form_point">
                                            <div className="Checkout_form_point_label">Email</div>
                                            <div className="Checkout_form_point_input ">
                                                <input type="text" name='email'
                                                       value={this.state.contactPeopleInfo.email}
                                                       onChange={this.handleInput}
                                                />
                                            </div>
                                        </div>
                                        <div className="Checkout_form_point">
                                            <div className="Checkout_form_point_label">Телефон</div>
                                            <div className={`Checkout_form_point_input require ${this.state.validPhone ? '' : "err"}`}>
                                                <PhoneInput
                                                    displayInitialValueAsLocalNumber
                                                    international
                                                    id={'phoneInp'}
                                                    name="phone"
                                                    value={this.state.phone}
                                                    onChange={this.handleInputPhone}
                                                    defaultCountry="UA"
                                                    maxLength={18}
                                                />
                                            </div>
                                        </div>
                                        {/*<div className="Checkout_form_point">*/}
                                        {/*    <div className="Checkout_form_point_label">Дата рождения</div>*/}
                                        {/*    <div className="Checkout_form_point_input require">*/}
                                        {/*        <DatePicker*/}
                                        {/*            dateFormat="dd/MM/yyyy"*/}
                                        {/*            maxDate={new Date()}*/}
                                        {/*            locale="ru"*/}
                                        {/*            selected={this.state.selectDate}*/}
                                        {/*            startDate={this.state.startDate}*/}
                                        {/*            onChange={this.handleChangeDate}*/}
                                        {/*        />*/}
                                        {/*    </div>*/}
                                        {/*</div>*/}
                                    </div>
                                    <div className="Checkout_textar">
                                        {
                                            this.state.showTextarea ?
                                                <textarea cols="30" rows="5" placeholder={this.props.uaProp ? "Напишіть коментар" : "Напишите комментарий"}
                                                          value={this.state.contactPeopleInfo.comment}
                                                          name={'comment'}
                                                          onChange={this.handleInput}
                                                />
                                                :
                                                <div className="Checkout_show-text m-w" onClick={() => this.setState({showTextarea: true})}>{this.props.uaProp ? "Коментар" : "Комментарий"}</div>
                                        }
                                    </div>
                                    <div className="Checkout_point_promo">
                                        <div className="Checkout_point_promo_line">
                                            <div className="h7">{this.props.uaProp ? "У мене є промокод" : "У меня есть промокод"}</div>
                                            <div className={"Form_promo_point_input "+this.state.promoClass}>
                                                <div className="error-text">{this.props.uaProp ? "Невірний формат промокоду" : "Неправильный формат промокода"}</div>
                                                <div className="Form_promo_point_input_icon">
                                                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M14.3964 9.14783H14.9816V5.63651H13.4893C12.8439 5.63651 12.3189 5.11146 12.3189 4.46607C12.3189 4.02814 12.5607 3.63018 12.95 3.42741L13.4485 3.16781L11.9583 0L0.0137109 5.63391L0.0149414 5.63651H0V9.14783H0.585234C1.23062 9.14783 1.75567 9.67289 1.75567 10.3183C1.75567 10.9637 1.23062 11.4887 0.585234 11.4887H0V15H14.9816V11.4887H14.3964C13.751 11.4887 13.2259 10.9636 13.2259 10.3182C13.2259 9.67289 13.751 9.14783 14.3964 9.14783ZM7.96374 3.17824C8.10583 3.4604 8.44729 3.57999 8.73492 3.4447C9.02291 3.30923 9.14851 2.96924 9.02092 2.67961L11.3979 1.55845L11.94 2.71084C11.442 3.14915 11.1484 3.78328 11.1484 4.4661C11.1484 4.89231 11.2635 5.29192 11.4633 5.63654H2.75186L7.96374 3.17824ZM13.8111 12.5851V13.8296H11.1777C11.1777 13.5064 10.9157 13.2444 10.5925 13.2444C10.2693 13.2444 10.0073 13.5064 10.0073 13.8296H1.17044V12.5851C2.17896 12.3246 2.92608 11.407 2.92608 10.3182C2.92608 9.22948 2.17893 8.3119 1.17044 8.05143V6.80692H10.0072C10.0072 7.13013 10.2692 7.39213 10.5924 7.39213C10.9156 7.39213 11.1776 7.13013 11.1776 6.80692H13.8111V8.05143C12.8026 8.31193 12.0555 9.22948 12.0555 10.3182C12.0555 11.407 12.8026 12.3246 13.8111 12.5851Z" fill="#454545"/>
                                                    </svg>
                                                </div>
                                                <input type="text"
                                                       autoComplete="off"
                                                       name={'promocode'}
                                                       onChange={this.handleInput}
                                                       readOnly={this.state.promoStatus}
                                                       value={this.state.contactPeopleInfo.promocode}
                                                />
                                                <div className="Form_promo_point_input_button" onClick={() => this.handlePromoSubmit()}>{this.props.uaProp ? "Застосувати" : "Применить"}</div>
                                                <div className="Form_promo_point_input_button_clear" onClick={() => this.handlePromoClear()}>{this.props.uaProp ? "Очистити" : "Очистить"}</div>
                                                <div className="Form_promo_point_input_ok">
                                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#3DB39E"/>
                                                        <path d="M14.7 3.63745L7.625 10.9625L7.6375 11.75H7.96251L15.6251 5.57496C15.4 4.88747 15.0875 4.22496 14.7 3.63745Z" fill="#37A18E"/>
                                                        <path d="M15.8501 3.2876L14.4375 1.88758C14.25 1.70007 13.9375 1.70007 13.7375 1.88758L7.69999 8.12511L5.08747 5.55011C4.89996 5.3626 4.58746 5.3626 4.38748 5.55011L3.13746 6.78762C2.94995 6.97513 2.94995 7.28763 3.13746 7.47514L7.3125 11.6126C7.42501 11.7251 7.57501 11.7626 7.725 11.7501C7.875 11.7626 8.025 11.7251 8.13751 11.6126L15.8501 3.98759C16.0376 3.78757 16.0376 3.47508 15.8501 3.2876Z" fill="#F2F1EF"/>
                                                        <path d="M8.1377 11.6126L15.8502 3.98753C16.0378 3.80002 16.0378 3.48752 15.8502 3.30001L15.6252 3.08752L7.71269 10.8626L3.33767 6.60005L3.15015 6.78756C2.96264 6.97507 2.96264 7.28757 3.15015 7.47508L7.32519 11.6126C7.43771 11.7251 7.5877 11.7626 7.7377 11.7501C7.87519 11.7626 8.02519 11.7251 8.1377 11.6126Z" fill="#E6E5E3"/>
                                                    </svg>

                                                </div>
                                            </div>
                                            {
                                                this.state.promoClass.length > 0 ?
                                                    <>
                                                        <div className="h7">{this.props.uaProp ? "Знижка по промокодом" : "Скидка по промокоду"}:</div>
                                                        <div className="Checkout_point_promo_line_price w-b">0 <span className="h7">грн</span></div>
                                                    </>
                                                    : null
                                            }

                                        </div>
                                        <div className="Checkout_point_promo_line last">
                                            <div className="h5 w-b">{this.props.uaProp ? "Всього" : "Итого"}:</div>
                                            <div className="Checkout_point_promo_line_price w-b h5">{
                                                this.props.info.promotion.new_price && this.props.info.promotion.new_price > 0 ?
                                                    <>
                                                        {
                                                            this.props.info.promotion.new_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')
                                                        }<span className="h7"> грн</span>
                                                    </>
                                                 : this.props.uaProp ? "Безкоштово" : "Бесплатно"
                                            } </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="Checkout_rule">
                                    <div className="radio">
                                        <div className={`radio_check ${this.state.rulesAccept ? 'active' : ''}`}
                                             onClick={
                                                 () => this.setState(prevState => ({
                                                     rulesAccept: !prevState.rulesAccept
                                                 }))
                                             }
                                        ><svg width="8" height="6" viewBox="0 0 8 6" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M3.62128 5.72634C3.25857 6.09122 2.67005 6.09122 2.30752 5.72634L0.272029 3.67868C-0.0906764 3.31398 -0.0906764 2.72194 0.272029 2.35724C0.634559 1.99237 1.22308 1.99237 1.58579 2.35724L2.79854 3.57707C2.89009 3.669 3.03871 3.669 3.13043 3.57707L6.41421 0.273656C6.77674 -0.0912186 7.36527 -0.0912186 7.72797 0.273656C7.90215 0.448873 8 0.686605 8 0.934374C8 1.18214 7.90215 1.41988 7.72797 1.59509L3.62128 5.72634Z" fill="white"/></svg></div>

                                            {this.props.uaProp ?
                                                <label className="radio-label">Відправляючи заявку, ви приймаєте <a target="_blank" rel="noreferrer noopener" href="https://doc.ua/rules.html">правила роботи сервісу</a></label> :
                                                <label className="radio-label">Отправляя заявку, вы принимаете <a target="_blank" rel="noreferrer noopener" href="https://doc.ua/rules.html">правила работы сервиса</a></label>
                                            }

                                    </div>

                                </div>
                                <div className="Checkout_submit_cnt">
                                    {
                                        this.state.loading
                                            ? <div className='sk-circle-bounce'>
                                                <div className='sk-child sk-circle-1'/>
                                                <div className='sk-child sk-circle-2'/>
                                                <div className='sk-child sk-circle-3'/>
                                                <div className='sk-child sk-circle-4'/>
                                                <div className='sk-child sk-circle-5'/>
                                                <div className='sk-child sk-circle-6'/>
                                                <div className='sk-child sk-circle-7'/>
                                                <div className='sk-child sk-circle-8'/>
                                                <div className='sk-child sk-circle-9'/>
                                                <div className='sk-child sk-circle-10'/>
                                                <div className='sk-child sk-circle-11'/>
                                                <div className='sk-child sk-circle-12'/>
                                            </div>
                                            :
                                            <>
                                                <div className="PromoCard_clinics_slider_card_price_mob">
                                                    {
                                                        this.props.info.promotion.new_price && this.props.info.promotion.old_price > 0 ? <div className="PromoCard_clinics_slider_card_price_other">
                                                            <div className="PromoCard_clinics_slider_card_price_old">{this.props.info.promotion.old_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')}</div>
                                                        </div> : null
                                                    }
                                                    {
                                                        this.props.info.promotion.new_price ?
                                                            <div className="PromoCard_clinics_slider_card_price_main">{this.props.info.promotion.new_price.toString().replace(/(\d)(?=(\d{3})+$)/g, '$1 ')} <span>грн</span></div>
                                                            : <div className="h5">{this.props.uaProp ? "Безкоштово" : "Бесплатно"}</div>
                                                    }
                                                </div>
                                                <button className="Checkout_submit" onClick={this.handleFormSubmit} disabled={!this.state.rulesAccept}>{this.props.uaProp ? "Відправити заявку" : "Отправить заявку"}</button>
                                            </>
                                    }
                                </div>
                            </div>
                        </div>
                }
                {
                    this.state.thankyouPage ? <Redirect
                        to={{
                            pathname: "/thankyou",
                        }}

                    /> : null
                }

            </section>

        );
    }
}



function mapStateToProps(state) {
    return {
        info: state.mainPageReducer.info,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchJsonById: id  => dispatch(fetchJsonById(id)),
        // fetchJsonByAlias: alias => dispatch(fetchJsonByAlias(alias))
    }
}

export default withRouter(connect(mapStateToProps, mapDispatchToProps)( Checkout))
// export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(Single))

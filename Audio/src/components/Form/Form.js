import React, { Component } from 'react'
import './Form.scss'
import request from 'superagent';
import {NavLink, Redirect} from 'react-router-dom'
import img from "../../img/emptyslider.svg"
// import docImage from "../../img/doc-line.jpg";
// import InputMask from 'react-input-mask';
import Headerform from '../../components/Header/Header-form'
import TextareaAutosize from "react-textarea-autosize";
import 'react-phone-number-input/style.css'
import PhoneInput, {  isValidPhoneNumber} from 'react-phone-number-input'
import {scroller} from "react-scroll";
import {Helmet} from "react-helmet";

const linkStart = "https://doc.ua";
// const linkStart = "";

class Form extends Component{
    state = {
        menu: false,
        dataJson: undefined,
        contactPeopleInfo: {
            name: '',
            phone: '',
            text: '',
            problems: [],
            promocode: ''
        },
        phone: '',
        validPhone: true,
        textMessenger:["Телефон","Viber","Telegram","WhatsApp"],
        selectMessenger: 0,
        promoClass: '',
        promoDone: undefined,
        promoStatus: false,
        orderSuccess: false,
        orderID: undefined,
        attrInputPromo: '',
        price: 0,
        headerRend: 0,
        idDoctor: parseInt(this.props.location.pathname.replace(/\D+/g,"")),
        // price: this.props.location.state.price,
        timerPage: undefined,
        lang: "ru",
        // lang: this.props.location.state.lang,
        form: {
            slideActives: [],
            inputs: {
                name: ""
            }
        },
        files: [],
        loading: false
    }

    constructor(props) {
        super(props);
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handlePromoSubmit = this.handlePromoSubmit.bind(this);
        // this.handleClearForm = this.handleClearForm.bind(this);
        this.handleInput = this.handleInput.bind(this);
        this.handleInputPhone = this.handleInputPhone.bind(this);
        this.handleClick = this.handleClick.bind(this);
        this.handlePromoClear = this.handlePromoClear.bind(this);
        this.toggleMenuHandler = this.toggleMenuHandler.bind(this);
        this.menuCloseHandler = this.menuCloseHandler.bind(this);
        // this.onFormSubmit = this.onFormSubmit.bind(this)
        this.onChange = this.onChange.bind(this)
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        this.getCookie('Webview');
        this.getCookie('lang');
        // s.onload = () => document.getElementById('pgButton').click()
    }

    toggleMenuHandler = () => {
        this.setState({
            menu: !this.state.menu
        })
    }
    menuCloseHandler = () => {
        this.setState({
            menu: false
        })
    }
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"
        ));
        if(matches) {
            if (name === 'Webview') {
                this.setState({
                    headerRend: parseInt(decodeURIComponent(matches[1]))
                })
            } else {
                this.setState({
                    lang: this.props.domainName === 'audio.doc.online' ? 'ru' : decodeURIComponent(matches[1])
                }, function () {
                    this.jsonDoctors(this.state.lang)
                })
            }
        } else {
            this.jsonDoctors(this.state.lang)
        }
    }
    jsonDoctors (lang) {
        request
            .get(`${linkStart}/doc-audio${this.props.domainName === 'audio.doc.online' ? '/inter' : ''}/doctors?specialties=&sorting=popularity&direction=DESC&page=1&per_page=10`)
            .set('X-App-Lang', lang)
            // .get('http://localhost:3000/all-doc.json')
            .then(response => {
                this.setState({
                    dataJson: response.body.doctors.find(doc => doc.id === this.state.idDoctor),
                    price: response.body.doctors.find(doc => doc.id === this.state.idDoctor).price[0].price
                    // tempSpecialties: response.body.specialties.slice(0, 4)
                });
            })
            .catch(err => {
                console.log("Error doctors" + err)
            })
    }
    handleFormSubmit(e) {
        e.preventDefault();
        if (isValidPhoneNumber(this.state.phone)) {
            let allproblems = this.state.contactPeopleInfo.problems.join(',');
            this.setState({
                loading: true
            })
            request

                .post(`${linkStart}/doc-audio${this.props.domainName === 'audio.doc.online' ? '/inter' : ''}/create/order`)
                // .set('Content-Type', 'multipart/form-data')
                .field('attachments',this.state.files)
                .field('name',this.state.contactPeopleInfo.name)
                .field('phone',this.state.phone)
                .field('text', this.state.contactPeopleInfo.text)
                .field('promocode',this.state.promoStatus ? this.state.contactPeopleInfo.promocode.trim() : "")
                .field('messenger',this.state.textMessenger[this.state.selectMessenger])
                .field('problems',allproblems)
                .field('price',this.state.dataJson.price[0].price)
                .field('doctorid', this.state.dataJson.id)
                .field('duration',this.state.dataJson.price[0].duration)
                .field('source_id', this.state.headerRend === 1 ? '3' : this.state.idDoctor === 32168 ? '4' : '2')
                .then(res => {
                    // console.log("Successful" + res.JSON);
                    // const rawBody = res.text;
                    // console.log(rawBody);
                    if(res.status===200){
                        let r=JSON.parse(res.text);
                        if(r.order_id!==undefined){
                            this.setState({
                                orderSuccess: true,
                                orderID: r.order_id
                            }, function () {
                                if (this.state.price === 0 ){
                                    this.setState({
                                        timerPage: true
                                    })
                                } else {
                                    document.forms["portmoneSubmit"].submit();
                                }
                            });

                            // request
                            // .post(linkStart+"/go/portmone/getlink")
                            // .send({
                            //     "methodID": 1,
                            //     "orderID": this.state.orderID
                            // })
                            // .then(res=>{
                            //     var rs=JSON.parse(res.text);
                            //     // console.log("rs.payment_page")
                            //     // console.log(typeof rs.payment_page)
                            //     // console.log(rs.payment_page)
                            //
                            //     this.setState({
                            //         PaymentPage: rs.payment_page
                            //     });
                            //     // alert(this.state.PaymentPage)
                            // }).catch(err => {
                            //     console.log(err)
                            // });
                        }
                    }
                    // this.handleClearForm();
                })
                .catch(err => {
                    console.log("Error " + err)
                    this.setState({
                        loading: false
                    })
                });
        }  else {
            this.setState({
                validPhone: false
            }, function () {
                scroller.scrollTo('phoneInp', {
                    duration: 500,
                    smooth: true,
                    offset: -100,
                });
            })
        }

    }
    handlePromoSubmit(e) {
        e.preventDefault();
        request
            // .post('/go/promocode')
            .post(linkStart+'/doc-audio/promocode/discount')
            .send({
                doctor_id: this.state.dataJson.id,
                promocode: this.state.contactPeopleInfo.promocode.trim(),
                order_price: this.state.dataJson.price[0].price
            })
            .then(req => {
                console.log(req.body.discount);
                // let priceTemp = this.state.price - res.body.value;
                this.setState({
                        price: this.state.price - req.body.discount > 0 ? this.state.price - req.body.discount : 0,
                        promoDone: req.body.status,
                        promoStatus: req.body.status,
                        promoClass: req.body.status === true ? 'active' : 'error',
                    }
                )
            })
            .catch(err => {
                this.setState({
                        promoDone: false,
                        promoStatus: false,
                        promoClass: 'error'
                    }
                )
            });
    }
    handlePromoClear() {

        this.setState( prevState => {
                return {
                    contactPeopleInfo: {...prevState.contactPeopleInfo, promocode: ''},
                    promoClass: ' '
                }
            }
            // , () => console.log(this.state.contactPeopleInfo)
        )
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
        if (name === 'promocode') {
            this.setState({
                promoClass: ''
            })
        }

    }
    handleInputPhone(e) {
        // let name = e.target.name;
            this.setState({
                    phone:  !e ? '' : e,
                    validPhone: true
            })


    }
    writeProblems(text) {
        if (this.state.contactPeopleInfo.problems.indexOf(text) === -1) {
            this.state.contactPeopleInfo.problems.push(text)
        }

    }
    handleClick = (event) => {
        const newSelection = event.target.attributes.getNamedItem('data-value').value;

        let newSelectionArray;
        // console.log(newSelection);

        if (this.state.contactPeopleInfo.problems.indexOf(newSelection) > -1) {
            newSelectionArray = this.state.contactPeopleInfo.problems.filter(
                s => s !== newSelection
            );
        } else {
            newSelectionArray = [...this.state.contactPeopleInfo.problems, newSelection];
        }

        this.setState(prevState => ({
            contactPeopleInfo: { ...prevState.contactPeopleInfo, problems: newSelectionArray }
            })
        );
        event.currentTarget.classList.toggle("active")
    }
    onChange(e) {
        this.setState({
            files: this.state.files.concat(Array.from(e.target.files))
        }, function () {
            console.log(this.state.files)
        })
    }
    removeFile(numb) {
        // let temp = this.state.files.splice(1, 1)
        // this.setState({
        //     files: temp
        // })
        this.setState({
            files: this.state.files.filter((_, i) => i !== numb)
        });

    }
    handleSelectMessenger(index) {
        this.setState({
            selectMessenger: index
        })
    }
    render() {

        return (
            <React.Fragment>
                <Helmet>
                    <meta name="robots" content="noindex" />
                </Helmet>
                {
                    this.state.headerRend === 1 ? null
                        :
                        <Headerform
                            onToggle={this.toggleMenuHandler}
                            isOpen={this.state.menu}
                            lang={this.state.lang}
                            domainName={this.props.domainName}
                        />
                }
                {
                    !this.state.dataJson ? null
                        :
                        <div className={'Form'} id="form-ord">
                            <form method="post" onSubmit={this.handleFormSubmit} className="formConsultAudio ">
                                <div className="container">
                                    <h1 className={'caption'}>{this.state.lang === 'ru' ? 'Запись на онлайн-консультацию' : 'Запис на онлайн-консультацію'} </h1>
                                    <div className="doc-line">
                                        <img src={this.state.dataJson.img} alt="ava" className="doc-line_img"/>
                                        <div className="doc-line_info">
                                            <div className="doc-line_info_name">{this.state.dataJson.name} {this.state.dataJson.nameOther}</div>
                                            <div className="doc-line_info_pos">
                                                <b>{this.state.dataJson.specialties.map(ittem => ittem.name).join(', ')}</b>
                                                {
                                                    this.state.idDoctor === 32168 ? null
                                                        :
                                                        this.state.dataJson.category_name
                                                }
                                            </div>
                                        </div>
                                        <div className="doc-line_price">
                                            <span>{this.state.lang === 'ru' ? "Цена" : "Цiна"}: </span> <div className="big green"> {this.state.dataJson.price[0].price}</div><span className="green"> {this.props.domainName === 'audio.doc.online' ? '$': 'грн'}</span> / <div className="big">{this.state.dataJson.price[0].duration}</div> <span>{this.state.lang === 'ru' ? ' мин': ' хв'}</span>
                                        </div>
                                        <NavLink to={`${this.props.domainName === 'audio.doc.online' ? "/": "/audio"}`} className="doc-line_cancel">{this.state.lang === 'ru' ? 'Отменить': 'Скасувати'} <span className={"doc-line_cancel_icon"}></span></NavLink>
                                    </div>

                                    <h3 className={'Form_caption f-w-m'}>{this.state.lang === 'ru' ? 'Контактные данные': 'Контактні дані'}</h3>
                                    <div className="Form_container">
                                        <div className="Form_wrap_inputs">
                                            <div className="Form_wrap_inputs_point first">
                                                <div className="Form_wrap_inputs_point_label">{this.state.lang === 'ru' ? 'Имя' : 'Ім\'я'}</div>
                                                <div className="Form_wrap_inputs_point_input">
                                                    <input
                                                        type="text"
                                                        name={'name'}
                                                        value={this.state.contactPeopleInfo.name}
                                                        onChange={this.handleInput}
                                                    />
                                                </div>
                                            </div>
                                            {/*<InputMask type="tel" mask="+99 (999) 999 - 99 - 99" maskChar="_" placeholder={'+__ (___)  ___  -  __  -  __'} required*/}
                                            {/*name={"phone"}*/}
                                            {/*min="7"*/}
                                            {/*value={this.state.contactPeopleInfo.phone}*/}
                                            {/*onChange={this.handleInput}*/}
                                            {/*/>*/}
                                            <div className="Form_wrap_inputs_point">
                                                <div className="Form_wrap_inputs_point_label">{this.state.lang === 'ru' ? "Ваш телефон" : "Телефон"}</div>
                                                <div className={`PhoneInputWrp ${this.state.validPhone ? '' : "err"}`}>
                                                    <PhoneInput
                                                        displayInitialValueAsLocalNumber
                                                        international
                                                        id={'phoneInp'}
                                                        name={"phone"}
                                                        value={this.state.phone}
                                                        onChange={this.handleInputPhone}
                                                        defaultCountry="UA"
                                                        maxLength={18}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Form_messenger">
                                                {/*{*/}
                                                {/*    this.state.idDoctor === 32168 ?*/}
                                                {/*        null*/}
                                                {/*        :*/}
                                                {/*        <>*/}
                                                {/*            <div className="Form_messenger_cap">{this.state.lang === 'ru' ? 'Выберите удобный для Вас канал связи' : 'Виберіть зручний для вас канал зв\'язку'}:</div>*/}
                                                {/*            <div className="Form_messenger_cnt">*/}
                                                {/*                {*/}
                                                {/*                    this.state.textMessenger.map((text, index) => {*/}
                                                {/*                        return (*/}
                                                {/*                            <div*/}
                                                {/*                                className={this.state.selectMessenger === index ? "Form_messenger_point active" : "Form_messenger_point"}*/}
                                                {/*                                onClick={() => this.handleSelectMessenger(index)}*/}
                                                {/*                                key={index}>*/}
                                                {/*                                <div*/}
                                                {/*                                    className="doctor_point_order_price_check"/>*/}
                                                {/*                                {text}</div>*/}
                                                {/*                        )*/}
                                                {/*                    })*/}
                                                {/*                }*/}
                                                {/*            </div>*/}
                                                {/*        </>*/}
                                                {/*}*/}
                                        </div>
                                        <div className="Form_promo">
                                            <div className="Form_promo_point">
                                                <div>{this.state.lang === 'ru' ? 'Введите промокод':'Введіть промокод'}</div>
                                                <div className={"Form_promo_point_input "+this.state.promoClass}>
                                                    <div className="error-text">{this.state.lang === 'ru' ? 'Неправильный формат промокода' : 'Неправильний формат промокоду'}</div>
                                                    <div className="Form_promo_point_input_icon">
                                                        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M14.3964 9.14783H14.9816V5.63651H13.4893C12.8439 5.63651 12.3189 5.11146 12.3189 4.46607C12.3189 4.02814 12.5607 3.63018 12.95 3.42741L13.4485 3.16781L11.9583 0L0.0137109 5.63391L0.0149414 5.63651H0V9.14783H0.585234C1.23062 9.14783 1.75567 9.67289 1.75567 10.3183C1.75567 10.9637 1.23062 11.4887 0.585234 11.4887H0V15H14.9816V11.4887H14.3964C13.751 11.4887 13.2259 10.9636 13.2259 10.3182C13.2259 9.67289 13.751 9.14783 14.3964 9.14783ZM7.96374 3.17824C8.10583 3.4604 8.44729 3.57999 8.73492 3.4447C9.02291 3.30923 9.14851 2.96924 9.02092 2.67961L11.3979 1.55845L11.94 2.71084C11.442 3.14915 11.1484 3.78328 11.1484 4.4661C11.1484 4.89231 11.2635 5.29192 11.4633 5.63654H2.75186L7.96374 3.17824ZM13.8111 12.5851V13.8296H11.1777C11.1777 13.5064 10.9157 13.2444 10.5925 13.2444C10.2693 13.2444 10.0073 13.5064 10.0073 13.8296H1.17044V12.5851C2.17896 12.3246 2.92608 11.407 2.92608 10.3182C2.92608 9.22948 2.17893 8.3119 1.17044 8.05143V6.80692H10.0072C10.0072 7.13013 10.2692 7.39213 10.5924 7.39213C10.9156 7.39213 11.1776 7.13013 11.1776 6.80692H13.8111V8.05143C12.8026 8.31193 12.0555 9.22948 12.0555 10.3182C12.0555 11.407 12.8026 12.3246 13.8111 12.5851Z" fill="#454545"/>
                                                        </svg>
                                                    </div>
                                                    <input type="text"
                                                           name={'promocode'}
                                                           value={this.state.contactPeopleInfo.promocode}
                                                           onChange={this.handleInput}
                                                           readOnly={this.state.promoStatus}
                                                           autoComplete="off"
                                                    />
                                                    <div className="Form_promo_point_input_button" onClick={this.handlePromoSubmit}>{this.state.lang === 'ru' ? 'Применить' : 'Застосувати'}</div>
                                                    <div className="Form_promo_point_input_button_clear" onClick={this.handlePromoClear}>{this.state.lang === 'ru' ? 'Очистить' : 'Очистити'}</div>
                                                    <div className="Form_promo_point_input_ok">
                                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <path d="M8 16C12.4183 16 16 12.4183 16 8C16 3.58172 12.4183 0 8 0C3.58172 0 0 3.58172 0 8C0 12.4183 3.58172 16 8 16Z" fill="#3DB39E"/>
                                                            <path d="M14.7 3.63745L7.625 10.9625L7.6375 11.75H7.96251L15.6251 5.57496C15.4 4.88747 15.0875 4.22496 14.7 3.63745Z" fill="#37A18E"/>
                                                            <path d="M15.8501 3.2876L14.4375 1.88758C14.25 1.70007 13.9375 1.70007 13.7375 1.88758L7.69999 8.12511L5.08747 5.55011C4.89996 5.3626 4.58746 5.3626 4.38748 5.55011L3.13746 6.78762C2.94995 6.97513 2.94995 7.28763 3.13746 7.47514L7.3125 11.6126C7.42501 11.7251 7.57501 11.7626 7.725 11.7501C7.875 11.7626 8.025 11.7251 8.13751 11.6126L15.8501 3.98759C16.0376 3.78757 16.0376 3.47508 15.8501 3.2876Z" fill="#F2F1EF"/>
                                                            <path d="M8.1377 11.6126L15.8502 3.98753C16.0378 3.80002 16.0378 3.48752 15.8502 3.30001L15.6252 3.08752L7.71269 10.8626L3.33767 6.60005L3.15015 6.78756C2.96264 6.97507 2.96264 7.28757 3.15015 7.47508L7.32519 11.6126C7.43771 11.7251 7.5877 11.7626 7.7377 11.7501C7.87519 11.7626 8.02519 11.7251 8.1377 11.6126Z" fill="#E6E5E3"/>
                                                        </svg>

                                                    </div>
                                                </div>
                                            </div>
                                            <div className="Form_promo_point">
                                                <div>{this.state.lang === 'ru' ? 'Цена с промокодом' : 'Ціна з промокодом'}</div>
                                                <div className="doc-line_price">
                                                    <div className="big green">{this.state.price}</div>
                                                    <span className="green"> {this.props.domainName === 'audio.doc.online' ? '$': 'грн'}</span> / <div className="big">{this.state.dataJson.price[0].duration}</div> <span>{this.state.lang === 'ru' ? ' мин' : ' хв'}</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="Form_text-ar">
                                            <div className="Form_wrap_inputs_point_label">{this.state.lang === 'ru' ? 'Коротко опишите проблемную ситуацию' : 'Коротко опишіть проблемну ситуацію'}</div>
                                            <div className="Form_text-ar_wrap">
                                                <TextareaAutosize
                                                    style={{maxHeight: 180, minHeight: 150}}
                                                    onChange={this.handleInput}
                                                    name="text"
                                                    // defaultValue={this.state.contactPeopleInfo.text}
                                                    // value={this.state.contactPeopleInfo.text}
                                                />
                                                <div className="Form_text-ar_files">
                                                    <div className="Form_text-ar_files_cnt">
                                                        {
                                                            this.state.files.length < 1 && this.state.files ? null
                                                                :
                                                                this.state.files.map((file, index) => {
                                                                    return (
                                                                        <div className="Form_text-ar_files_point" key={index}><span className="f-w-m">{file.name}</span> <span className="Form_text-ar_files_point_size">({Math.ceil(file.size/1000)} Kb)</span>
                                                                            <span className="doc-line_cancel_icon" onClick={()=> this.removeFile(index)}></span>
                                                                        </div>
                                                                    )
                                                                })


                                                        }
                                                    </div>
                                                    <input type="file" id={"input-file"} accept="image/*, .doc, .docx, .tiff, .pdf" value="" onChange={this.onChange} multiple/>
                                                    <label htmlFor="input-file">
                                                        <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                            <circle cx="16" cy="16" r="16" />
                                                            <path d="M24.0101 8.77752C23.3504 8.11043 22.5553 7.76347 21.708 7.77458C20.9153 7.78485 20.1374 8.12171 19.5178 8.72313L19.512 8.72879L11.4691 16.906C10.6643 17.7192 10.6641 18.8998 11.4686 19.7132C11.8587 20.1076 12.3563 20.3248 12.8699 20.3248C12.87 20.3248 12.8701 20.3248 12.8702 20.3248C13.39 20.3248 13.8909 20.1076 14.2831 19.7108L19.8421 14.0316L18.8371 13.048L13.2806 18.7247C13.157 18.8497 13.0112 18.9186 12.87 18.9186C12.731 18.9186 12.5959 18.8533 12.4684 18.7244C12.0983 18.3501 12.3452 18.0197 12.4701 17.8936L20.5027 9.72691C21.2704 8.98638 22.2539 9.00157 23.0103 9.76639C23.9078 10.6739 23.6574 11.7393 23.0109 12.3925L13.8677 21.8355C13.2394 22.4699 12.4445 22.8193 11.629 22.8194C11.6289 22.8194 11.6287 22.8194 11.6286 22.8194C10.8134 22.8194 10.0401 22.4732 9.39221 21.8181C7.87568 20.2848 8.29924 18.4839 9.392 17.3788L16.3212 10.4512L15.3269 9.45677L8.39624 16.3859L8.3936 16.3886C7.5245 17.2668 7.03006 18.3743 7.00138 19.5069C6.97075 20.7147 7.45176 21.8558 8.39244 22.807C9.29729 23.7219 10.4465 24.2257 11.6287 24.2257C11.6289 24.2257 11.6292 24.2257 11.6293 24.2256C12.8244 24.2255 13.9754 23.7268 14.8702 22.8216L24.0134 13.3786C25.33 12.0453 25.3289 10.1109 24.0101 8.77752Z" />
                                                            <defs>
                                                                <rect x="7" y="7" width="18" height="18" fill="white"/>
                                                            </defs>
                                                        </svg>
                                                    </label>
                                                </div>

                                            </div>
                                            {/*<textarea name="text" id="" cols="30" rows="10" placeholder={'Коротко опишите проблемную ситуацию'}*/}
                                            {/*          */}
                                            {/*/>*/}



                                            <div className="Form_text-ar_text">
                                                {this.state.lang === 'ru' ? 'Это позволит Вам сэкономить время на проведении консультации и назначения рекомендаций врачом' : 'Це дозволить вам заощадити час на проведення консультації і призначення рекомендацій лікарем'}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="Form_links">
                                        <div className="Form_links_text">
                                            {this.state.lang === 'ru' ? 'Нажимая на кнопку «Заказать», Вы принимаете' : 'Натискаючи на кнопку «Замовити», ви приймаєте'} <br/><a target="_blank" rel="noreferrer noopener" href="/privacy-policy.pdf" >{this.state.lang === 'ru' ? 'Политика конфиденциальности' : 'Політика конфіденційності' }</a>   <a target="_blank" rel="noreferrer noopener" href="/public-contract.pdf" >{this.state.lang === 'ru' ? 'Публичный договор' : 'Публічний договір'}</a>
                                        </div>
                                    </div>
                                    <div className="Form_orde">
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
                                                : <input type="submit" className="Form_orde_button"  value={this.state.lang === 'ru' ? "Заказать" : "Замовити"} />
                                        }


                                    </div>
                                </div>
                            </form>
                            {
                                this.state.orderID ?
                                    <form action="https://www.portmone.com.ua/gateway/" method="post" id="portmoneSubmit" style={{"opacity": "0", "height":"1px", "width":"1px"}}>
                                        <input type="hidden" name="bodyRequest"
                                               value={
                                                   `{
                                     "paymentTypes":{
                                              "card":"Y",
                                              "privat":"Y",
                                              "masterpass":"Y",
                                              "visacheckout":"Y",
                                              "portmone":"Y",
                                              "qr":"Y",
                                              "gpay":"Y",
                                              "applepay":"Y"
                                            },
                                            "priorityPaymentTypes":{
                                              "card":"1",
                                              "privat":"2",
                                              "masterpass":"3",
                                              "visacheckout":"4",
                                              "portmone":"5",
                                              "qr":"6",
                                              "gpay":"7",
                                              "applepay":"8"
                                            },
                                      "payee":
                                              {
                                                "payeeId":"${process.env.REACT_APP_PORTMONE_PAYEEID}",
                                                "login":"${process.env.REACT_APP_PORTMONE_LOGIN}",
                                                "dt":"",
                                                "signature":"",
                                                "shopSiteId":""
                                              },
                                      "order":
                                              {
                                                "description": "Оплата згідно замовлення №${this.state.orderID + " - " + this.state.dataJson.affiliates + " - " + this.state.dataJson.name + " " + this.state.dataJson.nameOther}",
                                                "shopOrderNumber":"SHP-1-${this.state.orderID}",
                                                "billAmount":"${this.state.price}",
                                                "attribute1":"${this.state.orderID}",
                                                "attribute2":"${this.state.dataJson.name + " " + this.state.dataJson.nameOther}",
                                                "attribute3":"${this.state.dataJson.affiliates}",
                                                "attribute4":"${this.state.phone}",
                                                "successUrl": "${this.props.domainName === 'audio.doc.online' ? "https://audio.doc.online/doc-audio/inter/order/" : process.env.REACT_APP_PORTMONE_SUCCESS_URL}${this.state.orderID}/payment/check",
                                                "failureUrl":"",
                                                "preauthFlag": "N",
                                                "preauthConfirm":"",
                                                "billCurrency":"${this.props.domainName === 'audio.doc.online' ? "USD": "UAH"}",
                                                "expTime":"",
                                                "encoding":""
                                              },
                                      "token":
                                              {
                                                "tokenFlag":"N",
                                                "returnToken":"N",
                                                "token":"",
                                                "cardMask":"",
                                                "otherPaymentMethods":"N"
                                              },
                                      "payer":
                                              {
                                                "lang":"ru",
                                                "emailAddress":"",
                                                "showEmail":"N"
                                              },
                                      "style":
                                              {
                                                "type":"brand",
                                                "logo":"https://doc.ua/audio/static/media/logo_doc_color.516eae46.svg",
                                                "backgroundColorHeader":"",
                                                "backgroundColorButtons":"",
                                                "colorTextAndIcons":"",
                                                "borderColorList":"",
                                                "logoWidth":"",
                                                "logoHeight":"",
                                                "bcMain":""
                                              }
                                    }`
                                               }
                                        />
                                        <input type="hidden" name="typeRequest" value='json'/>
                                        <input type="submit" value="Оплатити через Portmone.com" className="button_green"/>
                                    </form>
                                    : null
                            }

                            {
                                this.state.orderID && this.state.timerPage ? <Redirect
                                    to={{
                                        // pathname: `${this.props.domainName === 'audio.doc.online' ? "": "/audio"}/timer`,
                                        pathname: "/audio/timer",
                                        search: "?order_id=" + this.state.orderID,
                                    }}

                                /> : null
                            }
                        </div>
                }

                {/*<FromAttach/>*/}
            </React.Fragment>
        )
    }
}
export default Form
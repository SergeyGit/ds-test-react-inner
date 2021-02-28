import React, { Component } from 'react'
// import {Link} from 'react-router-dom'
import {Link, Redirect} from 'react-router-dom'
import request from 'superagent';
import './Timer.scss'
import Headerform from '../../components/Header/Header-form'
import timerImg from '../../img/timer-p.png'
import timerImgCancel from '../../img/timer-cancel.png'
// import img from "../../img/emptyslider.svg";

// const linkStart = "http://stage1.r2rx.doc.ua";
const linkStart = "";

class Timer extends Component{

    state = {
        total: 0,
        seconds: 0,
        minutes: 0,
        endDate: 10000,
        notCall: true,
        cashBack: true,
        // endDate: this.props.location.state.date - Date.parse(new Date()),
        // endDate: 1000,
        // total: +this.props.date +1800000,
        // seconds: Math.floor((1800000)/ (1000) % 60),
        // minutes: Math.floor((1800000) / (1000 * 60)),
        order_id: parseInt(this.props.location.search.replace(/[^\d]/g, '')),
        order: undefined,
        // order: {
        //     consultation: {
        //         price: "125"
        //     },
        //     doctor: {
        //         id: 11244
        //     }
        // },
        redirectTrue: false,
        menu: false,
        warningMassege: "",
        linkSell: undefined,
        loading: false,
        returnPrice: 0,
        cardMask: '',
        headerRend: 0,
        lang: 'ru',
        cpaId: undefined,
        aff_sub: undefined
    };
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentDidMount() {
        this.getCookie('Webview');
        this.getCookie('lang');
        window.scrollTo(0, 0);
        window.addEventListener('scroll', this.handleScroll);

        request
            .get(linkStart+'/doc-audio/audio/order/'+parseInt(this.props.location.search.replace(/[^\d]/g, '')))
            // .set('X-App-Lang', this.state.lang)
            .then((res) => {
                this.setState({
                    endDate: res.body.order.date_created*1000 + 1800000 - Date.parse(new Date()),
                    // endDate:  1220 ,
                    order: res.body.order
                },function () {
                    this.sendCpa();
                    // this.timeinterval(this.state.order.doctor.id === 11244 || this.state.order.doctor.id === 16057 || this.state.order.doctor.id === 21472);
                    console.log(process.env.REACT_APP_ENVIRONMENT);
                    let dataLayer = window.dataLayer || [];
                    dataLayer.push({
                        'event': 'transaction',
                        'ecommerce': {
                            'currencyCode': 'UAH',
                            'purchase': {
                                'actionField': {
                                    'id': 'T'+this.state.order_id,
                                    'affiliation': 'health',
                                    'revenue': '0',
                                    'tax':'',
                                    'shipping': '',
                                    'coupon': ''
                                },
                                'products': [{
                                    'name': this.state.order.doctor.name + " " + this.state.order.doctor.name_other,
                                    'id': this.state.order_id,
                                    'price': this.state.order.consultation.price,
                                    'brand': this.state.order.consultation.duration,
                                    'category': this.state.order.doctor.specialties.join(', '),
                                    'variant': this.state.order.patient.symptoms.join(', '),
                                    'quantity': 1,
                                    'coupon': ''
                                },
                                    {
                                        'name': '',
                                        'id': '',
                                        'price': '',
                                        'brand': '',
                                        'category': '',
                                        'variant': '',
                                        'quantity':1
                                    }]
                            }
                        }
                    });

                })

            })

        // this.timerAnimate()
    };
    componentWillUnmount() {
        clearInterval(this.timeinterval);
        window.removeEventListener('scroll', this.handleScroll);
    };
    handleScroll(event) {
        if (window.scrollY <= 20 && this.state.scrollClass === true) {
            this.setState({scrollClass: false});
        }
        else if (window.scrollY > 20 && this.state.scrollClass !== true) {
            this.setState({scrollClass: true});
        }
    }

    sendCpa() {
        if (document.cookie.match(new RegExp("(?:^|; )" + "utm_source".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))) {
            if (document.cookie.match(new RegExp("(?:^|; )" + "aff_sub".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))) {
                if(decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "utm_source".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])
                    ==="salesdoubler") {
                    if (decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "aff_sub".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])
                        !=="undefined") {
                        if (decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "aff_sub".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1]) !== "null") {
                            this.setState({
                                cpaId: +this.state.order.consultation.price <= 49 ? 3762
                                    : +this.state.order.consultation.price > 49 && +this.state.order.consultation.price <= 85  ? 3761
                                        : +this.state.order.consultation.price > 85 && +this.state.order.consultation.price <= 120 ? 3760 : 3758,
                                aff_sub: decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "aff_sub".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])

                            }, function () {
                                request
                                    .get('https://rdr.salesdoubler.com.ua/in/postback/'+this.state.cpaId+'/'+ this.state.aff_sub +'?trans_id='+ this.state.order_id +'&sale_amount='+this.state.order.consultation.price+'&token=bS5zZW1pYnJhdG92QGRvYy51YQ')
                                    .then((res) => {
                                        this.removeCookie('aff_sub')
                                    })
                                    .catch(err => {
                                        console.log("Error cookies send " + err)
                                    })
                            })
                        }
                    }
                }
            } else if(decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "utm_source".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])
                ==="guruleads"){
                if (document.cookie.match(new RegExp("(?:^|; )" + "utm_term".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))) {
                    if (decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "utm_term".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])
                        !=="undefined") {
                        if (decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "utm_term".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1]) !== "null") {
                            this.setState({
                                cpaId: +this.state.order.consultation.price <= 49 ? 49
                                    : +this.state.order.consultation.price > 49 && +this.state.order.consultation.price <= 85  ? 85
                                        : +this.state.order.consultation.price > 85 && +this.state.order.consultation.price <= 120 ? 120 : 'more120',
                                aff_sub: decodeURIComponent(document.cookie.match(new RegExp("(?:^|; )" + "utm_term".replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"))[1])

                            }, function () {
                                request
                                    .get('https://offers.guruleads.ru/postback?clickid='+this.state.aff_sub+'&action_id='+ this.state.order_id +'&goal='+ this.state.cpaId +'&status='+ 1)
                                    .then((res) => {
                                        this.removeCookie('utm_term')
                                    })
                                    .catch(err => {
                                        console.log("Error cookies send " + err)
                                    })
                            })
                        }
                    }
                }

            }

        }

    }
    removeCookie(f) {
        var domain = window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2');
        document.cookie = f + "=" + null + "; domain=."+domain+"; path=/; expires=";
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
                    lang: decodeURIComponent(matches[1])
                })
            }

        }

    }

    timerAnimate = () => {
        const time = (1800000/1000);
        let initialOffset = '440';
        let endDate = this.state.endDate > 0 ? this.state.endDate/1000 : 0;
        let tempVar = (1800 - endDate);
        let nowNumb = 440-((440 * tempVar / time));
        let i = 1;
        let temp = 1000;

        /* Need initial run as interval hasn't yet occured... */
        document.querySelector('.circle_animation')
            .setAttribute('style',
                'stroke-dashoffset: ' + (nowNumb) + ";");

        const interval = setInterval(function() {
            temp = nowNumb-((i+1)*(initialOffset /time));

            if (i === endDate || i >  endDate) {
                clearInterval(interval);
                temp= 0;
                document.querySelector('.tor-pulsate').setAttribute('style',
                    '-webkit-animation-play-state: paused; animation-play-state: paused');
                document.querySelector('.Timer').classList.add('end');


            } else {
                if (temp < 0) {
                    temp= 0;
                }
                try {
                    document.querySelector('.circle_animation').setAttribute('style',
                        'stroke-dashoffset: ' + (temp) + ";" );
                } catch(e) {
                    console.log(e);
                    clearInterval(interval);
                }

                i++;
            }
        }, 1000);
    };

    newText(text) {
        this.setState({
            warningMassege: text
        })
    }
    timeinterval = (bool) => {
        setInterval(this.updateClock, 1000);
        if (bool) {
            this.timerAnimate();
        }

    };

    timerInitialize = () => {
        this.setState(prevState => {
            return {
                endDate: (prevState.endDate - 1000),
                // total: (prevState.total - 1000),
                seconds: Math.floor((prevState.endDate - 1000)/ (1000) % 60),
                minutes: Math.floor((prevState.endDate - 1000) / (1000 * 60))
            }
        });
    };

    updateClock = () => {
        this.timerInitialize();
        if (this.state.endDate <= 0) {
            clearInterval(this.timeinterval);
            this.setState({
                total: 0,
                seconds: 0,
                minutes: 0,
                hours:0,
                days:0
            })
        }
    };



    toogleClass = () => {
        document.querySelector('.Timer').classList.toggle("alert")
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

    handleCashback() {
        this.setState({
            loading: true
        })
        request
            .post(linkStart + "/doc-audio/portmone/order/return")
            .send("order_id=" + this.state.order_id)
            .then((res) => {
                let r = JSON.parse(res.text);
                console.log(r);
                if (r.status === true) {
                    this.setState({
                        returnPrice: r.return_amount,
                        cardMask: r.card_mask
                    })
                    if (process.env.REACT_APP_ENVIRONMENT === "production" && window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2') !== 'audio.doc.online') {
                        if (this.state.order.doctor.id === 11244 || this.state.order.doctor.id === 16057 || this.state.order.doctor.id === 21472) {
                            request
                                .post("https://doc.ua/api/sendemail")
                                .set('Content-Type', 'application/json')
                                .send({
                                    "token": "5twQwe12Nid0l",
                                    // "email": "info@doc.ua, doc@lic.kiev.ua, i.kovalenko@doc.ua",
                                    "email": process.env.REACT_APP_EMAIL_NOTIFICATIONS + "," + process.env.REACT_APP_EMAIL_NOTIFICATIONS_ADDITIONAL,
                                    "category": "audio",
                                    "subject": "Паціент скасував візит дзвінок не потрібен",
                                    "type": "cancel",
                                    "order_id": this.state.order_id,
                                    "doctor_id": this.state.order.doctor.id,
                                    "fio": this.state.order.patient.name,
                                    "phone": this.state.order.patient.phone,
                                    "price": this.state.order.consultation.price,
                                    "reason": this.state.order.patient.symptoms.join(', '),
                                    "duration": this.state.order.consultation.duration,
                                    "comment": this.state.order.patient.comment,
                                    "doctor_fio": this.state.order.doctor.name + " " + this.state.order.doctor.name_other,
                                    "doctor_specialty": this.state.order.doctor.specialties.join(', '),
                                    "messenger": this.state.order.patient.messenger,
                                    "promocode": this.state.order.promocode,
                                    "discount": this.state.order.consultation.discount,
                                    "desire_time": new Date().toLocaleString(),
                                    "payed": 0
                                })
                                .then((res) => {
                                    console.log(res.text);
                                    this.setState({
                                        redirectTrue: true
                                    })
                                });
                        } else {
                            request
                                .post("https://doc.ua/api/sendemail")
                                .set('Content-Type', 'application/json')
                                .send({
                                    "token": "5twQwe12Nid0l",
                                    // "email": "info@doc.ua, i.kovalenko@doc.ua",
                                    "email": process.env.REACT_APP_EMAIL_NOTIFICATIONS,
                                    "category": "audio",
                                    "subject": "Паціент скасував візит дзвінок не потрібен",
                                    "type": "cancel",
                                    "order_id": this.state.order_id,
                                    "doctor_id": this.state.order.doctor.id,
                                    "fio": this.state.order.patient.name,
                                    "phone": this.state.order.patient.phone,
                                    "price": this.state.order.consultation.price,
                                    "reason": this.state.order.patient.symptoms.join(', '),
                                    "duration": this.state.order.consultation.duration,
                                    "comment": this.state.order.patient.comment,
                                    "doctor_fio": this.state.order.doctor.name + " " + this.state.order.doctor.name_other,
                                    "doctor_specialty": this.state.order.doctor.specialties.join(', '),
                                    "messenger": this.state.order.patient.messenger,
                                    "promocode": this.state.order.promocode,
                                    "discount": this.state.order.consultation.discount,
                                    "desire_time": new Date().toLocaleString(),
                                    "payed": 0
                                })
                                .then((res) => {
                                    console.log(res.text);
                                    this.setState({
                                        redirectTrue: true
                                    })
                                });
                        }

                    } else {
                        this.setState({
                            redirectTrue: true
                        })
                    }

                }
            })
            .catch(err => {
                this.setState({
                    cashBack: false,
                    loading: false
                })
            })
    }
    notCallPatient = () => {
        request
            .post("/doc-audio/audio/order/"+this.state.order_id+"/callback/failed")
            .then((res) => {
                console.log(res.text);
                this.setState({
                    notCall: false
                })
                document.querySelector('.Timer').classList.add('err');
            })
        // if (process.env.REACT_APP_ENVIRONMENT === "production") {
        //     if (this.state.order.doctor.id === 11244 || this.state.order.doctor.id === 16057 || this.state.order.doctor.id === 21472) {
        //         request
        //             .post("https://doc.ua/api/sendemail")
        //             .set('Content-Type', 'application/json')
        //             .send({
        //                 "token": "5twQwe12Nid0l",
        //                 "email": process.env.REACT_APP_EMAIL_NOTIFICATIONS + "," + process.env.REACT_APP_EMAIL_NOTIFICATIONS_ADDITIONAL,
        //                 "category": "audio",
        //                 "subject": "Пациенту не позвонили",
        //                 "type":"cancel",
        //                 "order_id": this.state.order_id,
        //                 "doctor_id": this.state.order.doctor.id,
        //                 "fio": this.state.order.patient.name,
        //                 "phone": this.state.order.patient.phone,
        //                 "price": this.state.order.consultation.price,
        //                 "reason": this.state.order.patient.symptoms.join(', '),
        //                 "duration": this.state.order.consultation.duration,
        //                 "comment": this.state.order.patient.comment,
        //                 "doctor_fio": this.state.order.doctor.name + " " + this.state.order.doctor.name_other,
        //                 "doctor_specialty": this.state.order.doctor.specialties.join(', '),
        //                 "messenger": this.state.order.patient.messenger,
        //                 "promocode": this.state.order.promocode,
        //                 "discount": this.state.order.consultation.discount,
        //                 "desire_time": new Date().toLocaleString(),
        //                 "payed": 1
        //             })
        //             .then((res) => {
        //                 console.log(res.text);
        //                 this.setState({
        //                     notCall: false
        //                 })
        //                 document.querySelector('.Timer').classList.add('err');
        //             });
        //     } else {
        //         request
        //             .post("https://doc.ua/api/sendemail")
        //             .set('Content-Type', 'application/json')
        //             .send({
        //                 "token": "5twQwe12Nid0l",
        //                 "email": process.env.REACT_APP_EMAIL_NOTIFICATIONS,
        //                 "category": "audio",
        //                 "subject": "Пациенту не позвонили",
        //                 "type":"cancel",
        //                 "order_id": this.state.order_id,
        //                 "doctor_id": this.state.order.doctor.id,
        //                 "fio": this.state.order.patient.name,
        //                 "phone": this.state.order.patient.phone,
        //                 "price": this.state.order.consultation.price,
        //                 "reason": this.state.order.patient.symptoms.join(', '),
        //                 "duration": this.state.order.consultation.duration,
        //                 "comment": this.state.order.patient.comment,
        //                 "doctor_fio": this.state.order.doctor.name + " " + this.state.order.doctor.name_other,
        //                 "doctor_specialty": this.state.order.doctor.specialties.join(', '),
        //                 "messenger": this.state.order.patient.messenger,
        //                 "promocode": this.state.order.promocode,
        //                 "discount": this.state.order.consultation.discount,
        //                 "desire_time": new Date().toLocaleString(),
        //                 "payed": 1
        //             })
        //             .then((res) => {
        //                 console.log(res.text);
        //                 this.setState({
        //                     notCall: false
        //                 })
        //                 document.querySelector('.Timer').classList.add('err');
        //             });
        //     }
        //
        // } else {
        //     document.querySelector('.Timer').classList.add('err');
        // }

    }


    // handleCancel(){
    //     request
    //         .post("https://doc.ua/api/sendemail")
    //         .set('Content-Type', 'application/json')
    //         .send({
    //             "token":"5twQwe12Nid0l","email":"fallbackster@gmail.com","category":"audio","subject":"Паціент скасував візит дзвінок не потрібен",
    //             // "fio": this.props.location.namePatient,
    //             // "phone": this.props.location.phonePatient,
    //             // "reason": this.props.location.problemsPatient,
    //             // "desire_time": (+this.props.location.state.date - 1800000),
    //             // "payed": 0
    //             "fio": "Фио eqdeqd",
    //             "phone": "Тест телефон",
    //             "reason": "Причина тест",
    //             "desire_time": "133432423423423",
    //             "payed": 0
    //         })
    //         .then((res) => {
    //             console.log(res.text);
    //             this.setState({
    //                 redirectTrue: true
    //             })
    //         });
    // }


    render() {
        return (
            <React.Fragment>
                {
                    this.state.headerRend === 1 ? null :
                        <Headerform
                            onToggle={this.toggleMenuHandler}
                            isOpen={this.state.menu}
                            noScroll={true}
                            scrollClass={this.state.scrollClass ? " scroll" : ''}
                            onScroll={this.handleScroll}
                            domainName={window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2')}
                        />
                }
                <div className={'Timer'}>
                    <h2 className={'Timer_text first'}>{this.state.lang === 'ru' ? 'Оплата прошла успешно!' : 'Оплата пройшла успішно!'}</h2>
                    {
                        this.state.linkSell ?
                            <img src={this.state.linkSell} alt="" width="1" height="1" style={{'opacity': 0}}/>
                            : null
                    }
                    <h3 className={'Timer_text second'}>{this.state.lang === 'ru' ? 'Консультация началась!' : 'Консультація почалась!'}</h3>
                    {
                        !this.state.order ? null
                            :
                            <>
                                <img src={timerImg} className={'Timer_text_img'} alt="timer"/>
                                <h4 className={'Timer_text foot'}>{this.state.lang === 'ru' ? 'Ожидайте, наш специалист свяжется с Вами в ближайшее время' : 'Очікуйте, наш спецiалiст зв\'яжеться з вами найближчим часом' }</h4>
                            </>
                            // this.state.order.doctor.id === 11244 || this.state.order.doctor.id === 16057 || this.state.order.doctor.id === 21472 ?
                            //     <>
                            //         <div className="item html">
                            //             <div className="tor-pulsate"></div>
                            //             <time>{this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes}:{this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds}
                            //                 <span>{this.state.lang === 'ru' ? 'мин' : 'хв'}</span></time>
                            //             <svg width="180" height="180" xmlns="http://www.w3.org/2000/svg">
                            //                 <g>
                            //                     <title>Layer 1</title>
                            //                     <circle id="circle" className="circle_animation" r="69.85699" cy="81"
                            //                             cx="81"
                            //                             strokeWidth="7" stroke="#FFFFFF" strokeLinecap="round"
                            //                             fill="none"/>
                            //                 </g>
                            //             </svg>
                            //         </div>
                            //         <h4 className={'Timer_text foot'}>{this.state.lang === 'ru' ? 'Ожидайте, врач свяжется с Вами через '+ this.state.minutes +' мин' :  'Очікуйте, лікар зв\'яжеться з вами через '+ this.state.minutes +' хв'}</h4>
                            //     </>
                            //     :
                            //     <>
                            //         <img src={timerImg} className={'Timer_text_img'} alt="timer"/>
                            //         <h4 className={'Timer_text foot'}>{this.state.lang === 'ru' ? 'Ожидайте, наш специалист свяжется с Вами в ближайшее время' : 'Очікуйте, наш спецiалiст зв\'яжеться з вами найближчим часом' }</h4>
                            //     </>


                    }

                    <h4 className={'Timer_text err'}>{this.state.lang === 'ru' ? 'Сообщение об ошибке отправлено. Ожидайте звонка' : 'Повідомлення про помилку надіслано. чекайте дзвінка'}</h4>
                    {
                        this.state.endDate > 0 ?
                            !this.state.order ? null
                                : this.state.order.consultation.price > 0 ?
                                <div className="Timer_button cancel" onClick={this.toogleClass}>{this.state.lang === 'ru' ? 'Отменить': 'Скасувати'}</div> : null
                            : this.state.notCall ?
                            <>
                                <Link className="Timer_button" to={{pathname: `${window.location.hostname.replace(/^(www\\.)?(.+)$/i, '$2') === 'audio.doc.online' ? '/' : '/audio'}`}}>{this.state.lang === 'ru' ? 'На главную': 'На головну'}</Link>
                                {
                                    window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2') === 'audio.doc.online' ? null :
                                        <div className="Timer_button" onClick={() => this.notCallPatient()}>{this.state.lang === 'ru' ? "Врач со мной не связался": "Лiкар не зв'язався"}</div>
                                }
                            </>
                            : null


                    }
                    {
                        this.state.endDate > 0 ?
                            <div className="Timer_cancel-block">

                                {
                                    !this.state.cashBack ?
                                        <>
                                            <div className="Timer_cancel-block_text error fade-in">
                                                {this.state.lang === 'ru' ? 'Ваша заявка отменена.' : 'Ваша заявка скасована.'}
                                                     <br/>{this.state.lang === 'ru' ? 'Получить подробную информацию можно у службы поддержки по номерам:' : 'Отримати детальну інформацію можна у служби підтримки за номерами:'}
                                                <br/><br/>
                                                <a href="tel:+380443370707 ">+38 (044) 337-07-07 </a>
                                                <a href="tel:+380673370707 ">+38 (067) 337-07-07 </a>
                                                <a href="tel:+380953370707 ">+38 (095) 337-07-07 </a>
                                                <a href="tel:+380633370707 ">+38 (063) 337-07-07 </a>
                                                <br/>
                                            </div>
                                            <div className="Timer_cancel-block_line">
                                                <Link className="Timer_button" to={{pathname: `${window.location.hostname.replace(/^(www\\.)?(.+)$/i, '$2') === 'audio.doc.online' ? '/' : '/audio'}`}}>{this.state.lang === 'ru' ? 'На главную': 'На головну'}</Link>
                                            </div>

                                        </>
                                        :
                                        <>
                                            <span className="doc-line_cancel_icon" onClick={this.toogleClass}/>
                                            <div className="h2 ">{this.state.lang === 'ru' ? 'Вы действительно хотите отменить заказ?': 'Ви дійсно бажаєте відмінити замовлення?'}</div>
                                            <img src={timerImgCancel} alt="cancel"/>
                                            <div className="Timer_cancel-block_text">
                                                {this.state.lang === 'ru' ? 'При отмене заказа' : 'При відміні замовлення'}<br/>
                                                {this.state.lang === 'ru' ? 'с Вас снимается ' : 'з вас буде списана '}
                                                <b>{this.state.lang === 'ru' ? 'штрафная комиссия ' : 'штрафна комісія '}</b>
                                                {this.state.lang === 'ru' ? 'в размере' : 'в розмірі '}
                                                <b> 50%</b>
                                            </div>


                                            {
                                                this.state.loading
                                                    ?
                                                    <div className='sk-circle-bounce'>
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
                                                    : <div className="Timer_cancel-block_line">
                                                        <div className="Timer_button" onClick={this.toogleClass}>{this.state.lang === 'ru' ? 'Нет, спасибо' : 'Ні, дякую'}</div>
                                                        <div className="Timer_button"
                                                             onClick={
                                                                 this.handleCashback.bind(this)
                                                                 // () => this.handleCancel()
                                                             }>{this.state.lang === 'ru' ? 'Подтвердить отмену' : 'Підтвердити відміну'}
                                                        </div>
                                                    </div>

                                            }
                                        </>
                                }
                            </div>
                            : null
                    }

                    <div className={'support'} />

                    {
                        this.state.redirectTrue ? <Redirect
                            to={{
                                pathname: `${window.location.hostname.replace(/^(www\\.)?(.+)$/i, '$2') === 'audio.doc.online' ? '' : '/audio'}/cancel`,
                                state: {

                                    order_id: this.state.order_id,
                                    cardMask: this.state.cardMask,
                                    returnPrice: this.state.returnPrice,
                                    webInfo: this.state.webInfo,
                                    lang: this.state.lang
                                }

                            }}
                        /> : null
                    }
                </div>
            </React.Fragment>
        )
    }
}

export default Timer

// to={{
//     pathname: "/audio/cancel",
//     state: {
//         id: this.props.location.state.id,
//         img:  this.props.location.state.img,
//         name:  this.props.location.state.name,
//         nameOther:  this.props.location.state.nameOther,
//         position: this.props.location.state.position,
//         price: this.props.location.state.price,
//         duration: this.props.location.state.duration
//     }
// }}
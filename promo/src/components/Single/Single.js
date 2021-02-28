import React, { Component }  from 'react';

import {withRouter} from 'react-router-dom';

import PromoCard from "../Section/Promo/PromoCard";
// import dataJson from '../../offers.json'
import '../Single/Single.scss'
import SingleDoctors from "./SingleDoctors";
import SingleContent from "./SingleContent";
import {fetchDataJson, fetchJsonById} from "../../store/actions/mainPageAction";
import {connect} from "react-redux";
import SingleSlider from "./SingleSlider";
import Bradcrumb from "../Navigation/Bradcrumbs/Bradcrumb";
import Helmet from "react-helmet";

class Single extends Component {
    state = {
        linkInfo: undefined,
        utmInfoLink: RegExp("[?&]utm_source=([^&]*)").exec(window.location.search),
        arrsource: ['*','yandex','skype','google.com.ua,google.com, google.ru','yandex.ua','go.mail.ru', 'facebook','vk','twitter','instagram','blogger','disqus','linkedin','viber','salesdoubler','admitad','primelead','email','email_newsletter','widget','iframe_order','link.2gis.ru','skidochnik','telegram','prostodoctor','','gravitec','popup','privat_bank','thankyou','banner','sellaction.net']
    }


    // componentDidMount() {
    //     request
    //         .get('https://doc.ua/go/single/offer/4343')
    //         // .query({ a: 1, b: 2 }) // если надо. Оно приобразуется в query-строку "?a=1&b=2". Есть только у GET-запроса, у остальных используется .send({...})
    //         .then(response => {
    //             this.setState({ info: response.body});
    //             // console.log(response)
    //         })
    //         .catch(err => {
    //             alert("Error")
    //         })
    // }
    // componentDidMount() {
    //     request
    //         .get('https://doc.ua/go/single/offer/'+this.props.location.state.id)
    //         .then(response => {
    //             this.setState({ info: response.body.item.offers[0]});
    //             // console.log(this.state.info)
    //         })
    //         .catch(err => {
    //             alert("Error req singl")
    //         })
    // }

    componentDidMount() {
        document.body.classList.remove('scroll')
        window.scrollTo(0, 0)
        // console.log(this.props.dataJson)
        // console.log(this.props.match.params.id)
        this.props.fetchJsonById(this.props.match.params.alias, this.props.uaProp)
        this.props.fetchJson(+this.props.dataState.citiesList.find(e=> e.alias === this.props.match.params.city).id, 1, 50, this.props.uaProp)
        if(this.props.location.state) {
            if(this.props.location.state.linkInfo) {
                this.setState({
                    linkInfo: this.props.location.state.linkInfo
                })
            }
        } else {
            if(this.state.utmInfoLink) {
                this.setState({
                    linkInfo: this.state.arrsource.indexOf(decodeURIComponent(this.state.utmInfoLink[1].replace(/\+/g, " "))) >= 0 ? this.state.arrsource.indexOf(decodeURIComponent(this.state.utmInfoLink[1].replace(/\+/g, " "))) + 1 : 20
                }, () => {
                    document.cookie = "__trafficSource=" + (this.state.linkInfo)+"; domain="+window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2')+"; path=/; expires=" + new Date(new Date().getTime() + 1000 * 3600 * 24 * 30).toUTCString();
                })
            } else {
                this.getCookies("__trafficSource")
            }
        }


    }
    getCookies(name) {
        console.log('getCookie')
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"
        ));
        if (matches) {
            this.setState({
                linkInfo: parseInt(decodeURIComponent(matches[1]))
            })
            console.log('has cookie ' + decodeURIComponent(matches[1]))
        } else {
            this.setState({
                linkInfo: 20
            }, () => {
                document.cookie = "__trafficSource=20; domain="+window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2')+"; path=/; expires=" + new Date(new Date().getTime() + 1000 * 3600 * 24 * 30).toUTCString();
            })
        }
    }
    formatDate = (date) => {
        let dd = date.getDate();
        if (dd < 10) dd = '0' + dd;

        let mm = date.getMonth() + 1;
        if (mm < 10) mm = '0' + mm;

        let yy = date.getFullYear() % 100;
        if (yy < 10) yy = '0' + yy;

        let hh = date.getHours();
        if (hh < 10) hh = '0' + hh;

        let mnmn = date.getMinutes();
        if (mnmn < 10) mnmn = '0' + mnmn;

        let form = hh < 12 ? 'AM' : "PM";

        return dd + '-' + mm + '-20' + yy + ' ' + hh + ':' + mnmn + form;
    }
    // componentDidUpdate(prevProps) {
    //     // console.log(prevProps.match.params.id+ "upd")
    //     // console.log()
    //     if( prevProps.match.params.id !== this.props.match.params.id) {
    //         window.scrollTo(0, 0);
    //         this.props.fetchJsonById(+this.props.match.params.id);
    //         console.log("change");
    //     }
    // }
    render() {
        return (
            <section className={'Single fade-in-2'}>

                <Bradcrumb
                    {...this.props}
                    inner={true}
                    uaProp={this.props.uaProp}
                />
                    {
                        !this.props.info
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
                            <div className="container">
                                <Helmet>
                                    <meta property="og:title" content={this.props.info.promotion.name}/>
                                    <title>{this.props.info.promotion.name}</title>
                                    <meta property="og:site_name" content="Doc.ua"/>
                                    {/*<meta property="og:image" content="https://doc.ua/api/image/image/734/74/74"/>*/}
                                    <meta property="og:url" content={"https://doc.ua"+this.props.match.url}/>
                                    <meta property="og:description" content={this.props.info.promotion.short_text.replace(/<[^>]+>/g, '')}/>
                                    <meta property="og:type" content="Product"/>
                                </Helmet>
                                {/*{console.log(this.props.info)}*/}
                                <PromoCard
                                    title={this.props.info.promotion.name}
                                    date={this.props.info.promotion.date_to}
                                    key={this.props.info.id}
                                    keyDate={this.props.info.promotion.alias}
                                    city={this.props.match.params.city}
                                    text={this.props.info.promotion.short_text}
                                    oldPrice={this.props.info.promotion.old_price}
                                    mainPrice={this.props.info.promotion.new_price}
                                    direction={this.props.info.promotion.specialties[0].name}
                                    slidesAffilates={this.props.info.promotion.affiliates}
                                    idPromo={this.props.info.promotion.alias}
                                    linkInfo={this.state.linkInfo}
                                    uaProp={this.props.uaProp}
                                />
                                {
                                    !this.props.info.promotion.full_text
                                        ? null
                                        : <SingleContent
                                            name={this.props.uaProp ? 'Про акцію' :'Об акции'}
                                            content={this.props.info.promotion.full_text}
                                            date={this.props.info.promotion.date_to}
                                            dateFrom={this.props.info.promotion.date_from}
                                            uaProp={this.props.uaProp}
                                        />
                                }
                                {
                                    !this.props.info.doctors
                                        ? null
                                        :
                                        this.props.info.doctors.length < 1
                                            ? null
                                            :
                                            <SingleDoctors
                                                name={this.props.uaProp ? 'Лікарі в акції' :'Врачи в акции'}
                                                city={this.props.match.params.city}
                                                doctors={this.props.info.doctors}
                                                idPromo={this.props.info.promotion.alias}
                                                price={this.props.info.promotion.new_price}
                                                linkInfo={this.state.linkInfo}
                                                uaProp={this.props.uaProp}
                                            />
                                }

                                {
                                    !this.props.dataState.dataJson || !this.props.info
                                        ? null
                                        :
                                        !this.props.dataState.dataJson.promotions || !this.props.info.promotion
                                            ? null
                                            :
                                            <SingleSlider
                                                name={this.props.uaProp ? 'Вас може зацікавити' : 'Вас может заинтересовать'}
                                                activeAlias={this.props.match.params.alias}
                                                array={
                                                    this.props.dataState.dataJson.promotions.filter(categoryId =>
                                                        categoryId.specialties[0].id === this.props.info.promotion.specialties[0].id)
                                                }
                                                city={this.props.match.params.city}
                                                linkInfo={this.state.linkInfo}
                                                uaProp={this.props.uaProp}
                                            />


                                }
                                <script type='application/ld+json'>
                                    {`{
                                        "@context": "http://www.schema.org",
                                        "@type": "Event",
                                        "name": "${this.props.info.promotion.name}",
                                        "url":"https://doc.ua/promotions/${this.props.match.params.city+"/"+this.props.match.params.alias}",
                                        "description":"${this.props.info.promotion.short_text.replace(/<[^>]+>/g, '').replace(/"([^"]+)"/g, '\\"$1\\"')}",
                                        "startDate":"${this.formatDate(new Date(+this.props.info.promotion.date_from*1000))}",
                                        "endDate":"${this.formatDate(new Date(+this.props.info.promotion.date_to*1000))}",
                                        "location": [
                                             ${this.props.info.promotion.affiliates.map( location =>  {
                                                return (
                                                    `{
                                                        "@type": "Place",
                                                        "name":"${location.name}",
                                                        "sameAs":"https://doc.ua/${location.alias}",
                                                        "address":{
                                                            "@type": "PostalAddress",
                                                              "streetAddress": "${location.address}",
                                                              "addressLocality": "${location.district}",
                                                              "addressRegion": "${ this.props.dataState.citiesList.find(nameCity => nameCity.alias === this.props.match.params.city).name}"
                                                        }
                                                    }`
                                                )
                                            })}
                                            
                                        ]
                                        }`}
                                </script>
                                <script type='application/ld+json'>
                                    {`{
                                        "@context": "http://www.schema.org",
                                        "@type": "Offer",
                                        "description":"${this.props.info.promotion.short_text.replace(/<[^>]+>/g, '').replace(/"([^"]+)"/g, '\\"$1\\"')}",
                                        "url":"https://doc.ua/promotions/${this.props.match.params.city+"/"+this.props.match.params.alias}",
                                        "availability": "in stock",
                                        "pricecurrency": "UAH",
                                        "price": "${this.props.info.promotion.new_price}"
                                    }`}
                                </script>

                            </div>
                    }

            </section>
        );
    }
}

function mapStateToProps(state) {
    return {
        info: state.mainPageReducer.info,
        dataState: state.mainPageReducer
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchJsonById: (id, name)  => dispatch(fetchJsonById(id, name)),
        fetchJson:  (city, page, perpage, name) => dispatch(fetchDataJson(city, page, perpage, [], name) ),
        // fetchJsonByAlias: alias => dispatch(fetchJsonByAlias(alias))
    }
}
// function mapStateToProps(state) {
//     return {
//         dataJson: state.mainPageReducer
//     }
// }
// function mapDispatchToProps(dispatch) {
//     return {
//         fetchJson: () => dispatch(fetchDataJson())
//     }
// }

export default withRouter(connect(mapStateToProps, mapDispatchToProps)( Single))
// export default  connect(mapStateToProps, mapDispatchToProps)(withRouter(Single))

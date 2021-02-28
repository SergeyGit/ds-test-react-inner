import React, {Component} from 'react'
// import request from "superagent"
import './Promo.scss'
import './Pagination.scss'
// import dataJson from '../../../offers.json'
import PromoCard from './PromoCard'

import {fetchDataJson, morePromoPerpage} from "../../../store/actions/mainPageAction";
import {connect} from "react-redux";
// import Directions from "./Directions/Directions";
import Helmet from "react-helmet";
import SecondDirection from "./Directions/SecondDirection";
// import SingleDoctors from "../../Single/SingleDoctors";
// import SingleContent from "../../Single/SingleContent";

export function stoq(str) {
    if (!str)
        return {};
    let parts = str.replace(/^\?/, "").split("&");
    let query = {};
    parts.forEach(part => {
        let [head, ...tail] = part.split("=");
        query[head] = tail.join("=");
    });
    return query;
}
export function qtos(query) {
    return Object.keys(query).map(key => `${key}=${query[key]}`).join("&");
}


class Promo extends Component {
    state = {
        specialtiesModal: false,
        linkInfo: undefined,
        utmInfoLink: RegExp("[?&]utm_source=([^&]*)").exec(window.location.search),
        arrsource: ['*','yandex','skype','google.com.ua,google.com, google.ru','yandex.ua','go.mail.ru', 'facebook','vk','twitter','instagram','blogger','disqus','linkedin','viber','salesdoubler','admitad','primelead','email','email_newsletter','widget','iframe_order','link.2gis.ru','skidochnik','telegram','prostodoctor','','gravitec','popup','privat_bank','thankyou','banner','sellaction.net']
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }
    componentDidMount() {
        window.addEventListener('scroll', this.handleScroll);
        if (this.props.match.params.city) {
                this.props.fetchJson(
                    +this.props.dataState.citiesList.find(e => e.alias === this.props.match.params.city).id,
                    this.props.dataState.page,
                    this.props.dataState.per_page,
                    this.props.match.params.specialty ? this.props.match.params.specialty : "",
                    this.props.uaProp
                )
        } else {
            window.location.href = "/promotions/kiev/all";
        }
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
    constructor(props) {
        super(props);
        this.clearSpecialty = this.clearSpecialty.bind(this);
        this.handleModalSpecialties = this.handleModalSpecialties.bind(this);
        this.handleClickOutside = this.handleClickOutside.bind(this);
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

    handleScroll() {
        if (document.getElementById("TerapeftList_directions")) {
            if(window.pageYOffset > (document.getElementById("TerapeftList_directions").offsetTop) - 50) {
                document.body.classList.add('scroll')
            } else {
                document.body.classList.remove('scroll')
            }
        }
    }
    handleClickOutside(e) {
        if(document.getElementsByClassName('TerapeftList_directions_button_modal').length > 0) {
            const emojiBlock = document.getElementsByClassName('TerapeftList_directions_button_modal')[0];
            if (e.path) {
                if (!e.path.includes(emojiBlock)) {
                    const svgSmileBtn = document.querySelector('.TerapeftList_directions_mobile_filter-show');
                    const svgSmileBtn2 = document.querySelector('.show-more');
                    if (!e.path.includes(svgSmileBtn) && !e.path.includes(svgSmileBtn2) )  this.handleModalSpecialties();
                }
            }


        }

    }
    clearSpecialty() {
        this.props.history.push(`${this.props.uaProp ? "/ua" : ""}/promotions/${this.props.match.params.city}/all/`)
    }
    handleModalSpecialties() {
        this.setState( pervState => ({
            specialtiesModal: !pervState.specialtiesModal,
        }))
    }




    render() {

        return(
            <section className={"Promo"}>
                    {
                        !this.props.dataState.dataJson
                            ?
                            <div className="Checkout_submit_cnt main">
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
                            </div>
                            :
                            !this.props.dataState.dataJson.promotions || this.props.dataState.dataJson.promotions.length === 0
                                ? null
                                :
                                <>
                                    <Helmet>
                                        <meta name="description" content={"Все акции в "+this.props.dataState.citiesList.find(nameCity =>
                                                        +nameCity.id === +this.props.dataState.city).name+"на Doc.ua. Полезные акции в "+this.props.dataState.citiesList.find(nameCity =>
                                            +nameCity.id === +this.props.dataState.city).name} />
                                        {
                                            this.props.uaProp ?
                                                <meta name="robots" content="noindex, nofollow"/>
                                                : null
                                        }
                                        <title>{`Акции и скидки${this.props.match.params.specialty ? this.props.match.params.specialty === "free" || this.props.match.params.specialty === "hot" ? "" :  ": " + this.props.dataState.dataJson.specialties.find(category => category.alias === this.props.match.params.specialty).name : ""}`}</title>
                                    </Helmet>
                                    {/*<Directions*/}
                                    {/*   specialties={this.props.dataState.dataJson.specialties}*/}
                                    {/*   cityAlias={this.props.match.params.city}*/}
                                    {/*   activeSpecielty={this.props.match.params.specialty ? this.props.match.params.specialty : 'null'}*/}
                                    {/*   clearSpecialty={this.clearSpecialty}*/}
                                    {/*/>*/}
                                    <SecondDirection
                                        activeSpecielty={this.props.match.params.specialty}
                                        activeSpecButton={this.props.match.params.specialty ? this.props.dataState.dataJson.specialties.find(category => category.alias === this.props.match.params.specialty) : null}
                                        specialties={this.props.dataState.dataJson.specialties}
                                        cityAlias={this.props.match.params.city}
                                        clearSpecialty={this.clearSpecialty}
                                        specialtiesModal={this.state.specialtiesModal}
                                        handleModalSpecialties={this.handleModalSpecialties}
                                        sortTimePromo={this.sortTimePromo}
                                        free={this.props.dataState.dataJson.free}
                                        hot={this.props.dataState.dataJson.hot}
                                        uaProp={this.props.uaProp}
                                    />
                                    <div className="container">
                                    {
                                        this.props.dataState.dataJson.promotions.map((offers) => {
                                                // dataJson.offers.filter(word => word === 'Проктология').map((offers, index) => {
                                                // dataJson.offers.map((offers, index) => {
                                                // console.log(offers.date_to + offers.title + " " + offers.direction)
                                                return (
                                                    <PromoCard
                                                        key={offers.id}
                                                        alias={offers.alias}
                                                        city={this.props.match.params.city}
                                                        id={offers.id}
                                                        title={offers.name}
                                                        date={offers.date_to}
                                                        keyDate={offers.id}
                                                        text={offers.short_text}
                                                        oldPrice={offers.old_price}
                                                        mainPrice={offers.new_price}
                                                        direction={offers.specialties[0].name}
                                                        directionLink={offers.specialties[0].alias}
                                                        slidesAffilates={offers.affiliates}
                                                        idPromo={offers.alias}
                                                        activeSpecielty={this.props.match.params.specialty}
                                                        linkInfo={this.state.linkInfo}
                                                        uaProp={this.props.uaProp}
                                                    />
                                                )

                                            })
                                    }
                                    </div>
                                    <script type='application/ld+json'>
                                        {`{
                                        "@context": "http://www.schema.org",
                                        "@type": "AggregateOffer",
                                        ${
                                            !this.props.match.params.specialty ?
                                                "\"name\": \"Акции\","
                                                :
                                                this.props.match.params.specialty === "hot" || this.props.match.params.specialty === "free" ? "\"name\": \"Акции\","
                                                    :
                                                "\"name\": \" "+ this.props.dataState.dataJson.specialties.find(categoryAlias =>
                                                categoryAlias.alias === this.props.match.params.specialty).name + "\","
                                        }
                                        "highPrice": "${this.props.dataState.dataJson.promotions.map( offers => offers.new_price).reduce( ( max, cur ) => Math.max( max, cur ), 0)}",
                                        "lowPrice": "${this.props.dataState.dataJson.promotions.map( offers => offers.new_price).reduce( ( max, cur ) => Math.min( max, cur ), 0 )}",
                                        "priceCurrency":"UAH",
                                        "offerCount": "${this.props.dataState.dataJson.promotions.length}",
                                        "offers": [
                                        ${this.props.dataState.dataJson.promotions.map( offers =>  {
                                            return (
                                                `{
                                                "@type": "Offer",
                                                "url": "https://doc.ua/promotions/${this.props.match.params.city+"/"+offers.alias}",
                                                "name":"${offers.name}",
                                                "description":"${offers.short_text.replace(/<[^>]+>/g, '').replace(/"([^"]+)"/g, '\\"$1\\"')}",
                                                "price": "${offers.new_price}",
                                                "priceCurrency": "UAH"
                                                }`
                                            )
                                        })}
                                        ]
                                            }`
                                        }
                                    </script>
                                    <div className="container">
                                    {
                                        this.props.dataState.dataJson.promotions.length >= this.props.dataState.perPage ?
                                            <div className="Pagination-sec fade-in-2" key={this.props.dataState.dataJson.promotions.length}>

                                                <div className="pager-all">
                                                    <div className="load-items" onClick={() => this.props.morePromo(this.props.dataState.city, this.props.dataState.page, (+this.props.dataState.perPage + 10) ,this.props.match.params.specialty ?this.props.match.params.specialty : "")}>
                                                        {
                                                            // this.state.dataJson.total_doctors > 10*this.state.page ?
                                                                <>
                                                                    <span>{this.props.uaProp ? "Показати ще 10 акцій" : "Показать еще 10 акций"}</span>
                                                                    <svg className="load-items_svg" width="22" height="16" viewBox="0 0 22 16"><path id="update" d="M 18 4L 14 8L 17 8C 17 11.31 14.31 14 11 14C 9.99 14 9.03 13.75 8.2 13.3L 6.74 14.76C 7.97 15.54 9.43 16 11 16C 15.42 16 19 12.42 19 8L 22 8L 18 4ZM 5 8C 5 4.69 7.69 2 11 2C 12.01 2 12.97 2.25 13.8 2.7L 15.26 1.24C 14.03 0.46 12.57 0 11 0C 6.58 0 3 3.58 3 8L 0 8L 4 12L 8 8L 5 8Z" fill="#333536"></path></svg>
                                                                </>
                                                                // : null
                                                        }

                                                    </div>
                                                </div>
                                            </div>
                                            : null
                                    }
                                    </div>
                                </>
                    }
            </section>
        )
    }
}

function mapStateToProps(state) {
    return {
        dataState: state.mainPageReducer,
    }
}
function mapDispatchToProps(dispatch) {
    return {
        fetchJson: (city, page, perPage, specialties, name) => dispatch(fetchDataJson(city, page, perPage, specialties, name)),
        morePromo: (city, page, perPage, specialties, name) => dispatch(morePromoPerpage(city, page, perPage, specialties, name)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Promo)
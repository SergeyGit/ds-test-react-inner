import React, {Component} from 'react'
import './TerapeftList.scss'
import '../Section/SectionThree/SectionThree.scss'
// import loadable from '@loadable/component'
import TerapeftListCard from './TerapeftListCard'
import ExpressConsultation from '../Section/ExpressConsultation/ExpressConsultation'
import request from "superagent"
import "../Navigation/Pagination/Pagination.scss";
import {scroller} from "react-scroll";
// import imgF from "../../img/firrst-im.png";
// const TerapeftListCard = loadable(() => import('./TerapeftListCard'));

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



// const linkStart = "https://doc.ua";
// const linkStart = "https://stage1.r2rx.doc.ua";
// const linkStart = "http://10.100.1.38:8888";
const linkStart = "";
class TerapeftList extends Component {
    state = {
        dataJson: undefined,
        loadDoctors: [],
        imgSec: require("../../img/sec-3-im.svg"),
        ul: [
            "Онлайн-консультация подойдет вам, если вам нужен быстрый ответ на вопрос связанный со здоровьем",
            "Врач свяжется с вами как можно быстрее",
            "Врачи доступны каждый день с 8:00 до 20:00"
        ],
        ulOnline: [
            "Онлайн-консультация подойдет вам, если вам нужен быстрый ответ на вопрос связанный со здоровьем",
            "Врач свяжется с вами как можно быстрее",
            "Врачи доступны круглосуточно"
        ],
        ulukr: [
            "Онлайн-консультація стане у нагоді, якщо вам потрібно швидко отримати відповідь на запитання, пов'язане зі здоров'ям",
            "Лікар сконтактує з вами якомога швидше",
            "Онлайн-консультацією можна скористатися кожного дня з 8:00 до 20:00"
        ],
        listOpen: false,
        dropdown: {
            selected: 0,
            headerTitle: "По популярности",
            rows: [
                {
                    text: "По популярности",
                    alias: "popularity"
                },
                {
                    text: "Рейтинг",
                    alias: "rate"
                },
                {
                    text: "Количество отзывов",
                    alias: "feedbacks"
                },
                {
                    text: "Стаж",
                    alias: "experience"
                },
                {
                    text: "Цена услуг",
                    alias: "price"
                }
            ],
            rowsukr: [
                {
                    text: "За популярністю",
                    alias: "popularity"
                },
                {
                    text: "Рейтинг",
                    alias: "rate"
                },
                {
                    text: "Кількість відгуків",
                    alias: "feedbacks"
                },
                {
                    text: "Стаж",
                    alias: "experience"
                },
                {
                    text:"Вартість послуг",
                    alias: "price"
                }
            ]
        },
        specialties: stoq(this.props.location.search).specialties ? stoq(this.props.location.search).specialties : "",
        tempSpecialties: [],
        symptoms: [],
        range: "DESC",
        sorting: "popularity",
        page: 1,
        tempPage: [],
        perpage:10,
        maxSpecialties: 4,
        showMoreButton: true,
        mobileFilterOpen: false,
        mobileSortOpen: false,
        typeSort: 0,
        allShow: !stoq(this.props.location.search).specialties,
        assistanceShow: false,
        specialtiesModal: false,
    };
    constructor(props) {
        super(props);
        // this.onFormSubmit = this.onFormSubmit.bind(this)
        this.handleClickOutside = this.handleClickOutside.bind(this)
    }

    componentDidMount() {
        this.jsonDoctors(this.props.lang)
    }
    componentDidUpdate(prevProps) {
        if (this.props.lang !== prevProps.lang) {
            this.jsonDoctors(this.props.lang)
            this.setState(state => {
                state.dropdown.headerTitle = this.props.lang === 'ru' ? "По популярности" : "За популярністю";
                return state
            })
        }
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClickOutside, false);
    }

    componentWillMount() {
        document.addEventListener('click', this.handleClickOutside, false);
    }
    handleClickOutside(e) {
        // Получаем ссылку на элемент, при клике на который, скрытие не будет происходить
        if(document.getElementsByClassName('TerapeftList_directions_button_modal').length > 0) {
            const emojiBlock = document.getElementsByClassName('TerapeftList_directions_button_modal')[0];
           if (e.path) {
               if (!e.path.includes(emojiBlock)) {
                   const svgSmileBtn = document.querySelector('.TerapeftList_directions_mobile_filter-show');
                   const svgSmileBtn2 = document.querySelector('.show-more');
                   if (!e.path.includes(svgSmileBtn) && !e.path.includes(svgSmileBtn2))  this.setState({ specialtiesModal: false});
               }
           }


        }
        if(document.getElementsByClassName('TerapeftList_directions_button_modal').length > 0) {
            const listBlock = document.getElementsByClassName('TerapeftList_directions_dd')[0];
            if (e.path) {
                if (!e.path.includes(listBlock)) this.setState({ listOpen: false });
            }

        }


    }
    get categories() {
        let ctgs = stoq(this.props.location.search).specialties;
        return ctgs ?
            ctgs.split(",") : [];

    }
    jsonDoctors (lang) {
        request
            .get(`${linkStart}/doc-audio${this.props.domainName === 'audio.doc.online' ? '/inter' : ''}/doctors?${this.state.typeSort === 0 ? "specialties=" + this.state.specialties : "symptoms=" + this.state.symptoms.join(",")}&sorting=${this.state.sorting}&direction=${this.state.range}&page=${this.state.page}&per_page=${this.state.perpage}${this.state.assistanceShow ? "&show_assistance=true" : ""}`)
            .set('X-App-Lang', lang)
            // .get('http://localhost:3000/all-doc.json')
            .then(response => {
                this.setState({
                    dataJson: response.body,
                    // tempSpecialties: response.body.specialties.slice(0, 4)
                });
            })
            .catch(err => {
                console.log("Error doctors" + err)
            })
    }
    loadMoreJsonDoctor() {
        request
            .get(`${linkStart}/doc-audio${this.props.domainName === 'audio.doc.online' ? '/inter' : ''}/doctors?${this.state.typeSort === 0 ? "specialties=" + this.state.specialties : "symptoms=" + this.state.symptoms.join(",")}&sorting=${this.state.sorting}&direction=${this.state.range}&page=${this.state.page}&per_page=${this.state.perpage}${this.state.assistanceShow ? "&show_assistance=true" : ""}`)
            .set('X-App-Lang', this.props.lang)
            .then(response => {
                this.setState(prevState =>({
                    loadDoctors: prevState.loadDoctors.concat(response.body.doctors)
                }))
            })
            .catch(err => {
                console.log("Error doctors")
            })
    }

    handleClick = (event) => {
        event.currentTarget.classList.toggle("active");
    };
    scrollToTerapeft() {
        scroller.scrollTo('express', {
            duration: 700,
            delay: 300,
            smooth: true,
            offset: -100,
        });
    }
    changePage(numbPage) {
        this.setState({
            loadDoctors: [],
            tempPage: [],
            page: numbPage
        },function () {
            this.scrollToTerapeft();
            this.jsonDoctors(this.props.lang)
        })
    }
    showMoreDoctors() {
        let maxPAge = Math.ceil(this.state.dataJson.total_doctors/10);
        if(this.state.page + 1 <= maxPAge) {
            this.state.tempPage.push(this.state.page);
            this.setState(prevState =>({
                page: prevState.page + 1
            }),function () {
                this.loadMoreJsonDoctor()
            })
        }

    }
    arrovPage(direction) {
        let maxPAge = Math.ceil(this.state.dataJson.total_doctors/10);
        if (direction=== 1) {
            if(this.state.page + 1 <= maxPAge) {
                this.setState(prevState =>({
                    loadDoctors: [],
                    tempPage: [],
                    page: prevState.page + 1
                }),function () {
                    this.jsonDoctors(this.props.lang)
                    this.scrollToTerapeft();
                })
            }

        } else {
            if(this.state.page - 1 > 0 ) {
                this.setState(prevState =>({
                    loadDoctors: [],
                    tempPage: [],
                    page: prevState.page - 1
                }),function () {
                    this.jsonDoctors(this.props.lang)
                    this.scrollToTerapeft();
                })
            }

        }

    }

    handleCategories = (category_id) => {
        if (this.state.typeSort === 0) {
            let oldCtgs = this.categories.map(value => value);
            let newCtgs = [...oldCtgs];
            let namePath;
            if (newCtgs.includes(category_id)) {
                newCtgs.splice(oldCtgs.indexOf(category_id), 1);
            } else {
                newCtgs.push(category_id);
            }
            if (newCtgs.length === 0) {
                namePath = "";
                this.setState({
                    loadDoctors: [],
                    specialties: "",
                    // tempSpecialties: this.state.dataJson.specialties,
                    allShow: true,
                    page: 1
                },function () {
                    this.jsonDoctors(this.props.lang)
                })
            } else {
                namePath = `?${qtos({ specialties: newCtgs.join(",") })}`;
                // this.state.tempSpecialties.unshift(this.state.dataJson.specialties.find(word => word.alias === category_id)),
                this.setState( prevState => ({
                    loadDoctors: [],
                    specialties: newCtgs.join(","),
                    // tempSpecialties: prevState.tempSpecialties.unshift(this.state.dataJson.specialties.filter(word => word.alias === category_id)) this.state.dataJson.specialties.filter(category => !stoq(this.props.location.search).specialties ? true : stoq(this.props.location.search).specialties.includes(`${category.alias}`)).map((offers) => {return (offers)}),
                    // tempSpecialties: prevState.tempSpecialties
                    allShow: false,
                    page: 1
                }),function () {
                    // console.log(this.state.dataJson.specialties.find(word => word.alias === category_id))
                    this.jsonDoctors(this.props.lang)
                })
            }
            this.props.history.push(
                this.props.location.pathname + namePath
            )
        } else {
            let oldCtgs = this.state.symptoms.map(value => value);
            let newCtgs = [...oldCtgs];
            if (newCtgs.includes(category_id)) {
                newCtgs.splice(oldCtgs.indexOf(category_id), 1);
            } else {
                newCtgs.push(category_id);
            }
            if (newCtgs.length === 0) {
                this.setState({
                    loadDoctors: [],
                    specialties: "",
                    symptoms: [],
                    page: 1
                },function () {
                    this.jsonDoctors(this.props.lang)
                })
            } else {
                this.setState({
                    loadDoctors: [],
                    specialties: "",
                    symptoms: newCtgs,
                    page: 1
                },function () {
                    this.jsonDoctors(this.props.lang)
                })
            }
            this.props.history.push(
                this.props.location.pathname + ""
            )
        }

    };

    showMoreSpacialite(numb) {
        this.setState({
            maxSpecialties: numb,
            showMoreButton: false
        })
    }

    toggleList(){
        this.setState(prevState => ({
            listOpen: !prevState.listOpen
        }))
    }
    dropdownClickItem(index, text, alias) {
        if (this.state.dropdown.headerTitle === text ) {

            if(this.state.range === "DESC") {
                this.setState( {
                    loadDoctors: [],
                    tempPage: [],
                    page: 1,
                    range: "ASC",
                    listOpen: false,
                }, function () {
                    this.jsonDoctors(this.props.lang)
                })
            } else {
                this.setState( {
                    loadDoctors: [],
                    tempPage: [],
                    page: 1,
                    range: "DESC",
                    listOpen: false,
                }, function () {
                    this.jsonDoctors(this.props.lang)
                })
            }
        } else {
            this.setState(state => {
                state.listOpen = false;
                state.dropdown.headerTitle = text;
                state.dropdown.selected = index;
                state.sorting = alias;
                state.page= 1;
                state.tempPage= [];
                state.loadDoctors= [];
                state.range= "DESC";
                return state
            }, function () {
                this.jsonDoctors(this.props.lang)
            })
        }

    }

    toggFilter(){
        this.setState(prevState => ({
            mobileFilterOpen: !prevState.mobileFilterOpen
        }))
    }
    toggSort(){
        if(document.getElementById('head')) {
            document.getElementById('head').classList.toggle("opact");
        }
        this.setState(prevState => ({
            mobileSortOpen: !prevState.mobileSortOpen
        }))
    }
    clearFilter () {
        this.setState({
            loadDoctors: [],
            specialties: "",
            tempPage: [],
            symptoms: [],
            page: 1,
            specialtiesModal: false,
            mobileFilterOpen: false,
            allShow: true

        },function () {
            document.documentElement.classList.toggle("overflow");
            this.jsonDoctors(this.props.lang)
        })
        this.props.history.push(
            this.props.location.pathname
        )
    };
    changeAssist () {
        this.setState(prevState => ({
            loadDoctors: [],
            tempPage: [],
            symptoms: [],
            assistanceShow: !prevState.assistanceShow,
            page: 1,
            mobileFilterOpen: false,
            allShow: true

        }),function () {
            this.jsonDoctors(this.props.lang)
        })
    };
    handleTypeSort(numb) {
        this.setState( {
            typeSort: numb,
            loadDoctors: [],
            specialties: "",
            symptoms: [],
            assistanceShow: false,
            page: 1
        }, function () {
            this.jsonDoctors(this.props.lang);
            this.props.history.push(
                this.props.location.pathname
            )
        })
    }
    handleModalSpecialties() {
        document.documentElement.classList.toggle("overflow");
        if(document.getElementById('head')) {
            document.getElementById('head').classList.toggle("opact");
        }

        // document.getElementById('head').className = "Header open-modal";
        this.setState( pervState => ({
            specialtiesModal: !pervState.specialtiesModal,
        }))
    }


    render() {
        let queryVar = stoq(this.props.location.search);
        let specialties = [];
        let categorySelected = !!(queryVar && queryVar.specialties);
        if (categorySelected) {
            specialties = queryVar.specialties.split(",");
        }
        // console.log(specialties);
        return(
            <section className={"SectionThree"} >
                <div className="container">
                    <ExpressConsultation
                        domainName={this.props.domainName}
                        lang={this.props.lang}
                        ulOnline={this.state.ulOnline}
                        ul={this.props.lang === 'ru' ? this.state.ul : this.state.ulukr}
                    />
                </div>
                {
                    !this.state.dataJson
                        ? null
                        :
                        !this.state.dataJson.doctors || this.state.dataJson.doctors.length === 0
                            ? null
                            :
                            <div className="TerapeftList fade-in" id={'express'}>
                                <div className="container">
                                    <div className="caption h2">{this.props.lang === 'ru' ? 'Подобрать врача' : 'Підібрати лікаря'}</div>
                                    <div className="TerapeftList_tabs">
                                        <div className={`TerapeftList_tabs_point ${this.state.typeSort === 0 ? "active" : "" }`}
                                             onClick={() => this.handleTypeSort(0)}
                                        >
                                            <span className="TerapeftList_tabs_point_emoji">{'\uD83D\uDC69\u200D\u2695\uFE0F'}</span>
                                            <span className="TerapeftList_tabs_point_text h4 f-w-m">{this.props.lang === 'ru' ? 'По специальности' : 'За спеціальністю'}</span>
                                        </div>
                                        <div className={`TerapeftList_tabs_point ${this.state.typeSort === 1 ? "active" : "" }`}
                                             onClick={() => this.handleTypeSort(1)}
                                        >
                                            <span className="TerapeftList_tabs_point_emoji">{'\uD83E\uDD27'}</span>
                                            <span className="TerapeftList_tabs_point_text h4 f-w-m">{this.props.lang === 'ru' ? 'По симптому' : 'За симптомом'}</span>
                                            <span className="TerapeftList_tabs_point_text_more">{this.props.lang === 'ru' ? '(самочувствию)' : '(самопочуттям)'}</span>
                                        </div>
                                    </div>
                                    <div className="TerapeftList_directions fade-in-2">
                                        {
                                            this.state.typeSort === 0 ?
                                                <div className="TerapeftList_directions_button_cnt">
                                                    <div
                                                        className={`TerapeftList_directions_button  assistance ${this.state.assistanceShow  ? "active" : ""}`}
                                                        onClick={() => {
                                                            this.changeAssist()
                                                        }}
                                                    >{this.props.lang === 'ru' ? 'Дежурный врач' : 'Черговий лікар'} <div className="TerapeftList_directions_button_close"/><div className="TerapeftList_directions_button_lable">{this.props.lang === 'ru' ? 'Экспресс' : 'Експрес'}</div></div>
                                                    <div className="TerapeftList_directions_button_desct-cnt">
                                                        <div className="TerapeftList_directions_button_desct-cnt_active">
                                                            {
                                                                specialties.length <= 0 ? null
                                                                    :
                                                                    this.state.dataJson.specialties.filter(category => !stoq(this.props.location.search).specialties ? true : stoq(this.props.location.search).specialties.includes(`${category.alias}`)).map((directIttem) => {return (
                                                                        <div
                                                                            className={"TerapeftList_directions_button active"}
                                                                            key={directIttem.id}
                                                                            onClick={(event) => {
                                                                                this.handleCategories(directIttem.alias);
                                                                                this.handleClick(event)
                                                                            }}
                                                                        >
                                                                            {directIttem.name}
                                                                            <div
                                                                                className="TerapeftList_directions_button_close"
                                                                            />
                                                                        </div>
                                                                    )})
                                                            }
                                                        </div>
                                                        <div className="TerapeftList_directions_button_desct-cnt_other">
                                                            {
                                                                specialties.length < 3 ?
                                                                    this.state.dataJson.specialties.filter(category => !stoq(this.props.location.search).specialties ? true : !stoq(this.props.location.search).specialties.includes(`${category.alias}`)).map((directIttem, index) => {
                                                                        if(index < 3 - specialties.length) {
                                                                            return (
                                                                                <div
                                                                                    className={"TerapeftList_directions_button"}
                                                                                    key={directIttem.id}
                                                                                    onClick={(event) => {
                                                                                        this.handleCategories(directIttem.alias);
                                                                                        this.handleClick(event)
                                                                                    }}
                                                                                >
                                                                                    {directIttem.name}
                                                                                    <div
                                                                                        className="TerapeftList_directions_button_close"
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        }

                                                                    })
                                                                    : null

                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        !this.state.specialtiesModal ? null
                                                            :
                                                            <div className="TerapeftList_directions_button_modal fade-in-2">
                                                                <div className="TerapeftList_directions_button_modal_wrap">
                                                                    <div className="TerapeftList_directions_button_modal_head" onClick={() => this.handleModalSpecialties()}>
                                                                        <div className="f-b h3">{ this.props.lang === 'ru' ? 'Фильтр по специальности' : 'Фiльтр за спеціальністю'}</div>
                                                                        <div className="doc-line_cancel_icon"/>
                                                                    </div>
                                                                    <div className="TerapeftList_directions_button_modal_cat">
                                                                        {
                                                                            this.state.dataJson.specialties.map((directIttem, index) => {
                                                                                return (
                                                                                    <div
                                                                                        className={specialties.indexOf(String(directIttem.alias)) !== -1 ? "TerapeftList_directions_button active" : "TerapeftList_directions_button"}
                                                                                        key={directIttem.id}
                                                                                        onClick={(event) => {
                                                                                            this.handleCategories(directIttem.alias);
                                                                                            this.handleClick(event)
                                                                                        }}
                                                                                    >
                                                                                        <span className="TerapeftList_directions_button_cnt_in">
                                                                                            {directIttem.name}
                                                                                        </span>
                                                                                        <div
                                                                                            className="TerapeftList_directions_button_close"
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div className="TerapeftList_directions_button_modal_buttons">
                                                                        <div className="TerapeftList_directions_button_modal_buttons_point white" onClick={()=> this.clearFilter()}>Очистить</div>
                                                                        <div className="TerapeftList_directions_button_modal_buttons_point" onClick={() => this.handleModalSpecialties()}>Сохранить</div>
                                                                    </div>
                                                                </div>

                                                            </div>
                                                    }
                                                    <div className="TerapeftList_directions_button show-more" onClick={() => this.handleModalSpecialties()}/>
                                                </div>
                                                :
                                                <div className="TerapeftList_directions_button_cnt">
                                                    <div className="TerapeftList_directions_button_desct-cnt">
                                                        <div className="TerapeftList_directions_button_desct-cnt_active">
                                                            {
                                                                this.state.symptoms.length <= 0 ? null
                                                                    :
                                                                    this.state.dataJson.symptoms.filter(category => this.state.symptoms.includes(category.id)).map((directIttem) => {return (
                                                                        <div
                                                                            className={"TerapeftList_directions_button active"}
                                                                            key={directIttem.id}
                                                                            onClick={(event) => {
                                                                                this.handleCategories(directIttem.id);
                                                                                this.handleClick(event)
                                                                            }}
                                                                        >
                                                                            {directIttem.name}
                                                                            <div
                                                                                className="TerapeftList_directions_button_close"
                                                                            />
                                                                        </div>
                                                                    )})
                                                            }
                                                        </div>
                                                        <div className="TerapeftList_directions_button_desct-cnt_other">
                                                            {
                                                                this.state.symptoms.length < 3 ?
                                                                    this.state.dataJson.symptoms.filter(category => !this.state.symptoms.includes(category.id)).map((directIttem, index) => {
                                                                        if(index < 3 - this.state.symptoms.length) {
                                                                            return (
                                                                                <div
                                                                                    className={"TerapeftList_directions_button"}
                                                                                    key={directIttem.id}
                                                                                    onClick={(event) => {
                                                                                        this.handleCategories(directIttem.id);
                                                                                        this.handleClick(event)
                                                                                    }}
                                                                                >
                                                                                    {directIttem.name}
                                                                                    <div
                                                                                        className="TerapeftList_directions_button_close"
                                                                                    />
                                                                                </div>
                                                                            )
                                                                        }

                                                                    })
                                                                    : null

                                                            }
                                                        </div>
                                                    </div>
                                                    {
                                                        !this.state.specialtiesModal ? null
                                                            :
                                                            <div className="TerapeftList_directions_button_modal fade-in-2">
                                                                <div className="TerapeftList_directions_button_modal_wrap">
                                                                    <div className="TerapeftList_directions_button_modal_head" onClick={() => this.handleModalSpecialties()}>
                                                                        <div className="f-b h3">{ this.props.lang === 'ru' ? 'Фильтр по симптому' : 'Фiльтр за симптомом'}</div>
                                                                        <div className="doc-line_cancel_icon" />
                                                                    </div>
                                                                    <div
                                                                        className="TerapeftList_directions_button_modal_cat">
                                                                        {
                                                                            this.state.dataJson.symptoms.map((directIttem) => {
                                                                                return (
                                                                                    <div
                                                                                        className={this.state.symptoms.indexOf(directIttem.id) !== -1 ? "TerapeftList_directions_button active" : "TerapeftList_directions_button"}
                                                                                        key={directIttem.id}
                                                                                        onClick={(event) => {
                                                                                            this.handleCategories(directIttem.id);
                                                                                            this.handleClick(event)
                                                                                        }}
                                                                                    >
                                                                                        <span className="TerapeftList_directions_button_cnt_in">
                                                                                            {directIttem.name}
                                                                                        </span>
                                                                                        <div
                                                                                            className="TerapeftList_directions_button_close"
                                                                                        />
                                                                                    </div>
                                                                                )
                                                                            })
                                                                        }
                                                                    </div>
                                                                    <div className="TerapeftList_directions_button_modal_buttons">
                                                                        <div className="TerapeftList_directions_button_modal_buttons_point white"
                                                                             onClick={() => this.clearFilter()}>Очистить
                                                                        </div>
                                                                        <div className="TerapeftList_directions_button_modal_buttons_point"
                                                                            onClick={() => this.handleModalSpecialties()}>Сохранить
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                    }
                                                    <div className="TerapeftList_directions_button show-more" onClick={() => this.handleModalSpecialties()}/>
                                                    {/*{*/}
                                                    {/*    this.state.dataJson.symptoms.map((symptomIttem, index) => {*/}
                                                    {/*        return (*/}
                                                    {/*            index < this.state.maxSpecialties ?*/}
                                                    {/*                <div*/}
                                                    {/*                    className={this.state.symptoms.indexOf(String(symptomIttem.id)) !== -1 ? "TerapeftList_directions_button active" : "TerapeftList_directions_button"}*/}
                                                    {/*                    key={symptomIttem.id}*/}
                                                    {/*                    onClick={(event) => {*/}
                                                    {/*                        this.handleCategories(symptomIttem.id);*/}
                                                    {/*                        this.handleClick(event)*/}
                                                    {/*                    }}*/}
                                                    {/*                >*/}
                                                    {/*                    {symptomIttem.name}*/}
                                                    {/*                    <div className="TerapeftList_directions_button_close"/>*/}
                                                    {/*                </div>*/}
                                                    {/*                : null*/}

                                                    {/*        )*/}
                                                    {/*    })*/}
                                                    {/*}*/}
                                                </div>
                                        }

                                        <div className={`TerapeftList_directions_dd ${this.state.listOpen ? "open" : null}`}>
                                            <div className={`dd-header ${this.state.range.toLowerCase()}`} onClick={() => this.toggleList()}>
                                                <div className="dd-header-title m-w">
                                                    {this.state.dropdown.headerTitle}
                                                    <div className="dd-header-title-range">
                                                        <div className="dd-header-title-range_point down"/>
                                                        <div className="dd-header-title-range_point  up"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {

                                                this.state.listOpen ?
                                                    <div className="dd-list fade-in">
                                                        {
                                                            this.props.lang === 'ru' ?
                                                                this.state.dropdown.rows.map((item, index) => (
                                                                    <div
                                                                        className={this.state.dropdown.selected === index ? 'dd-list-item active' : 'dd-list-item'}
                                                                        onClick={() => this.dropdownClickItem(index, item.text, item.alias)}
                                                                        key={index}
                                                                    >{item.text}</div>
                                                                )) :
                                                                this.state.dropdown.rowsukr.map((item, index) => (
                                                                    <div
                                                                        className={this.state.dropdown.selected === index ? 'dd-list-item active' : 'dd-list-item'}
                                                                        onClick={() => this.dropdownClickItem(index, item.text, item.alias)}
                                                                        key={index}
                                                                    >{item.text}</div>
                                                                ))
                                                        }
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    <div className="TerapeftList_directions_mobile fade-in-2">
                                        {
                                            document.querySelector('html').setAttribute('style',
                                                this.state.mobileFilterOpen || this.state.mobileSortOpen ? 'overflow: hidden' : "")
                                        }
                                        <div className="TerapeftList_directions_mobile_line">
                                            {
                                                this.state.typeSort === 0 ?
                                                    <div className={`TerapeftList_directions_mobile_filter-show ${this.state.specialties.length > 0 ? ' active' : ''}`} onClick={() => this.handleModalSpecialties()}>
                                                        {
                                                                this.props.lang === 'ru' ? 'Фильтр' : 'Фiльтр'
                                                        }
                                                    </div>
                                                    :
                                                    <div className={`TerapeftList_directions_mobile_filter-show ${this.state.symptoms.length > 0 ? ' active' : ''}`} onClick={() => this.handleModalSpecialties()}>
                                                        {
                                                            this.props.lang === 'ru' ? 'Фильтр по симптому' : 'Фiльтр симптому'
                                                        }
                                                    </div>
                                            }

                                            <div className={"TerapeftList_directions_mobile_sort-show"} onClick={() => this.toggSort()}>
                                                <svg width="20" height="12" viewBox="0 0 20 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                    <path d="M4.06999 11.8366L0.178091 8.26556C-0.0593636 8.04769 -0.0593636 7.69434 0.178091 7.47646C0.415594 7.25854 0.8006 7.25854 1.0381 7.47646L3.89188 10.0949L3.89188 0.557968C3.89188 0.249836 4.16417 0 4.49999 0C4.83577 0 5.1081 0.249836 5.1081 0.557968L5.1081 10.0949L7.96188 7.47655C8.19939 7.25863 8.58439 7.25863 8.8219 7.47655C8.94055 7.58547 9 7.72831 9 7.8711C9 8.0139 8.94055 8.15669 8.8219 8.26565L4.93 11.8366C4.6925 12.0545 4.30749 12.0545 4.06999 11.8366Z" fill="#484848"/>
                                                    <path d="M15.07 0.163441L11.1781 3.73444C10.9406 3.95231 10.9406 4.30566 11.1781 4.52354C11.4156 4.74146 11.8006 4.74146 12.0381 4.52354L14.8919 1.90506V11.442C14.8919 11.7502 15.1642 12 15.5 12C15.8358 12 16.1081 11.7502 16.1081 11.442V1.90506L18.9619 4.52345C19.1994 4.74137 19.5844 4.74137 19.8219 4.52345C19.9406 4.41453 20 4.27169 20 4.1289C20 3.9861 19.9406 3.84331 19.8219 3.73435L15.93 0.163441C15.6925 -0.0544796 15.3075 -0.0544796 15.07 0.163441Z" fill="#484848"/>
                                                </svg>
                                            </div>
                                        </div>
                                        {/*{*/}
                                        {/*    this.state.mobileFilterOpen ?*/}
                                        {/*        <div className="TerapeftList_directions_mobile_filter fade-in">*/}
                                        {/*            <div className="TerapeftList_directions_mobile_filter_cnt">*/}
                                        {/*                <div className="TerapeftList_directions_mobile_filter_head">*/}
                                        {/*                    <div className="h3 f-w">{this.props.lang === 'ru' ? 'Фильтр' : 'Фiльтр'}</div>*/}
                                        {/*                    <div className="doc-line_cancel_icon" onClick={() => this.toggFilter()}></div>*/}
                                        {/*                </div>*/}
                                        {/*                <div className="TerapeftList_directions_mobile_filter_list">*/}
                                        {/*                    {*/}
                                        {/*                        this.state.dataJson.specialties.map((directIttem, index) => {*/}
                                        {/*                            return (*/}
                                        {/*                                <div*/}
                                        {/*                                    className={`TerapeftList_directions_mobile_filter_point ${specialties.indexOf(String(directIttem.alias)) !== -1 ? "active" : ""}`}*/}
                                        {/*                                    key={directIttem.id}*/}
                                        {/*                                    onClick={(event) => {*/}
                                        {/*                                        this.handleCategories(directIttem.alias);*/}
                                        {/*                                        this.handleClick(event)*/}
                                        {/*                                    }}*/}
                                        {/*                                >*/}
                                        {/*                                    <div className="TerapeftList_directions_mobile_filter_point_cnt">*/}
                                        {/*                                        {directIttem.name}*/}
                                        {/*                                        <div className="TerapeftList_directions_mobile_filter_point_check"/>*/}
                                        {/*                                    </div>*/}

                                        {/*                                </div>*/}
                                        {/*                            )*/}
                                        {/*                        })*/}
                                        {/*                    }*/}

                                        {/*                </div>*/}
                                        {/*                <div className="TerapeftList_directions_mobile_filter_foot">*/}
                                        {/*                    <div className="TerapeftList_directions_mobile_filter_foot_point" onClick={() => this.clearFilter()}>{this.props.lang === 'ru' ? 'Сбросить' : 'Скинути'}</div>*/}
                                        {/*                    <div className="TerapeftList_directions_mobile_filter_foot_point f-w show" onClick={() => this.toggFilter()}>{this.props.lang === 'ru' ? 'Показать' : 'Показати'} ({this.state.dataJson.total_doctors})</div>*/}
                                        {/*                </div>*/}
                                        {/*            </div>*/}

                                        {/*        </div> : null*/}
                                        {/*}*/}
                                        {
                                            this.state.mobileSortOpen ?
                                                <div className="TerapeftList_directions_mobile_filter fade-in">
                                                    <div className="TerapeftList_directions_mobile_filter_cnt">
                                                        <div className="TerapeftList_directions_mobile_filter_head"  onClick={() => this.toggSort()}>
                                                            <div className="h3 f-b">{this.props.lang === 'ru' ? 'Сортировка' : 'Cортування'}</div>
                                                            <div className="doc-line_cancel_icon"></div>

                                                        </div>
                                                        {

                                                            this.props.lang === 'ru' ?
                                                                this.state.dropdown.rows.map((item, index) => (
                                                                    <div
                                                                        className={`TerapeftList_directions_mobile_filter_point ${this.state.dropdown.selected === index ? "active" : ""}`}
                                                                        onClick={() => {
                                                                            this.dropdownClickItem(index, item.text, item.alias);
                                                                            this.toggSort()
                                                                        }}
                                                                        key={index}
                                                                    >
                                                                        <div
                                                                            className="TerapeftList_directions_mobile_filter_point_cnt sort">
                                                                            {item.text}
                                                                            <div className={`dd-header-title-range ${this.state.range.toLowerCase()}`}>
                                                                                <span className="dd-header-title-range_text">{this.state.range.toLowerCase() === 'desc' ? 'По убыванию' : 'По возрастанию'}</span>
                                                                                <div className="dd-header-title-range_point down"/>
                                                                                <div className="dd-header-title-range_point  up"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )) :
                                                                this.state.dropdown.rowsukr.map((item, index) => (
                                                                    <div
                                                                        className={`TerapeftList_directions_mobile_filter_point ${this.state.dropdown.selected === index ? "active" : ""}`}
                                                                        onClick={() => {
                                                                            this.dropdownClickItem(index, item.text, item.alias);
                                                                            this.toggSort()
                                                                        }}
                                                                        key={index}
                                                                    >
                                                                        <div
                                                                            className="TerapeftList_directions_mobile_filter_point_cnt sort">
                                                                            {item.text}
                                                                            <div
                                                                                className={`dd-header-title-range ${this.state.range.toLowerCase()}`}>
                                                                                <span className="dd-header-title-range_text">{this.state.range.toLowerCase() === 'desc' ? 'За спаданням' : 'За зростанням'}</span>
                                                                                <div
                                                                                    className="dd-header-title-range_point down"/>
                                                                                <div
                                                                                    className="dd-header-title-range_point  up"/>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                ))
                                                        }

                                                    </div>
                                                </div> : null
                                        }
                                        <div className={`TerapeftList_directions_dd ${this.state.listOpen ? "open" : ""}`}>
                                            <div className={`dd-header ${this.state.range.toLowerCase()}`} onClick={() => this.toggleList()}>
                                                <div className="dd-header-title m-w">
                                                    {this.state.dropdown.headerTitle}
                                                    <div className="dd-header-title-range">
                                                        <div className="dd-header-title-range_point down"/>
                                                        <div className="dd-header-title-range_point  up"/>
                                                    </div>
                                                </div>
                                            </div>
                                            {
                                                this.state.listOpen ?
                                                    <div className="dd-list fade-in">
                                                        {this.state.dropdown.rows.map((item, index) => (
                                                            <div
                                                                className={this.state.dropdown.selected === index ? 'dd-list-item active' : 'dd-list-item'}
                                                                onClick={()=> this.dropdownClickItem(index, item.text, item.alias)}
                                                                key={index}
                                                            >{item.text}</div>
                                                        ))}
                                                    </div>
                                                    : null
                                            }
                                        </div>
                                    </div>
                                    {
                                        this.state.dataJson.doctors.map((offers) => {


                                            return (
                                                +offers.id !== 32168 && +offers.id !== 33252 && +offers.id !== 33678 ?
                                                <TerapeftListCard
                                                    key={offers.id + this.props.lang}
                                                    img={offers.img}
                                                    name={offers.name}
                                                    nameOther={offers.nameOther}
                                                    specialties={offers.specialties}
                                                    price={offers.price}
                                                    short_about={offers.short_about}
                                                    link={this.props.webInfo === 1 ? '' : offers.link}
                                                    category_name={offers.category_name}
                                                    year={offers.experience}
                                                    alias={offers.alias}
                                                    id={offers.id}
                                                    rate={offers.rate}
                                                    affiliates={offers.affiliates[0]}
                                                    review_count={offers.review_count}
                                                    webInfo={this.props.webInfo}
                                                    domainName={this.props.domainName}
                                                    lang={this.props.lang}
                                                />
                                                    : null
                                            )


                                        })
                                    }
                                    {
                                        this.state.loadDoctors.length < 1  ? null
                                            :
                                            this.state.loadDoctors.map((offers) => {
                                                return (
                                                    <TerapeftListCard
                                                        key={offers.id + this.props.lang}
                                                        img={offers.img}
                                                        name={offers.name}
                                                        nameOther={offers.nameOther}
                                                        specialties={offers.specialties}
                                                        price={offers.price}
                                                        short_about={offers.short_about}
                                                        link={this.props.webInfo === 1 ? '' : offers.link}
                                                        category_name={offers.category_name}
                                                        year={offers.experience}
                                                        alias={offers.alias}
                                                        id={offers.id}
                                                        rate={offers.rate}
                                                        affiliates={offers.affiliates[0]}
                                                        review_count={offers.review_count}
                                                        webInfo={this.props.webInfo}
                                                        domainName={this.props.domainName}
                                                        lang={this.props.lang}
                                                    />
                                                )

                                            })
                                    }
                                    {
                                        Math.ceil(this.state.dataJson.total_doctors/10) !== 1 ?
                                            <div className="Pagination-sec fade-in">

                                                <div className="pager-all">
                                                    <div className="load-items" onClick={() => this.showMoreDoctors()}>
                                                        {
                                                            this.state.dataJson.total_doctors > 10*this.state.page ?
                                                                <>
                                                                    <span>{this.props.lang === 'ru' ? 'Показать еще' : 'Показати ще'} {this.state.dataJson.total_doctors - 10*this.state.page > 10 ? 10 : this.state.dataJson.total_doctors - 10*this.state.page } {this.props.lang === 'ru' ? 'врачей' : 'лiкарiв'}</span>
                                                                    <svg className="load-items_svg" width="22" height="16" viewBox="0 0 22 16"><path id="update" d="M 18 4L 14 8L 17 8C 17 11.31 14.31 14 11 14C 9.99 14 9.03 13.75 8.2 13.3L 6.74 14.76C 7.97 15.54 9.43 16 11 16C 15.42 16 19 12.42 19 8L 22 8L 18 4ZM 5 8C 5 4.69 7.69 2 11 2C 12.01 2 12.97 2.25 13.8 2.7L 15.26 1.24C 14.03 0.46 12.57 0 11 0C 6.58 0 3 3.58 3 8L 0 8L 4 12L 8 8L 5 8Z" fill="#333536"/></svg>
                                                                </>
                                                                : null
                                                        }

                                                    </div>
                                                </div>
                                                <div className="pager">
                                                    <ul className="Pagination"  id="yw0">
                                                        <div className="Pagination_point prev" onClick={() => this.arrovPage(0)}/>
                                                        {/*{[...Array(6)].map((_,index) => (*/}
                                                        {[...Array(Math.ceil(this.state.dataJson.total_doctors / 10))].map((_, index) => (
                                                            index + 1 >= (this.state.page + 5 > Math.ceil(this.state.dataJson.total_doctors / 10) ? this.state.page - 5 : this.state.page-1)
                                                            &&
                                                            index < (this.state.page + 5 > Math.ceil(this.state.dataJson.total_doctors / 10) ? Math.ceil(this.state.dataJson.total_doctors / 10) : this.state.page + 5) ?
                                                                <div
                                                                    className={`Pagination_point ${index + 1 === this.state.page || this.state.tempPage.indexOf(index + 1) !== -1 ? 'active' : ""} ${index === (this.state.page + 5 > Math.ceil(this.state.dataJson.total_doctors / 10 ) ? Math.ceil(this.state.dataJson.total_doctors / 10) : this.state.page + 5) - 3 ? 'middle' : ""}`}
                                                                    key={index}
                                                                    onClick={() => this.changePage(index + 1)}
                                                                >{index + 1}</div>
                                                                : null
                                                        ))}


                                                        <div className="Pagination_point next"
                                                             onClick={() => this.arrovPage(1)}/>
                                                    </ul>
                                                </div>
                                            </div>
                                            : null
                                    }

                                    {/*<Pagination/>*/}
                                </div>
                            </div>
                }
            </section>
        )
    }
}

export default TerapeftList
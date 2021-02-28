import React from 'react'
import {NavLink} from 'react-router-dom';
import HeaderLinksOuter from './HeaderLinksOuter'
// import HeaderLocal from './HeaderLocal'

import './Header.scss'

import logo from '../../img/logo_doc.svg'
import logoOnline from '../../img/logo_doc_online.svg'
// import user from '../../img/user.svg'
// import {Link} from "react-scroll";
import {HashLink as Link} from 'react-router-hash-link'
// import HeaderLinks from "./Header";


const Headerform = props => {
    const cls = [
        'Header'
    ];
    const linksArr = [
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#how-book`, text: 'Как заказать'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#express`, text: 'Врачи'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#review`, text: 'Отзывы'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#questions`, text: 'Вопросы'}
    ];
    const linksArrUkr = [
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#how-book`, text: 'Як замовити'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#express`, text: 'Лікарі'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#review`, text: 'Відгуки'},
        {href: `${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#questions`, text: 'Запитання'}
    ];
    if (props.isOpen) {
        cls.push('toggled')
    } else {
        cls.push('')
    }
    return (
        <header className={`Header ${props.noScroll ? props.scrollClass : 'scroll'} ${props.isOpen ? "toggled" : ""} `}
                id='head'
        >
            <div className="container ">
                <div className="Header_container">
                    <NavLink to={`${props.domainName === 'audio.doc.online' ? '' : '/audio'}`} className={'logo'}>
                        <img src={props.domainName === 'audio.doc.online' ? logoOnline : logo} alt="logo"/>
                    </NavLink>
                    <HeaderLinksOuter
                        linksArr={props.lang === 'ru' ?  linksArr : linksArrUkr}
                    />
                    {/*<div className="Header_login">*/}
                    {/*<img src={user} alt="user"/>*/}
                    {/*Войти*/}
                    {/*</div>*/}
                    {/*<HeaderLocal/>*/}

                    <Link to={`${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#express`} className="consultation">{props.lang === 'ru' ?  "Заказать консультацию" : "Замовити консультацію"}</Link>
                    <div id="menu-toggle" className="button"
                         onClick={props.onToggle}
                    >
                        <span className="sr">Toggle Navigation</span>
                        <span className="menu-bar bar1"/>
                        <span className="menu-bar bar2"/>
                        <span className="menu-bar bar3"/>
                    </div>
                </div>
                <div className="Header_menu-mob fade-in">
                    <HeaderLinksOuter
                        onClickToggle={props.onToggle}
                        linksArr={props.lang === 'ru' ?  linksArr : linksArrUkr}
                    />
                    {/*<div className="Header_login" onClick={this.props.onToggle}>*/}
                    {/*<img src={user} alt="user"/>*/}
                    {/*Войти*/}
                    {/*</div>*/}
                    {/*<HeaderLocal onClickToggle={this.props.onToggle}/>*/}
                    <Link to={`${props.domainName === 'audio.doc.online' ? '' : '/audio'}/#express`} className="consultation">{props.lang === 'ru' ?  "Заказать консультацию" : "Замовити консультацію"}</Link>
                </div>

            </div>

        </header>
    )
}

export default Headerform
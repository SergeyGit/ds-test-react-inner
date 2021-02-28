import React from 'react'
// import { NavLink} from 'react-router-dom';
import HeaderLinks from './HeaderLinks'
// import HeaderLocal from './HeaderLocal'

import './Header.scss'

import logo from '../../img/logo_doc.svg'
import logoOnline from '../../img/logo_doc_online.svg'

// import user from '../../img/user.svg'
import {Link} from "react-scroll";
import HeaderLocal from "./HeaderLocal";

const Header = props => {
    const cls = [
        'Header'
    ];
    const linksArr = [
        {href: 'how-book', text: 'Как заказать'},
        {href: 'express', text: 'Врачи'},
        {href: 'review', text: 'Отзывы'},
        {href: 'questions', text: 'Вопросы'}
    ];
    const linksArrUkr = [
        {href: 'how-book', text: 'Як замовити'},
        {href: 'express', text: 'Лікарі'},
        {href: 'review', text: 'Відгуки'},
        {href: 'questions', text: 'Запитання'}
    ];
    if (props.isOpen) {
        cls.push('toggled')
    } else {
        cls.push('')
    }
    return (
        <header className={cls.join(' ') + props.scrollClass} id='head'>
            <div className="container ">
                <div className="Header_container">
                    <a href={`${props.domainName === 'audio.doc.online' ? 'https://doc.online/' : 'https://doc.ua/'}`}  className={'logo'} title={`${props.domainName === 'audio.doc.online' ? 'doc.online' : 'doc.ua'}`}>
                        <img src={props.domainName === 'audio.doc.online' ? logoOnline : logo} alt="logo"/>
                    </a>
                    <HeaderLinks
                        linksArr={props.lang === 'ru' ?  linksArr : linksArrUkr}

                    />
                    {/*<div className="Header_login">*/}
                        {/*<img src={user} alt="user"/>*/}
                        {/*Войти*/}
                    {/*</div>*/}
                    {
                        props.domainName === 'audio.doc.online' ? null
                            :
                            <HeaderLocal
                                lang={props.lang}
                            />
                    }


                    <Link to={'express'} smooth={true} offset={-80} duration={500} className="consultation">{props.lang === 'ru' ?  "Заказать консультацию" : "Замовити консультацію"}</Link>
                    <div id="menu-toggle" className="button"
                         onClick={props.onToggle}
                    >
                        <span className="sr">Toggle Navigation</span>
                        <span className="menu-bar bar1"/>
                        <span className="menu-bar bar2"/>
                        <span className="menu-bar bar3"/>
                    </div>
                </div>
                <div className="Header_menu-mob fade-in" >
                    <HeaderLinks
                        linksArr={props.lang === 'ru' ?  linksArr : linksArrUkr}
                        onClickToggle={props.onToggle}
                    />
                    {/*<div className="Header_login" onClick={props.onToggle}>*/}
                        {/*<img src={user} alt="user"/>*/}
                        {/*Войти*/}
                    {/*</div>*/}
                    {
                        props.domainName === 'audio.doc.online' ? null
                            :
                            <HeaderLocal onClickToggle={props.onToggle} lang={props.lang}/>
                    }

                    <Link to={'express'} smooth={true} offset={-80} duration={500}  onClick={props.onToggle} className="consultation">{props.lang === 'ru' ?  "Заказать консультацию" : "Замовити консультацію"}</Link>
                </div>

            </div>

        </header>
    )
}
export default Header
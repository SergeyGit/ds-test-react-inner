import React from 'react'
import { NavLink} from 'react-router-dom';
import HeaderLinksOuter from './HeaderLinksOuter'
// import HeaderLocal from './HeaderLocal'

import './Header.scss'

import logo from '../../img/logo_doc.svg'
// import user from '../../img/user.svg'
// import {Link} from "react-scroll";
import { HashLink as Link } from 'react-router-hash-link'

const Header = props => {
    const cls = [
        'Header'
    ];
    const linksArr = [
        {href: '/audio/#symptoms', text: 'Темы консультаций'},
        {href: '/audio/#how-book', text: 'Как заказать'},
        {href: '/audio/#express', text: 'Врачи'},
        {href: '/audio/#review', text: 'Отзывы'},
        {href: '/audio/#questions', text: 'Вопросы'}
    ];
    if (props.isOpen) {
        cls.push('toggled')
    } else {
        cls.push('')
    }
    return (
        <header className={cls.join(' ')}>
            <div className="container ">
                <div className="Header_container">
                    <NavLink to={'/audio'} className={'logo'}>
                        <img src={logo} alt="logo"/>
                    </NavLink>
                    <HeaderLinksOuter
                        linksArr ={linksArr}
                    />
                    {/*<div className="Header_login">*/}
                        {/*<img src={user} alt="user"/>*/}
                        {/*Войти*/}
                    {/*</div>*/}
                    {/*<HeaderLocal/>*/}

                    <Link to={'/audio/#express'} className="consultation">Заказать консультацию</Link>
                    <div id="menu-toggle" className="button"
                         onClick={props.onToggle}
                    >
                        <span className="sr">Toggle Navigation</span>
                        <span className="menu-bar bar1"></span>
                        <span className="menu-bar bar2"></span>
                        <span className="menu-bar bar3"></span>
                    </div>
                </div>
                <div className="Header_menu-mob fade-in" >
                    <HeaderLinksOuter
                        onClickToggle={props.onToggle}
                        linksArr ={linksArr}
                    />
                    {/*<div className="Header_login" onClick={props.onToggle}>*/}
                        {/*<img src={user} alt="user"/>*/}
                        {/*Войти*/}
                    {/*</div>*/}
                    {/*<HeaderLocal onClickToggle={props.onToggle}/>*/}
                    <Link to={'/audio/#express'} className="consultation">Заказать консультацию</Link>
                </div>

            </div>

        </header>
    )
}
export default Header
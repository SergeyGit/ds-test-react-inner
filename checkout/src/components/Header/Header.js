import React from 'react'
import './Header.scss'
import logo from '../../img/logo-docua.svg'
import iconOnline from '../../img/audio-ico.svg'

const Header = props => {
    const cls = [
        'Header'
    ];
    if (props.isOpen) {
        cls.push('toggled')
    } else {
        cls.push('')
    }
    return (
        <header className={'header'}>
            <div className="container ">
                <a href="https://doc.ua" title="Doc.ua" className="logo">
                    <img src={logo} alt="logo" className="logo__image"/>
                </a>
                <a href="https://doc.ua/audio/" className="audio_link">Врач онлайн
                    <img src={iconOnline} alt="icon"/>
                </a>

                {/*<div className="header__panel">*/}
                {/*    <div className="phones">*/}
                {/*        <a href="tel:+38044337-07-07" className="phones__info">+38 (044) 337-07-07 </a>*/}
                {/*        <div className="drop">*/}
                {/*            <div className="drop__toggler">*/}
                {/*                <span className="i i--phones"></span><span className="i i--drop"></span>*/}
                {/*            </div>*/}
                {/*            <div className="drop__body">*/}
                {/*                <ul className="phones__list">*/}
                {/*                    <li className="phones__item first-child">*/}
                {/*                        <a href="tel:+38044337-07-07" className="phones__link">*/}
                {/*                            <i className="i icon-call"></i><span className="phones__value">+38 (044) 337-07-07</span>*/}
                {/*                        </a>*/}
                {/*                    </li>*/}
                {/*                    <li className="phones__item">*/}
                {/*                        <a href="tel:+380633370707" className="phones__link">*/}
                {/*                            <i className="i icon-life"></i><span className="phones__value">+38 (063) 337-07-07</span>*/}
                {/*                        </a>*/}
                {/*                    </li>*/}
                {/*                    <li className="phones__item">*/}
                {/*                        <a href="tel:+380673370707" className="phones__link">*/}
                {/*                            <i className="i icon-kievstar"></i><span className="phones__value">+38 (067) 337-07-07</span>*/}
                {/*                        </a>*/}
                {/*                    </li>*/}
                {/*                    <li className="phones__item last-child">*/}
                {/*                        <a href="tel:+380953370707" className="phones__link">*/}
                {/*                            <i className="i icon-mts"></i><span className="phones__value">+38 (095) 337-07-07</span>*/}
                {/*                        </a>*/}
                {/*                    </li>*/}
                {/*                </ul>*/}
                {/*            </div>*/}
                {/*        </div>*/}
                {/*    </div>*/}

                {/*</div>*/}
            </div>

        </header>
    )
}
export default Header
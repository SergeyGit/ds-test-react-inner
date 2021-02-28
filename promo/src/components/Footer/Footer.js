import React from 'react'
import './Footer.scss'



const Footer = (props) => {
    // state = {
    //     arrCity: this.props.dataState.citiesList.find(e=> +e.id === +this.props.dataState.city)
    // }
        return (
            <footer className={`Footer footer ${props.checkout ? "chk" : ""}`}>
                        <div className="container flex_container_js">
                            <div className="ft-bottom">
                                <div className="ft-copy">
                                    ©&nbsp;<a href="https://doc.ua" title="Doc.ua">Doc.ua</a>,
                                    {props.uaProp ? " 2021 Використання матеріалів дозволено тільки при наявності активного посилання на джерело" : " 2021 Использование материалов разрешено только при наличии активной ссылки на источник"}
                                </div>
                                <div className="ft-social">
                                    <ul>
                                        <li className="ft-social__item first-child">
                                            <a href="https://www.facebook.com/myDocUA" title="Doc.ua в Фейсбуке" target="_blank"
                                               rel="noopener noreferrer"
                                               className="ft-social__link i-fb">
                                                <i className="icon-facebook"></i>
                                            </a>
                                        </li>
                                        <li className="ft-social__item">
                                            <a href="https://plus.google.com/+DocUa-Find_a_Doctor?rel=author"
                                               title="Doc.ua в Google PLus" target="_blank" rel="noopener noreferrer"
                                               className="ft-social__link i-goog">
                                                <i className="icon-google"></i>
                                            </a>
                                        </li>
                                        <li className="ft-social__item">
                                            <a href="https://www.instagram.com/doc.ua_official/?hl=ru"
                                               title="Doc.ua в Instagram" target="_blank" rel="noopener noreferrer"
                                               className="ft-social__link i-insta">
                                                <i className="icon-insta"></i>
                                            </a>
                                        </li>

                                        <li className="ft-social__item">
                                            <a href="https://chats.viber.com/docua/en" title="Doc.ua в Instagram"
                                               target="_blank" rel="noopener noreferrer" className="ft-social__link i-insta">
                                                <i className="icon-phone-call"></i>
                                            </a>
                                        </li>
                                        <li className="ft-social__item">
                                            <a href="https://t.me/docua/229" title="Doc.ua в Instagram" target="_blank"
                                               rel="noopener noreferrer"
                                               className="ft-social__link i-insta">
                                                <i className="icon-telegram"></i>
                                            </a>
                                        </li>
                                        <li className="ft-social__item last-child">
                                            <a href="https://www.youtube.com/user/myDocUA" title="Doc.ua в Instagram"
                                               target="_blank" rel="noopener noreferrer" className="ft-social__link i-insta">
                                                <i className="icon-youtube"></i>
                                            </a>
                                        </li>

                                    </ul>
                                </div>
                            </div>
                        </div>

            </footer>
        )
}
export default Footer


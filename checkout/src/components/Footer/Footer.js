import React from 'react'
import './Footer.scss'
import {Link} from "react-scroll";
import logoColor from '../../img/logo_doc_color.svg'

const Footer = props => {

    return (
        <footer className={'Footer'}>
            <div className="container">
                <div className="Footer_container">
                    <a href="/" className="logo">
                        <img src={logoColor} alt="logo"/>
                    </a>
                    <a target="_blank" rel="noreferrer noopener" href="/privacy-policy.pdf" className={'Footer_link'}>Политика конфиденциальности</a>
                    <a target="_blank" rel="noreferrer noopener" href="/public-contract.pdf" className={'Footer_link'}>Публичный договор</a>
                    <div className="Footer_soc">
                        <a href="https://www.facebook.com/myDocUA" className="Footer_soc_link" target="_blank" rel="noreferrer noopener">
                            <svg width="10" height="16" viewBox="0 0 10 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M6.23896 16V8.70218H8.68755L9.05491 5.85725H6.23896V4.04118C6.23896 3.21776 6.46667 2.65661 7.64879 2.65661L9.15402 2.65599V0.111384C8.89371 0.0775563 8.00016 0 6.96017 0C4.78849 0 3.30172 1.32557 3.30172 3.75942V5.85725H0.845703V8.70218H3.30172V16H6.23896Z" fill="#2C1F9C"/>
                            </svg>
                        </a>
                        <a href="https://www.instagram.com/doc.ua_official/?hl=ru" className="Footer_soc_link" target="_blank" rel="noreferrer noopener">
                            <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M12.3084 0H4.69126C2.1045 0 0 2.1046 0 4.69136V12.3085C0 14.8954 2.1045 16.9999 4.69126 16.9999H12.3084C14.8954 16.9999 16.9999 14.8953 16.9999 12.3085V4.69136C17 2.1046 14.8954 0 12.3084 0ZM15.4917 12.3085C15.4917 14.0637 14.0637 15.4916 12.3085 15.4916H4.69126C2.93618 15.4917 1.50831 14.0637 1.50831 12.3085V4.69136C1.50831 2.93628 2.93618 1.50831 4.69126 1.50831H12.3084C14.0636 1.50831 15.4916 2.93628 15.4916 4.69136V12.3085H15.4917Z" fill="#2C1F9C"/>
                                <path d="M8.50007 4.11963C6.08466 4.11963 4.11963 6.08466 4.11963 8.50007C4.11963 10.9154 6.08466 12.8803 8.50007 12.8803C10.9155 12.8803 12.8805 10.9154 12.8805 8.50007C12.8805 6.08466 10.9155 4.11963 8.50007 4.11963ZM8.50007 11.3719C6.91644 11.3719 5.62794 10.0836 5.62794 8.49997C5.62794 6.91624 6.91634 5.62784 8.50007 5.62784C10.0838 5.62784 11.3722 6.91624 11.3722 8.49997C11.3722 10.0836 10.0837 11.3719 8.50007 11.3719Z" fill="#2C1F9C"/>
                                <path d="M13.0641 2.84082C12.7735 2.84082 12.488 2.95847 12.2828 3.16461C12.0766 3.36974 11.958 3.65531 11.958 3.94692C11.958 4.23762 12.0767 4.52309 12.2828 4.72923C12.4879 4.93436 12.7735 5.05301 13.0641 5.05301C13.3557 5.05301 13.6403 4.93436 13.8464 4.72923C14.0525 4.52309 14.1702 4.23752 14.1702 3.94692C14.1702 3.65531 14.0525 3.36974 13.8464 3.16461C13.6413 2.95847 13.3557 2.84082 13.0641 2.84082Z" fill="#2C1F9C"/>
                            </svg>
                        </a>
                        <a href="https://twitter.com/doc__ua" className="Footer_soc_link" target="_blank" rel="noreferrer noopener">
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" target="_blank" rel="noreferrer noopener">
                                <path d="M16 2.03941C15.4111 2.30035 14.7792 2.47732 14.1153 2.55632C14.7932 2.15039 15.3121 1.50652 15.558 0.741657C14.9222 1.11758 14.2203 1.39055 13.4724 1.53852C12.8735 0.899644 12.0217 0.501709 11.0769 0.501709C9.26421 0.501709 7.79448 1.97143 7.79448 3.78309C7.79448 4.04004 7.82348 4.29099 7.87948 4.53096C5.152 4.39397 2.73346 3.08723 1.11477 1.10158C0.831817 1.5855 0.67085 2.14937 0.67085 2.75128C0.67085 3.89008 1.25075 4.89489 2.13059 5.48276C1.59268 5.46477 1.08677 5.31679 0.643869 5.07083V5.11183C0.643869 6.70153 1.77566 8.02827 3.27637 8.33023C3.00141 8.40422 2.71148 8.44521 2.41153 8.44521C2.19958 8.44521 1.99461 8.42422 1.79365 8.38422C2.21156 9.68898 3.42335 10.6378 4.85909 10.6638C3.73629 11.5436 2.32055 12.0665 0.78285 12.0665C0.517909 12.0665 0.256941 12.0505 0 12.0216C1.45273 12.9544 3.17741 13.4983 5.03106 13.4983C11.0689 13.4983 14.3693 8.49721 14.3693 4.16004L14.3583 3.73512C15.0032 3.27517 15.561 2.69729 16 2.03941Z" fill="#2C1F9C"/>
                            </svg>
                        </a>
                        <a href="https://t.me/docua" className="Footer_soc_link" target="_blank" rel="noreferrer noopener">
                            <svg width="16" height="14" viewBox="0 0 16 14" fill="none" xmlns="http://www.w3.org/2000/svg" target="_blank" rel="noreferrer noopener">
                                <path d="M6.27812 9.12061L6.01345 12.8433C6.39212 12.8433 6.55612 12.6806 6.75278 12.4853L8.52812 10.7886L12.2068 13.4826C12.8815 13.8586 13.3568 13.6606 13.5388 12.8619L15.9535 1.54728L15.9541 1.54661C16.1681 0.549278 15.5935 0.159278 14.9361 0.403945L0.742785 5.83795C-0.225881 6.21395 -0.211215 6.75395 0.578119 6.99861L4.20678 8.12728L12.6355 2.85328C13.0321 2.59061 13.3928 2.73595 13.0961 2.99861L6.27812 9.12061Z" fill="#2C1F9C"/>
                            </svg>
                        </a>
                        <a href="https://www.youtube.com/user/myDocUA" className="Footer_soc_link" target="_blank" rel="noreferrer noopener">
                            <svg width="14" height="16" viewBox="0 0 14 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M13.5197 8.10016C13.3543 7.38183 12.7668 6.85195 12.0595 6.77308C10.3852 6.58604 8.6897 6.58516 7.00248 6.58604C5.31455 6.58516 3.61939 6.58604 1.94452 6.77308C1.23766 6.85213 0.650436 7.38201 0.485278 8.10016C0.249894 9.12304 0.24707 10.2396 0.24707 11.2929C0.24707 12.3461 0.24707 13.4625 0.482455 14.4854C0.647613 15.2035 1.23484 15.7334 1.94205 15.8125C3.61657 15.9997 5.31173 16.0004 6.99948 15.9997C8.6874 16.0006 10.3822 15.9997 12.0573 15.8125C12.7641 15.7334 13.3517 15.2035 13.5169 14.4854C13.7521 13.4625 13.7533 12.3461 13.7533 11.2929C13.7531 10.2394 13.7549 9.12304 13.5197 8.10016ZM4.09951 8.89295H3.12198V14.0873H2.21396V8.89295H1.25425V8.04211H4.09951V8.89295ZM6.56576 14.0875H5.74897V13.5961C5.42448 13.968 5.1164 14.1494 4.81626 14.1494C4.55317 14.1494 4.37213 14.0428 4.29043 13.8147C4.24597 13.6785 4.21844 13.4628 4.21844 13.1449V9.58305H5.03453V12.8994C5.03453 13.0907 5.03453 13.1901 5.04194 13.2169C5.06152 13.3436 5.12346 13.4078 5.23286 13.4078C5.3966 13.4078 5.56776 13.2816 5.7488 13.0256V9.58305H6.56559L6.56576 14.0875ZM9.66653 12.7355C9.66653 13.1521 9.63847 13.4523 9.58395 13.6432C9.4749 13.9783 9.25663 14.1494 8.93196 14.1494C8.64153 14.1494 8.36132 13.9881 8.08835 13.6511V14.0877H7.27227V8.04211H8.08835V10.0164C8.35197 9.69192 8.63182 9.52782 8.93196 9.52782C9.25663 9.52782 9.47508 9.6988 9.58395 10.036C9.63882 10.2172 9.66653 10.5151 9.66653 10.9415V12.7355ZM12.7468 11.984H11.1145V12.7824C11.1145 13.1994 11.2509 13.4076 11.5314 13.4076C11.7324 13.4076 11.8494 13.2984 11.896 13.0803C11.9036 13.036 11.9143 12.8546 11.9143 12.5273H12.747V12.6464C12.747 12.9095 12.7369 13.0907 12.7295 13.1722C12.7022 13.3529 12.638 13.5168 12.539 13.6612C12.3129 13.9883 11.978 14.1496 11.5517 14.1496C11.1247 14.1496 10.7997 13.9959 10.5638 13.6883C10.3907 13.4628 10.3017 13.1078 10.3017 12.6291V11.0515C10.3017 10.5699 10.3806 10.2177 10.5541 9.99012C10.7898 9.68186 11.1147 9.52835 11.5316 9.52835C11.9411 9.52835 12.2658 9.68186 12.4945 9.99012C12.6655 10.2177 12.7472 10.5699 12.7472 11.0515V11.984H12.7468Z" fill="#2C1F9C"/>
                                <path d="M11.5243 10.2627C11.2515 10.2627 11.1147 10.4711 11.1147 10.8875V11.3043H11.9308V10.8875C11.9307 10.4711 11.7943 10.2627 11.5243 10.2627Z" fill="#2C1F9C"/>
                                <path d="M8.49545 10.2627C8.36099 10.2627 8.22477 10.3262 8.08838 10.4612V13.2066C8.2246 13.3432 8.36099 13.4077 8.49545 13.4077C8.73083 13.4077 8.85046 13.2066 8.85046 12.7999V10.8773C8.85046 10.4711 8.73083 10.2627 8.49545 10.2627Z" fill="#2C1F9C"/>
                                <path d="M8.9512 6.17037C9.25205 6.17037 9.56507 5.98757 9.89345 5.61138V6.10791H10.7184V1.55566H9.89345V5.03491C9.71064 5.29324 9.53737 5.42099 9.37239 5.42099C9.26193 5.42099 9.197 5.3557 9.179 5.22778C9.16894 5.20078 9.16894 5.10038 9.16894 4.90716V1.55566H8.34668V5.15525C8.34668 5.47675 8.37421 5.69431 8.41973 5.83212C8.50266 6.06274 8.68564 6.17037 8.9512 6.17037Z" fill="#2C1F9C"/>
                                <path d="M3.20837 3.63453V6.10854H4.12309V3.63453L5.22344 0H4.29848L3.67438 2.39884L3.02504 0H2.0625C2.25536 0.56623 2.45598 1.13528 2.64885 1.70204C2.94228 2.55394 3.12544 3.19622 3.20837 3.63453Z" fill="#2C1F9C"/>
                                <path d="M6.44952 6.17074C6.86277 6.17074 7.18391 6.01529 7.41171 5.70473C7.58481 5.47694 7.66774 5.11804 7.66774 4.63421V3.04015C7.66774 2.5535 7.58498 2.19778 7.41171 1.96786C7.18391 1.65643 6.86295 1.50098 6.44952 1.50098C6.03839 1.50098 5.71743 1.65643 5.4891 1.96786C5.31389 2.19778 5.23096 2.5535 5.23096 3.04015V4.63421C5.23096 5.11804 5.31389 5.47694 5.4891 5.70473C5.71725 6.01529 6.03839 6.17074 6.44952 6.17074ZM6.05586 2.87482C6.05586 2.45363 6.18361 2.24366 6.44952 2.24366C6.71544 2.24366 6.84283 2.45346 6.84283 2.87482V4.78966C6.84283 5.21085 6.71544 5.42153 6.44952 5.42153C6.18361 5.42153 6.05586 5.21085 6.05586 4.78966V2.87482Z" fill="#2C1F9C"/>
                            </svg>
                        </a>
                        <Link to={'express'} smooth={true} offset={-80} duration={500} className="Footer_soc_link-button">Заказать консультацию</Link>
                    </div>
                </div>
            </div>
        </footer>
    )

}

export default Footer


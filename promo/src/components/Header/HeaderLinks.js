import React, {Component} from 'react'

import { Link } from "react-scroll"

const linksArr = [
    {href: 'first', text: 'Темы консультаций'},
    {href: 'SecondSection', text: 'Как это работает'},
    {href: 'expres', text: 'Врачи'},
    {href: 'otziv', text: 'Отзывы'},
    {href: 'vopros', text: 'Вопросы'}
]
class HeaderLinks extends Component {

    renderLinks() {
        return linksArr.map( (linkMap, index) => {
            let cls = "Header_Links_point";
            return (
                <Link onClick={this.props.onClickToggle} activeClass="active" to={linkMap.href} spy={true} smooth={true} offset={-80} duration={500} key={index} className={cls}>
                    {linkMap.text}
                </Link>


            )
        } )
    }

    render() {

        return(
            <div className={'Header_Links'}>
                { this.renderLinks() }
            </div>

        )
    }
}
export default HeaderLinks
import React, {Component} from 'react'

// import {Link} from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link'

// const linksArr = [
//     {href: 'SecondSection', text: 'Темы консультаций'},
//     {href: 'how-book', text: 'Как заказать'},
//     {href: 'expres', text: 'Врачи'},
//     {href: 'otziv', text: 'Отзывы'},
//     {href: 'vopros', text: 'Вопросы'}
// ]
class HeaderLinksOuter extends Component {
    renderLinks() {
        return this.props.linksArr.map( (linkMap, index) => {
            let cls = "Header_Links_point";
            return (
                <Link onClick={this.props.onClickToggle} to={linkMap.href}  key={index} className={cls}>
                    {linkMap.text}
                </Link>


            )
        } )
        // console.log(this.props.linksArr)
    }

    render() {

        return(
            <div className={'Header_Links'}>
                { this.renderLinks() }
            </div>

        )
    }
}
export default HeaderLinksOuter
import React, {Component} from 'react'

import classes from './Drawer.scss'

import Backdrop from '../../UI/Backdrop/Backdrop'

const linksArr = [
    1, 2, 3
]
class Drawer extends Component {

    renderLinks() {
        return linksArr.map( (linkMap, index) => {
            return (
                <li key={index}>
                    <a href="#">Link {linkMap}</a>
                </li>
            )
        } )
    }

    render() {
        const cls = [classes.Drawer]
        if (!this.props.isOpen) {
            cls.push(classes.close)
        }
        return(
            <React.Fragment >

                <nav className={cls.join(' ')}>
                    <ul>
                        { this.renderLinks() }
                    </ul>
                </nav>
                {
                    this.props.isOpen ?  <Backdrop onClick={this.props.onClose} /> : null
                }

            </React.Fragment>

        )
    }
}
export default Drawer
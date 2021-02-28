import React from 'react'
import './Layout.scss'
// import Header from '../../components/Header/Header'


class Layout extends React.Component{
    state = {
        menu: false
    }
    toggleMenuHandler = () => {
        this.setState({
            menu: !this.state.menu
        })
    }
    menuCloseHandler = () => {
        this.setState({
            menu: false
        })
    }

    render() {
        return (
            <div className={"Layout"} >
                {/*<Header*/}
                    {/*onToggle={this.toggleMenuHandler}*/}
                    {/*isOpen={this.state.menu}*/}
                {/*/>*/}
                {this.props.children}
            </div>
        )
    }
}

export default Layout
import React from 'react'
import './Layout.scss'


class Layout extends React.Component{


    render() {
        return (
            <div className={"Layout"} >
                {this.props.children}
            </div>
        )
    }
}

export default Layout
import React, { Component } from "react";

import { SmoothyScroll } from "./smooth";

export default class MyAnchorView extends React.Component {
    scroller = new SmoothyScroll()

    // componentDidUpdate(prevProps, prevState, snapshot) {
    // }

    componentDidUpdate(prevProps) {
        if (this.props.location.hash !== prevProps.location.hash) {
            this.scrollToHash(this.props.location.hash)
        }
    }

    scrollToHash = (hash) => {
        if (hash) { // потому что хеша, например, может не быть вовсе
            var target = document.getElementById(`_${hash.replace("#", "")}`)
            if (target) {
                this.scroller.scrollTo(target.offsetTop)
            }
        }
    }

    render() {
        return (
            <div className="view-with-anchors">
                <a href="#someAnchor">Click me</a>
                <div style={{ paddingTop: 2000 }}>
                    Empty space to test
                </div>
                <div id="_someAnchor" style={{ height: 2000 }}>
                    <h1> Hello, world! </h1>
                </div>
            </div>
        )
    }
}

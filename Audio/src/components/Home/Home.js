import React, {Component} from 'react';

import Header from '../../components/Header/Header'
import FirstSection from "../../components/Section/FirstSection/FirstSection";
// import SecondSection from "../../components/Section/SecondSection/SecondSection";
// import SectionThree from "../../components/Section/SectionThree/SectionThree";
import FourSection from "../../components/Section/FourSection/FourSection";
import FiveSection from "../../components/Section/FiveSection/FiveSection";
import SixSection from "../../components/Section/SixSection/SixSection";
import TerapeftList from "../Terapeft/TerapeftList";

class Home extends Component{
    state = {
        menu: false,
        // activeSlidesArr: [],
        headerRend: 0,
        lang: 'ru',
        scrollClass: false
    }
    constructor(props) {
        super(props);
        this.handleScroll = this.handleScroll.bind(this);
    }
    componentDidMount() {
        this.getCookie('Webview');
        this.getCookie('lang');
        window.addEventListener('scroll', this.handleScroll);
    }
    componentWillUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    }
    getCookie(name) {
        let matches = document.cookie.match(new RegExp(
            "(?:^|; )" + name.replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"
        ));
        if(matches ) {
            if (name === 'Webview') {
                this.setState({
                    headerRend: parseInt(decodeURIComponent(matches[1]))
                })
            } else {
                this.setState({
                    lang: this.props.domainName === 'audio.doc.online' ? 'ru' : decodeURIComponent(matches[1])
                })
            }
        }
    }
    handleScroll(event) {
        if (window.scrollY <= 40 && this.state.scrollClass === true) {
            this.setState({scrollClass: false});
        }
        else if (window.scrollY > 40 && this.state.scrollClass !== true) {
            this.setState({scrollClass: true});
        }
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

    // activeSlides = (index, event) => {
    //     if (this.state.activeSlidesArr.indexOf(index) > -1) {
    //         this.state.activeSlidesArr.splice(this.state.activeSlidesArr.indexOf(index), 1);
    //     } else {
    //         this.state.activeSlidesArr.push(index);
    //     }
    //     event.currentTarget.classList.toggle("active")
    // }
    render() {
        return (
                <React.Fragment>
                    {
                        this.state.headerRend === 1 ? null :
                            <Header
                                onToggle={this.toggleMenuHandler}
                                isOpen={this.state.menu}
                                lang={this.state.lang}
                                scrollClass={this.state.scrollClass ? " scroll" : ''}
                                onScroll={this.handleScroll}
                                domainName={this.props.domainName}
                            />
                    }
                    <FirstSection
                        lang={this.state.lang}
                        domainName={this.props.domainName}
                    />
                    <TerapeftList
                        activeSlidesArr={this.state.activeSlidesArr}
                        webInfo={this.state.headerRend}
                        lang={this.state.lang}
                        domainName={this.props.domainName}
                        {...this.props}/>
                    <FourSection
                        lang={this.state.lang}
                        domainName={this.props.domainName}
                    />
                    <FiveSection
                        domainName={this.props.domainName}
                        lang={this.state.lang}
                    />
                    <SixSection
                        lang={this.state.lang}
                        domainName={this.props.domainName}
                    />
                </React.Fragment>
            )
    };
}

export default Home;

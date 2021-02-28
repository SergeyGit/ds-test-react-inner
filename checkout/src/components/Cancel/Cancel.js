import React, { Component } from 'react'
// import {Redirect} from 'react-router-dom'
import request from 'superagent';
import Header from '../../components/Header/Header-form'

class Cancel extends Component{

    state = {
        CardMask: "",
        Price: "",
        ReturnPrice: 0,
        name: "",
        shopOrderNumber: "",
        menu: false
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        // var getCookie = (name)=> {
        //     var nameEQ = name + "=";
        //     var ca = document.cookie.split(';');
        //     for(var i=0;i < ca.length;i++) {
        //         var c = ca[i];
        //         while (c.charAt(0)===' ') c = c.substring(1,c.length);
        //         if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length,c.length);
        //     }
        //     return null;
        // }

        request
            .post('/doc-audio/portmone/getcanceldata')
            .send({
                // "order_id": getCookie("portmone_order_id"),
                "order_id": this.props.location.state.order_id,
            }).then((res)=>{
            let r=JSON.parse(res.text);
            console.log(r);
            if(res.status===200){
                this.setState({
                    CardMask: r.cardMask,
                    Price:  r.bill,
                    ReturnPrice: r.return_price,
                    name: r.name,
                    shopOrderNumber: r.shopOrderNumber
                })
            }
        })
    }

    // componentWillMount(){
    //
    //
    // }
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
            <React.Fragment>
                <Header
                    onToggle={this.toggleMenuHandler}
                    isOpen={this.state.menu}
                />
            <div className={'Form'}>
                    <div className="container">
                        {/*{*/}
                        {/*    !this.props.location.state ? <Redirect to="/audio"/> : null*/}

                        {/*}*/}
                        {/*{*/}
                        {/*    console.log(this.props.location.state)*/}
                        {/*}*/}
                        <h1 className={'caption'}>Заказ на экспресс-консультацию</h1>
                        <div className="doc-line">
                            <img
                                src={this.props.location.state.img}
                                // src={'test'}
                                alt="ava" className="doc-line_img"/>
                            <div className="doc-line_info">
                                <div className="doc-line_info_name">
                                    {/*{this.state.name}*/}
                                {this.props.location.state.name} {this.props.location.state.nameOther}
                                </div>
                                <div className="doc-line_info_pos">
                                    <b>{this.props.location.state.position}</b>
                                    {this.props.location.state.text}
                                </div>
                            </div>
                            <div className="doc-line_price">
                                <span>Цена: </span> <div className="big green">
                                {this.props.location.state.price}
                                {/*{this.state.Price}*/}
                            </div> <span className="green">грн</span> / <div className="big">
                                {this.props.location.state.duration}
                            </div> <span> мин</span>
                            </div>
                            <div  className="doc-line_cancel res">
                                <b>{this.state.shopOrderNumber}
                                    <div className="red">Отменен</div>
                                </b>
                            </div>
                        </div>
                        <div className={'Cancel_text'}>
                            Сумма в размере <b className={'h3'}> {this.state.ReturnPrice} грн </b> возвращена на Вашу карту:
                            <span className={'card-number h3'}>{this.state.CardMask}</span>
                        </div>
                        <div className={'Cancel_text_info'}>Зачисление денежных средств будет произведено на Вашу банковскую карту в течении 3-5 рабочих дней. Зачисление производится согласно тарифам Вашей карты.</div>
                        <div className="Form_links">
                            <a href="/audio" className={'Timer_button'}>На главную</a>
                        </div>
                    </div>
            </div>
            </React.Fragment>
        )
    }
}
export default Cancel
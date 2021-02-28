import React, { Component } from 'react'
// import {Redirect} from 'react-router-dom'
// import request from 'superagent';
import Headerform from '../../components/Header/Header-form'
import request from "superagent";

// const linkStart = "http://stage1.r2rx.doc.ua";
const linkStart = "";
class Cancel extends Component{

    state = {
        // CardMask: "",
        // Price: "",
        // ReturnPrice: 0,
        name: "",
        shopOrderNumber: "",
        menu: false,
        order: undefined
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        request
            .get(linkStart+'/doc-audio/audio/order/'+this.props.location.state.order_id)
            .set('X-App-Lang', this.props.location.state.lang)
            .then((res) => {
                this.setState({
                    order: res.body.order
                })

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
                {
                    this.props.location.state.webInfo === 1 ? null :
                        <Headerform
                            onToggle={this.toggleMenuHandler}
                            isOpen={this.state.menu}
                            domainName={this.props.domainName}
                        />
                }

            <div className={'Form'}>
                    <div className="container">
                        {/*{*/}
                        {/*    !this.props.location.state ? <Redirect to="/audio"/> : null*/}

                        {/*}*/}
                        {/*{*/}
                        {/*    console.log(this.props.location.state)*/}
                        {/*}*/}
                        <h1 className={'caption'}>{this.props.location.state.lang === 'ru' ? 'Заказ на онлайн-консультацию' : 'Замовлення на онлайн-консультацію'}</h1>
                        {
                            !this.state.order ? null
                                :
                               <>
                                   <div className="doc-line">
                                       <img
                                           src={this.state.order.doctor.image}
                                           // src={'test'}
                                           alt="ava" className="doc-line_img"/>
                                       <div className="doc-line_info">
                                           <div className="doc-line_info_name">
                                               {/*{this.state.name}*/}
                                               {this.state.order.doctor.name} {this.state.order.doctor.name_other}
                                           </div>
                                           <div className="doc-line_info_pos">
                                               <b>{this.state.order.doctor.specialties.join(', ')}</b>
                                               {/*{this.props.location.state.text}*/}
                                           </div>
                                       </div>
                                       <div className="doc-line_price">
                                           <span>{this.props.location.state.lang === 'ru' ? 'Цена' : 'Ціна'}: </span> <div className="big green">
                                           {this.state.order.consultation.price}
                                           {/*{this.state.Price}*/}
                                       </div> <span className="green">{this.props.domainName === 'audio.doc.online' ? '$': 'грн'}</span> / <div className="big">
                                           {this.state.order.consultation.duration}
                                       </div> <span>{this.props.location.state.lang === 'ru' ? ' мин' : ' хв'}</span>
                                       </div>
                                       <div  className="doc-line_cancel res">
                                           <b>{this.props.location.state.order_id}
                                               <div className="red">{this.props.location.state.lang === 'ru' ? 'Отменен' : 'Відмінено'}</div>
                                           </b>
                                       </div>
                                   </div>
                                   {
                                       this.props.location.state.lang === 'ru' ?
                                           <div className={'Cancel_text'}>
                                               Сумма в размере <b className={'h3'}> {this.props.location.state.returnPrice} {this.props.domainName === 'audio.doc.online' ? '$': 'грн'} </b> возвращена на Вашу карту:
                                               <span className={'card-number h3'}>{this.props.location.state.cardMask}</span>
                                           </div>
                                           :
                                           <div className={'Cancel_text'}>
                                               Сума в розмірі <b className={'h3'}> {this.props.location.state.returnPrice} {this.props.domainName === 'audio.doc.online' ? '$': 'грн'} </b> повернута на вашу картку:
                                               <span className={'card-number h3'}>{this.props.location.state.cardMask}</span>
                                           </div>
                                   }
                                   <div className={'Cancel_text_info'}>{this.props.location.state.lang === 'ru' ? 'Зачисление денежных средств будет произведено на Вашу банковскую карту в течении 3-5 рабочих дней. Зачисление производится согласно тарифам Вашей карты.' :  'Зарахування коштів буде здійснено на Вашу банківську карту протягом 3-5 робочих днів. Зарахування проводиться відповідно до тарифів Вашої картки.'}</div>
                                   <div className="Form_links">
                                       <a href={`${this.props.domainName === 'audio.doc.online' ? '/' : '/audio'}`} className={'Timer_button'}>{this.props.location.state.lang === 'ru' ? 'На главную' : 'На головну'}</a>
                                   </div>
                               </>
                        }

                    </div>
            </div>
            </React.Fragment>
        )
    }
}
export default Cancel
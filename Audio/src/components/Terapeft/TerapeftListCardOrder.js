import React ,{Component} from 'react';
import {Link} from 'react-router-dom'

class TerapeftListCardOrder extends Component {
    state = {
        activeElement: 0,
        linkToOrder: "/audio/doctor/"+ + this.props.id,
        price: this.props.price[0].price,
        duration: this.props.price[0].duration,
    };
    toggleActiveElement(index) {
        this.setState({
            activeElement: index,
            price: this.props.price[index].price,
            duration: this.props.price[index].duration,
        })
    }
    render() {
        return (
            <div className="doctor_point_order">
                {/*{*/}
                    {/*this.props.id === 11244 || this.props.id === 16057 || this.props.id === 21472 ?*/}
                        {/*<div className="h7 doctor_point_order_text  f-b">{this.props.lang === 'ru' ? 'Врач доступен через 30 минут' : 'Лікар буде доступний через 30 хвилин'}</div>*/}
                        {/*: <div className="h7 doctor_point_order_text blue f-b">{this.props.lang === 'ru' ? 'Врач свяжется с вами как можно быстрее' : 'Лікар сконтактує з вами якомога швидше'}</div>*/}
                {/*}*/}
                <div className="h7 doctor_point_order_text blue f-b">{this.props.lang === 'ru' ? 'Врач свяжется с вами как можно быстрее' : 'Лікар сконтактує з вами якомога швидше'}</div>
                <div className="doctor_point_order_price">
                    {
                        this.props.price.map((point, index) => {
                            return (
                                <div className={this.state.activeElement === index ? "doctor_point_order_price_point active" : "doctor_point_order_price_point"}
                                     key={index}
                                     onClick={() => this.toggleActiveElement(index)}
                                >
                                    <div className="doctor_point_order_price_check"/>
                                    <div>
                                        <span>{point.price} {this.props.domainName === 'audio.doc.online' ? '$': 'грн'}</span> / {point.duration} {this.props.lang === 'ru' ? 'мин' : 'хв'}
                                    </div>

                                </div>
                            )
                        })
                    }

                </div>

                <Link className="doctor_button"
                      to={{
                          pathname: `${this.props.domainName === 'audio.doc.online' ? '': '/audio'}/doctor/${this.props.id}`,
                          state: {
                              img:  this.props.img,
                              name:  this.props.name,
                              nameOther:  this.props.nameOther,
                              position: this.props.position,
                              category_name: this.props.category_name,
                              price: this.state.price,
                              duration: this.state.duration,
                              id:  this.props.id,
                              affiliates: this.props.affiliates,
                              tariff_id: +this.state.price <= 49 ? 3943
                                  : +this.state.price > 49 && +this.state.price <= 85  ? 3944
                                  : +this.state.price > 85 && +this.state.price <= 120 ? 3945 : 3950,
                              webInfo: this.props.webInfo,
                              lang: this.props.lang

                          }
                      }}
                >{this.props.lang === 'ru' ? 'Записаться' : 'Записатись'}</Link>
            </div>

        )
    }
}


export default TerapeftListCardOrder
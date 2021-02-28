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
                <div className="doctor_point_order_price">
                    {
                        this.props.price.map((point, index) => {
                            return (
                                <div className={this.state.activeElement === index ? "doctor_point_order_price_point active" : "doctor_point_order_price_point"}
                                     key={index}
                                     onClick={() => this.toggleActiveElement(index)}
                                >
                                    <div className="doctor_point_order_price_check"/>
                                    <span>{point.price} грн</span>/{point.duration} мин
                                </div>
                            )
                        })
                    }

                </div>

                <Link className="doctor_button"
                      to={{
                          pathname: "/audio/doctor/"+ + this.props.id,
                          state: {
                              img:  this.props.img,
                              name:  this.props.name,
                              nameOther:  this.props.nameOther,
                              position: this.props.position,
                              price: this.state.price,
                              duration: this.state.duration,
                              id:  this.props.id,
                              activeSlides: this.props.activeSlides,
                              affiliates: this.props.affiliates,
                              tariff_id: +this.state.price <= 49 ? 3943
                                  : +this.state.price > 49 && +this.state.price <= 85  ? 3944
                                  : +this.state.price > 85 && +this.state.price <= 120 ? 3945 : 3950
                          }
                      }}
                >Заказать</Link>
            </div>

        )
    }
}


export default TerapeftListCardOrder
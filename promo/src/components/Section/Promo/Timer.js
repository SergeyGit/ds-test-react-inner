import React, {Component} from 'react'


class Timer extends Component {
    state = {
        seconds: 0,
        minutes: 0,
        hours:0,
        days: Math.floor(((+this.props.date *1000 ) - Date.now()) / (1000 * 60 * 60 * 24)),
        allDate: (+this.props.date *1000 ) - Date.now()
    }

    componentDidMount() {

        // if (this.state.allDate > 0) {
        //     this.timeinterval();
        // }
        this.timeinterval();
    }
    componentWillUnmount() {
        clearInterval(this.interval);
    }

    timeinterval = () => {
        this.interval = setInterval(this.updateClock, 1000);
    }
    // totalTime = () => {
    //     console.log(Date.parse(this.props.date) - Date.parse(new Date()))
    //     return Date.parse(this.props.date) - Date.parse(new Date())
    //
    // }
    timerInitialize = () => {
        // let total = new Date(Date.parse( this.props.date) + Number(86390000)) - new Date();
        // let total = this.state.allDate - 1000;
        this.setState({
            allDate: this.state.allDate - 1000,
            seconds: Math.floor(((this.state.allDate) / 1000) % 60 ),
            minutes: Math.floor(((this.state.allDate) / (1000 * 60)) % 60 ),
            hours: Math.floor((this.state.allDate) / ((1000 * 60 * 60)) % 24),
            days: Math.floor((this.state.allDate) / (1000 * 60 * 60 * 24))
        });



    }

    updateClock = () => {
        this.timerInitialize();
        if (this.state.allDate <= 0) {
            clearInterval(this.timeinterval);
            this.setState({
                allDate: 0,
                seconds: 0,
                minutes: 0,
                hours:0,
                days:0
            })
        }
    }





    render() {
        return(
                <div className="PromoCard_timer_point">
                    <div>{this.props.uaProp ? "До кінця акції залишилося" : "До конца акции осталось"}</div>
                    <div className="PromoCard_timer_point_cont">
                        {
                            this.state.days < 1 ? null
                                :
                                <div className="PromoCard_timer_point_cont_day">
                                    {this.state.days}  <span>{this.props.uaProp ? "днiв" : "дней"}</span>
                                </div>
                        }
                        <time>{
                            this.state.hours < 10 ? '0' + this.state.hours : this.state.hours
                        } : {
                            this.state.minutes < 10 ? '0' + this.state.minutes : this.state.minutes
                        } : {
                            this.state.seconds < 10 ? '0' + this.state.seconds : this.state.seconds
                        }</time>
                    </div>
                </div>
            )

    }
}
export default Timer



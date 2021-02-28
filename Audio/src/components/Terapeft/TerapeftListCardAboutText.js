import React, {Component} from 'react'

class TerapeftListCardAboutText extends Component {
    state = {
        showMore: false,

    };

    handleSowMorw () {
        this.setState(prevState => ({
            showMore: !prevState.showMore
        }))
    };

    render() {
        return(
            <div className="doctor_about">
                {
                    this.state.showMore ?
                        this.props.short_about
                        :

                            this.props.short_about.length > 290 ?
                                <>
                                    {this.props.short_about.slice(0, 290) + "..."}
                                    <span className={"doctor_about_more"} onClick={() => this.handleSowMorw()}>{this.props.lang  === 'ru' ? 'Еще' : 'Більше'}</span>
                                </>
                                : this.props.short_about



                }

            </div>
        )
    }
}

export default TerapeftListCardAboutText
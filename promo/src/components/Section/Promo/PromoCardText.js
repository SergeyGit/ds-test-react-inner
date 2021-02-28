import React, {Component} from 'react'

class PromoCardText extends Component {
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

                            this.props.short_about.length > 320 ?
                                <>
                                    {this.props.short_about.slice(0, 320) + "..."}
                                    <span className={"doctor_about_more"} onClick={() => this.handleSowMorw()}>{'Еще'}</span>
                                </>
                                : this.props.short_about



                }

            </div>
        )
    }
}

export default PromoCardText
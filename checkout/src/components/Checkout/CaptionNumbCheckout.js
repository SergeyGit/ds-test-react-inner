import React from 'react';


const CaptionNumbCheckout = props => {
    return (
        <div className="checkout_main_caption">
            <div className="checkout_main_caption_numb">{props.index}</div>
            <div className="h2">{props.name}</div>
        </div>
    );
}

export default CaptionNumbCheckout;

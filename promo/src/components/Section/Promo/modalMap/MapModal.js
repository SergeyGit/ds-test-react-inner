import React from 'react'
import './MapModal.scss'

// import shouldUpdate from "recompose/shouldUpdate";
// import pure from 'recompose/pure';



const MapModal = props => {

    return (
        <div className="modal fade-in-2" >
            <div className="modal-dialog">
                <div className="modal-content whitepopup">
                    <div className="modal-header" onClick={() => props.closeFunction()}>
                        <div className="modal-title h5 m-w">Филиал на карте</div>
                        <div className="popup-close__btn">
                            <svg viewBox="-280 413.9 14 14" className="popup-close-icon">
                                <path d="M-266,415.3l-1.4-1.4l-5.6,5.6l-5.6-5.6l-1.4,1.4l5.6,5.6l-5.6,5.6l1.4,1.4l5.6-5.6l5.6,5.6l1.4-1.4l-5.6-5.6L-266,415.3z"/><path d="M-285,408.9h24v24h-24V408.9z" fill="none"/>
                            </svg>
                        </div>
                    </div>
                    <div className="modal-body modal-body-map">
                        <iframe title='map' src={`https://www.google.com/maps/embed/v1/place?center=${props.latitude},${props.longitude}&zoom=13&q=${props.latitude},${props.longitude}&key=AIzaSyD8W3vVfZBQHgLrWWIRCmT6gUndRbqEY20`} width="100%" height="100%"/>
                    </div>
                    <div className="modal-footer"/>
                </div>
            </div>
        </div>
    )
}
// const checkPropsChange = (props, nextProps) =>
//     (nextProps.id !== props.id);

// export default shouldUpdate(checkPropsChange)(PromoCard)
export default MapModal
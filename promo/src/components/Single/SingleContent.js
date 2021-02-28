import React from 'react';

import './SingleContent.scss'



const SingleContent = props => {
    return (
        <React.Fragment>
            <div className='Single_name'>{props.name}</div>
            <div className="Single_container white">
                <div  dangerouslySetInnerHTML={{ __html: props.content }} />
                {
                    props.dateFrom && props.date ?
                        <div className="Single_promo-info">
                            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M7.99968 0C3.58876 0 0 3.5888 0 8C0 12.4112 3.58876 16 7.99968 16C12.4109 16 16 12.4112 16 8C16 3.5888 12.4109 0 7.99968 0ZM7.99968 14.9508C4.1672 14.9508 1.0492 11.8326 1.0492 8C1.0492 4.16732 4.16716 1.04924 7.99968 1.04924C11.8326 1.04924 14.9507 4.16736 14.9507 8C14.9508 11.8326 11.8326 14.9508 7.99968 14.9508Z" fill="#333536"/>
                                <path d="M7.85186 5.03974C8.23811 5.03974 8.55139 4.72646 8.55139 4.34018C8.55139 3.95391 8.23811 3.64062 7.85186 3.64062C7.4653 3.64062 7.15234 3.95391 7.15234 4.34018C7.15234 4.72646 7.4653 5.03974 7.85186 5.03974Z" fill="#333536"/>
                                <path d="M8.96413 11.1837H8.52537V6.18284C8.52537 5.89312 8.29053 5.6582 8.00085 5.6582H7.03709C6.74741 5.6582 6.51257 5.89312 6.51257 6.18284C6.51257 6.47256 6.74741 6.70744 7.03709 6.70744H7.47617V11.1837H7.03709C6.74741 11.1837 6.51257 11.4186 6.51257 11.7083C6.51257 11.998 6.74741 12.2329 7.03709 12.2329H8.96413C9.25397 12.2329 9.48881 11.998 9.48881 11.7083C9.48881 11.4186 9.25397 11.1837 8.96413 11.1837Z" fill="#333536"/>
                            </svg>
                            { props.uaProp ? "Період проведення акції в клініці з": "Период проведения акции в клинике с"}
                             <span>{new Date(props.dateFrom*1000).toLocaleString("ru-RU", {year: '2-digit', month: 'numeric', day: 'numeric' })} по {new Date(props.date*1000).toLocaleString("ru-RU", {year: '2-digit', month: 'numeric', day: 'numeric' })}</span>
                        </div>
                        : null
                }
            </div>
        </React.Fragment>

    );
}

export default SingleContent;

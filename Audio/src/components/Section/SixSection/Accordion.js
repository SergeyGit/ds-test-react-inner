import React from 'react'


const Accordion = props => {
    const onToggle = () => {
        props.onToggle();
    }

    const { isExpanded } = props;
    return (
        <div className={`Accordion ${isExpanded ? "expanded" : ""}`}
             onClick={onToggle}
        >
            <div className="Accordion_caption">
                <div className="Accordion_arrow">
                    <svg width="14" height="7" viewBox="0 0 11 6" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5.92922 5.83709L10.8243 1.29221C10.9376 1.1871 11 1.04677 11 0.897152C11 0.74753 10.9376 0.607207 10.8243 0.50209L10.4639 0.167391C10.229 -0.0503999 9.84733 -0.0503999 9.61285 0.167391L5.50228 3.98384L1.38715 0.163156C1.27384 0.0580388 1.1228 0 0.961732 0C0.800489 0 0.649441 0.0580388 0.536044 0.163156L0.17573 0.497855C0.0624219 0.603055 -7.83838e-08 0.743295 -7.83838e-08 0.892917C-7.83838e-08 1.04254 0.0624219 1.18286 0.17573 1.28798L5.07525 5.83709C5.18892 5.94246 5.34068 6.00033 5.50201 6C5.66397 6.00033 5.81564 5.94246 5.92922 5.83709Z" className={"style"}/>
                    </svg>
                </div>
                {props.captionProp}
            </div>
            <div className="Accordion_text fade-in">
                {props.textProp}
            </div>
        </div>
    )

}

export default Accordion


import React from "react";
import {Link} from "react-router-dom";
import './Directions.scss'

const Directions = (props) => {
    return (
        <div className="directions ">
            {
                props.specialties.map((directIttem) => {
                    return (
                        <div
                            className={props.activeSpecielty === directIttem.alias ? "directions_button active" : "directions_button"}
                            key={directIttem.id}
                        >
                            <Link
                                to={'/promotions/'+props.cityAlias+'/all/'+directIttem.alias}
                            >{directIttem.name}</Link>
                            <div
                                className="directions_button_close icon-close"
                                onClick={() => props.clearSpecialty()}
                            />
                        </div>
                    )
                })
            }
        </div>
    )
}
export default Directions
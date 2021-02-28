import React from "react";
import {Link} from "react-router-dom";
import './Bradcrumb.scss'
import {connect} from "react-redux";

const Bradcrumb = (props) => {
    return (
        <div className={ !props.inner ? "breadcrumbs" : "breadcrumbs inner"}>
            <div className="container">
                <div className="breadcrumb">
                    <span><a href="/" title="Главная">Главная</a></span>
                    {
                        !props.inner ?
                            !props.check ?
                                props.match.params.alias === "all" ?
                                    <span>{props.uaProp ? "Акції та знижки" : "Акции и скидки"}</span>
                                    :
                                    props.match.params.specialty ?
                                        <>
                                            <span><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.match.params.city}/all`}>{props.uaProp ? "Акції та знижки" : "Акции и скидки"}</Link></span>
                                            {
                                                !props.dataState ? null
                                                    :
                                                    !props.dataState.dataJson ? null
                                                        :
                                                        !props.dataState.dataJson.specialties ? null
                                                            :
                                                            <span>{props.dataState.dataJson.specialties.find(e=> e.alias === props.match.params.specialty).name}</span>
                                            }

                                        </>
                                        : null
                                : <><span><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.dataState.citiesList.find(e=> +e.id === +props.dataState.city).alias}/all`}>{props.uaProp ? "Акції та знижки" : "Акции и скидки"}</Link></span><span>{props.uaProp ? "Запис на прийом" : "Запись на приём"}</span></>
                            :
                            <>
                                <span><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.match.params.city}/all`}>{props.uaProp ? "Акції та знижки" : "Акции и скидки"}</Link></span>
                                {
                                    !props.info ? null
                                        :
                                        !props.info.promotion ? null
                                            :
                                            !props.info.promotion.specialties ? null
                                                :
                                                <>
                                                    <span><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.match.params.city}/all/${props.info.promotion.specialties[0].alias}`}>{props.info.promotion.specialties[0].name}</Link></span>
                                                    <span>{props.info.promotion.name}</span>
                                                </>
                                }
                            </>


                    }
                </div>
                {
                    props.dataState.citiesList ?
                        !props.inner ?
                            !props.check ?
                                <Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.dataState.citiesList.find(e=> +e.id === +props.dataState.city).alias}/all`} className="back_link"><span className="icon-arrovv"/>Назад</Link>
                                : <Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.dataState.citiesList.find(e=> +e.id === +props.dataState.city).alias}/all`} className="back_link" ><span className="icon-arrovv"/>Назад</Link>
                            : <Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.match.params.city}/all`} className="back_link" ><span className="icon-arrovv"/>Назад</Link>
                        : null
                }

            </div>

        </div>
    )
}
function mapStateToProps(state) {
    return {
        dataState: state.mainPageReducer
    }
}
export default connect(mapStateToProps)(Bradcrumb)
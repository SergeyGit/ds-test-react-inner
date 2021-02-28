import React from "react";
import {Link} from "react-router-dom";
import './Directions.scss'

const SecondDirection = (props) => {
    return (
        <div className="TerapeftList_directions_wrap" id="TerapeftList_directions">
        <div className="TerapeftList_directions" >
            <div className="container TerapeftList_directions_cnt">
                <div className="TerapeftList_directions_button_assistance">
                    {
                        !props.free ? null
                            :
                            <div
                                className={`TerapeftList_directions_button free ${props.activeSpecielty === "free" ? "active" : ""}`}
                            ><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/free`}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M3.49855 4.14882L3.49854 4.14881C2.63548 3.27932 2.63547 1.86491 3.4996 0.995413L3.49855 4.14882ZM3.49855 4.14882C3.56001 4.21073 3.63157 4.27488 3.711 4.34014H1C0.366157 4.34014 -0.15 4.8563 -0.15 5.49014V7.99014C-0.15 8.34898 0.141157 8.64014 0.5 8.64014H0.85V14.4901C0.85 15.124 1.36616 15.6401 2 15.6401H14C14.6338 15.6401 15.15 15.124 15.15 14.4901V8.64014H15.5C15.8588 8.64014 16.15 8.34898 16.15 7.99014V5.49014C16.15 4.8563 15.6338 4.34014 15 4.34014H12.2888M3.49855 4.14882L12.2888 4.34014M12.2888 4.34014C12.3681 4.27486 12.4395 4.21066 12.5006 4.14865C13.3645 3.27913 13.3645 1.86483 12.5004 0.995413C11.6588 0.148461 10.1974 0.147337 9.35469 0.995319L12.2888 4.34014ZM7.99979 3.43367C7.90335 3.09577 7.76194 2.75795 7.60734 2.44816C7.28109 1.79439 6.87685 1.22795 6.64536 0.995366L7.99979 3.43367ZM7.99979 3.43367C8.09619 3.09575 8.23764 2.75793 8.39229 2.44814C8.71866 1.79439 9.12312 1.22801 9.3546 0.995412L7.99979 3.43367ZM6.64531 0.995319C5.8026 0.14734 4.34119 0.148461 3.49961 0.995403L6.64531 0.995319ZM4.42144 1.91183C4.59642 1.73605 4.82717 1.64014 5.073 1.64014C5.31779 1.64014 5.54858 1.73602 5.72362 1.91189C6.04008 2.23023 6.36701 2.81142 6.58666 3.35198C6.69579 3.62056 6.77518 3.87119 6.81329 4.06547C6.83245 4.16315 6.83997 4.24064 6.83791 4.29628C6.83728 4.31305 6.83587 4.32571 6.83434 4.33505C6.81679 4.33775 6.79127 4.34014 6.756 4.34014C6.44783 4.34014 5.97224 4.17506 5.5048 3.94258C5.04061 3.71173 4.62001 3.4324 4.42143 3.23244C4.06052 2.86893 4.06052 2.27533 4.42144 1.91183ZM7.35 14.3401H2.15V8.64014H7.35V14.3401ZM7.35 7.34014H1.15V5.64014H6.756H7.35V7.34014ZM10.2763 1.91194C10.6236 1.56396 11.2322 1.56478 11.5787 1.91195C11.9395 2.27547 11.9394 2.86898 11.5786 3.23245C11.38 3.43241 10.9594 3.71173 10.4952 3.94258C10.0278 4.17506 9.55217 4.34014 9.244 4.34014C9.20837 4.34014 9.18262 4.33779 9.16491 4.33512C9.16341 4.32579 9.16203 4.31316 9.16143 4.29648C9.15944 4.2408 9.16704 4.16326 9.18627 4.06556C9.22452 3.87125 9.304 3.6206 9.4132 3.35201C9.63298 2.81145 9.95988 2.2303 10.2763 1.91194ZM13.85 14.3401H8.65V8.64014H13.85V14.3401ZM14.85 7.34014H8.65V5.64014H9.244H14.85V7.34014Z"
                                        fill="#47D7AC" stroke="#47D7AC" strokeWidth="0.3"/>
                                    <path d="M1 6.92857V6H15V6.85714L14.4615 7H2.07692L1 6.92857Z" fill="#47D7AC"
                                          stroke="#47D7AC"/>
                                </svg>
                                {props.uaProp ? "Безкоштовні" : "Бесплатные"}</Link>
                                <div className="TerapeftList_directions_button_close"
                                     onClick={() => props.clearSpecialty()}/>
                            </div>
                    }
                    {
                        !props.hot ? null
                            :
                            <div
                                className={`TerapeftList_directions_button time ${props.activeSpecielty === "hot" ? "active" : ""}`}
                                // onClick={() => {
                                //     props.sortTimePromo()
                                // }}
                            ><Link to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/hot`}
                            >
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M10.3954 6.28793C10.3552 6.90668 10.2039 7.50775 9.94155 8.07857C9.81264 8.3575 9.52539 8.52407 9.22363 8.52407C9.11917 8.52407 9.01306 8.50443 8.91109 8.462C8.51523 8.29818 8.33368 7.86132 8.50611 7.48575C8.72912 7.00096 8.84228 6.48593 8.84228 5.95479C8.84228 4.43718 7.90839 3.12307 6.55668 2.5C7.49098 6.41679 4 6.42936 4 9.70893C4 11.8029 5.79067 13.5 7.99959 13.5C10.2093 13.5 12 11.8029 12 9.70893C12.0004 8.30957 11.1018 7.05675 10.3954 6.28793Z"
                                        fill="#FE5000"/>
                                </svg>
                                {props.uaProp ? "Закінчується термін" : "Заканчивается срок"}</Link>
                                <div className="TerapeftList_directions_button_close"
                                     onClick={() => props.clearSpecialty()}/>
                            </div>
                    }
                </div>
                        <div className="TerapeftList_directions_button_desct-cnt">
                            <div className="TerapeftList_directions_button_desct-cnt_active">
                                {
                                    !props.activeSpecButton  ? null
                                        :
                                        <div className="TerapeftList_directions_button active">
                                            <Link
                                                to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/${props.activeSpecButton.alias}`}
                                            >{props.activeSpecButton.name}</Link>
                                            <div
                                                className="TerapeftList_directions_button_close"
                                                onClick={() => props.clearSpecialty()}
                                            />
                                        </div>

                                }
                            </div>
                            <div className="TerapeftList_directions_button_desct-cnt_other">
                                {
                                    [...props.specialties].splice(0,4).map((directIttem) =>
                                                !props.activeSpecButton ?
                                                    <div className="TerapeftList_directions_button"
                                                         key={directIttem.id}
                                                    >
                                                        <Link
                                                            to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/${directIttem.alias}`}
                                                        >{directIttem.name}</Link>
                                                        <div className="TerapeftList_directions_button_close"
                                                             onClick={() => props.clearSpecialty()}/>
                                                    </div>
                                                    :
                                                    props.activeSpecButton.id === directIttem.id ? null
                                                        :
                                                        <div className="TerapeftList_directions_button"
                                                             key={directIttem.id}
                                                        >
                                                            <Link
                                                                to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/${directIttem.alias}`}
                                                            >{directIttem.name}</Link>
                                                            <div className="TerapeftList_directions_button_close"
                                                                 onClick={() => props.clearSpecialty()}/>
                                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        {
                            !props.specialtiesModal ? null
                                :
                                <div className="TerapeftList_directions_button_modal fade-in-2">
                                    <div className="TerapeftList_directions_button_modal_wrap">
                                        <div className="TerapeftList_directions_button_modal_head" onClick={() => props.handleModalSpecialties()}>
                                            <div className="f-b h3">{props.uaProp ? "Фільтр за спеціальністю" : "Фильтр по специальности"}</div>
                                            <div className="doc-line_cancel_icon"/>
                                        </div>
                                        <div className="TerapeftList_directions_button_modal_cat">
                                            {
                                                props.specialties.map((directIttem) => {
                                                    return (
                                                        <div className={`TerapeftList_directions_button ${props.activeSpecButton ? directIttem.id === props.activeSpecButton.id ? "active" : "" : ""}`}
                                                            key={directIttem.id}>
                                                            <Link
                                                                to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/${directIttem.alias}`}
                                                            >{directIttem.name}</Link>
                                                            <div className="TerapeftList_directions_button_close"
                                                                onClick={() => props.clearSpecialty()}
                                                            />
                                                        </div>
                                                    )
                                                })
                                            }
                                        </div>
                                    </div>

                                </div>
                        }
                        <div className="TerapeftList_directions_button show-more" onClick={() => props.handleModalSpecialties()}/>

            </div>
        </div>
            <div className="TerapeftList_directions_mobile">
                <div className="container TerapeftList_directions_cnt">
                    <div className={`TerapeftList_directions_mobile_filter-show ${props.activeSpecielty ? ' active' : ''}`} onClick={() => props.handleModalSpecialties()}>{props.uaProp ? "Фільтр" : "Фильтр"}</div>
                        {
                            !props.free ? null
                                :
                                <div className="TerapeftList_directions_mobile_cnt_btn">
                                    <div className={`TerapeftList_directions_button free ${props.activeSpecielty === "free" ? "active" : ""}`}
                                    ><Link
                                        to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/free`}>
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M3.49855 4.14882L3.49854 4.14881C2.63548 3.27932 2.63547 1.86491 3.4996 0.995413L3.49855 4.14882ZM3.49855 4.14882C3.56001 4.21073 3.63157 4.27488 3.711 4.34014H1C0.366157 4.34014 -0.15 4.8563 -0.15 5.49014V7.99014C-0.15 8.34898 0.141157 8.64014 0.5 8.64014H0.85V14.4901C0.85 15.124 1.36616 15.6401 2 15.6401H14C14.6338 15.6401 15.15 15.124 15.15 14.4901V8.64014H15.5C15.8588 8.64014 16.15 8.34898 16.15 7.99014V5.49014C16.15 4.8563 15.6338 4.34014 15 4.34014H12.2888M3.49855 4.14882L12.2888 4.34014M12.2888 4.34014C12.3681 4.27486 12.4395 4.21066 12.5006 4.14865C13.3645 3.27913 13.3645 1.86483 12.5004 0.995413C11.6588 0.148461 10.1974 0.147337 9.35469 0.995319L12.2888 4.34014ZM7.99979 3.43367C7.90335 3.09577 7.76194 2.75795 7.60734 2.44816C7.28109 1.79439 6.87685 1.22795 6.64536 0.995366L7.99979 3.43367ZM7.99979 3.43367C8.09619 3.09575 8.23764 2.75793 8.39229 2.44814C8.71866 1.79439 9.12312 1.22801 9.3546 0.995412L7.99979 3.43367ZM6.64531 0.995319C5.8026 0.14734 4.34119 0.148461 3.49961 0.995403L6.64531 0.995319ZM4.42144 1.91183C4.59642 1.73605 4.82717 1.64014 5.073 1.64014C5.31779 1.64014 5.54858 1.73602 5.72362 1.91189C6.04008 2.23023 6.36701 2.81142 6.58666 3.35198C6.69579 3.62056 6.77518 3.87119 6.81329 4.06547C6.83245 4.16315 6.83997 4.24064 6.83791 4.29628C6.83728 4.31305 6.83587 4.32571 6.83434 4.33505C6.81679 4.33775 6.79127 4.34014 6.756 4.34014C6.44783 4.34014 5.97224 4.17506 5.5048 3.94258C5.04061 3.71173 4.62001 3.4324 4.42143 3.23244C4.06052 2.86893 4.06052 2.27533 4.42144 1.91183ZM7.35 14.3401H2.15V8.64014H7.35V14.3401ZM7.35 7.34014H1.15V5.64014H6.756H7.35V7.34014ZM10.2763 1.91194C10.6236 1.56396 11.2322 1.56478 11.5787 1.91195C11.9395 2.27547 11.9394 2.86898 11.5786 3.23245C11.38 3.43241 10.9594 3.71173 10.4952 3.94258C10.0278 4.17506 9.55217 4.34014 9.244 4.34014C9.20837 4.34014 9.18262 4.33779 9.16491 4.33512C9.16341 4.32579 9.16203 4.31316 9.16143 4.29648C9.15944 4.2408 9.16704 4.16326 9.18627 4.06556C9.22452 3.87125 9.304 3.6206 9.4132 3.35201C9.63298 2.81145 9.95988 2.2303 10.2763 1.91194ZM13.85 14.3401H8.65V8.64014H13.85V14.3401ZM14.85 7.34014H8.65V5.64014H9.244H14.85V7.34014Z"
                                                fill="#47D7AC" stroke="#47D7AC" strokeWidth="0.3"/>
                                            <path d="M1 6.92857V6H15V6.85714L14.4615 7H2.07692L1 6.92857Z" fill="#47D7AC"
                                                  stroke="#47D7AC"/>
                                        </svg>
                                        {props.uaProp ? "Безкоштовні" : "Бесплатные"}</Link>
                                        <div className="TerapeftList_directions_button_close"
                                             onClick={() => props.clearSpecialty()}/>
                                    </div>
                                </div>
                        }

                </div>
                {
                    !props.specialtiesModal ?
                        <>
                        {
                            document.documentElement.classList.remove("overflow-modal")
                        }
                        {
                            document.getElementById('head')  ? document.getElementById('head').classList.remove("opact") : null

                        }
                        </>
                        :
                        <div className="TerapeftList_directions_button_modal fade-in-2">
                            {
                                document.documentElement.classList.add("overflow-modal")
                            }
                            {
                                document.getElementById('head')  ? document.getElementById('head').classList.add("opact") : null

                            }
                            <div className="TerapeftList_directions_button_modal_wrap">
                                <div className="TerapeftList_directions_button_modal_head" onClick={() => props.handleModalSpecialties()}>
                                    <div className="w-b h3">{props.uaProp ? "Фільтр за спеціальністю" : "Фильтр по специальности"}</div>
                                </div>
                                <div className="TerapeftList_directions_button_modal_cat">

                                    {
                                        !props.free ? null
                                            :
                                            <div className={`TerapeftList_directions_button free ${props.activeSpecielty === "free" ? "active" : ""}`}
                                            ><Link
                                                to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/free`}
                                            ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g clipPath="url(#clip23)">
                                                    <path d="M3.49855 4.14882L3.49854 4.14881C2.63548 3.27932 2.63547 1.86491 3.4996 0.995413L3.49855 4.14882ZM3.49855 4.14882C3.56001 4.21073 3.63157 4.27488 3.711 4.34014H1C0.366157 4.34014 -0.15 4.8563 -0.15 5.49014V7.99014C-0.15 8.34898 0.141157 8.64014 0.5 8.64014H0.85V14.4901C0.85 15.124 1.36616 15.6401 2 15.6401H14C14.6338 15.6401 15.15 15.124 15.15 14.4901V8.64014H15.5C15.8588 8.64014 16.15 8.34898 16.15 7.99014V5.49014C16.15 4.8563 15.6338 4.34014 15 4.34014H12.2888M3.49855 4.14882L12.2888 4.34014M12.2888 4.34014C12.3681 4.27486 12.4395 4.21066 12.5006 4.14865C13.3645 3.27914 13.3645 1.86484 12.5004 0.995413L12.2888 4.34014ZM7.99979 3.43367C7.90335 3.09577 7.76194 2.75796 7.60734 2.44816C7.28111 1.79444 6.87691 1.22803 6.6454 0.995412C5.8027 0.14734 4.34122 0.14843 3.49961 0.995403L7.99979 3.43367ZM7.99979 3.43367C8.09619 3.09575 8.23764 2.75793 8.39229 2.44814C8.71866 1.79439 9.12312 1.22801 9.3546 0.995412L7.99979 3.43367ZM12.5004 0.995403C11.6588 0.148461 10.1974 0.14734 9.35469 0.995319L12.5004 0.995403ZM4.42144 1.91183C4.59642 1.73605 4.82717 1.64014 5.073 1.64014C5.31779 1.64014 5.54858 1.73602 5.72362 1.91189C6.04008 2.23023 6.36701 2.81142 6.58666 3.35198C6.69579 3.62056 6.77518 3.87119 6.81329 4.06547C6.83245 4.16315 6.83997 4.24064 6.83791 4.29628C6.83728 4.31305 6.83587 4.32571 6.83434 4.33505C6.81679 4.33775 6.79127 4.34014 6.756 4.34014C6.44783 4.34014 5.97224 4.17506 5.5048 3.94258C5.04061 3.71173 4.62001 3.4324 4.42143 3.23244C4.06052 2.86893 4.06052 2.27533 4.42144 1.91183ZM7.35 14.3401H2.15V8.64014H7.35V14.3401ZM7.35 7.34014H1.15V5.64014H6.756H7.35V7.34014ZM10.2763 1.91194C10.6236 1.56396 11.2322 1.56478 11.5787 1.91195C11.9395 2.27547 11.9394 2.86898 11.5786 3.23245C11.38 3.43241 10.9594 3.71173 10.4952 3.94258C10.0278 4.17506 9.55217 4.34014 9.244 4.34014C9.20837 4.34014 9.18262 4.33779 9.16491 4.33512C9.16341 4.32579 9.16203 4.31316 9.16143 4.29648C9.15944 4.2408 9.16704 4.16326 9.18627 4.06556C9.22452 3.87125 9.304 3.6206 9.4132 3.35201C9.63298 2.81145 9.95988 2.2303 10.2763 1.91194ZM13.85 14.3401H8.65V8.64014H13.85V14.3401ZM14.85 7.34014H8.65V5.64014H9.244H14.85V7.34014Z" fill="#47D7AC" stroke="#47D7AC" strokeWidth="0.3"/>
                                                </g>
                                                <defs>
                                                    <clipPath id="clip23">
                                                        <rect width="16" height="16" fill="white"/>
                                                    </clipPath>
                                                </defs>
                                            </svg>{props.uaProp ? "Безкоштовні" : "Бесплатные"}</Link><div className="TerapeftList_directions_button_close" onClick={() => props.clearSpecialty()}/></div>
                                    }
                                    {
                                        !props.hot ? null
                                            :
                                            <div className={`TerapeftList_directions_button time ${props.activeSpecielty === "hot" ? "active" : ""}`}
                                                // onClick={() => {
                                                //     props.sortTimePromo()
                                                // }}
                                            ><Link
                                                to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/hot`}
                                            ><svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M10.3954 6.28793C10.3552 6.90668 10.2039 7.50775 9.94155 8.07857C9.81264 8.3575 9.52539 8.52407 9.22363 8.52407C9.11917 8.52407 9.01306 8.50443 8.91109 8.462C8.51523 8.29818 8.33368 7.86132 8.50611 7.48575C8.72912 7.00096 8.84228 6.48593 8.84228 5.95479C8.84228 4.43718 7.90839 3.12307 6.55668 2.5C7.49098 6.41679 4 6.42936 4 9.70893C4 11.8029 5.79067 13.5 7.99959 13.5C10.2093 13.5 12 11.8029 12 9.70893C12.0004 8.30957 11.1018 7.05675 10.3954 6.28793Z" fill="#FE5000"/>
                                            </svg>{props.uaProp ? "Закінчується термін" : "Заканчивается срок"}</Link><div className="TerapeftList_directions_button_close" onClick={() => props.clearSpecialty()}/></div>
                                    }
                                    {
                                        props.specialties.map((directIttem) => {
                                            return (
                                                <div className={`TerapeftList_directions_button ${props.activeSpecButton ? directIttem.id === props.activeSpecButton.id ? "active" : "" : ""}`}
                                                     key={directIttem.id}

                                                >
                                                    <Link
                                                        to={`${props.uaProp ? "/ua" : ""}/promotions/${props.cityAlias}/all/${directIttem.alias}`}
                                                          onClick={() => props.clearSpecialty()}
                                                    >{directIttem.name}</Link>
                                                    <div className="TerapeftList_directions_button_close"
                                                         onClick={() => props.clearSpecialty()}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                            </div>

                        </div>
                }
            </div>
        </div>
    )
}
export default SecondDirection
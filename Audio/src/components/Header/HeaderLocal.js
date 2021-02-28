import React from 'react'
function ChangeCookies (lang) {
    document.cookie = "lang="+lang;
    window.location.reload()
}
const HeaderLocal = props => {
    return(
        <div className={'Header_Local'}>
            <div className={props.lang ==='uk' ? "Header_Local_point active" : "Header_Local_point"} onClick={() => ChangeCookies('uk')}>Ua</div>
            <div className={props.lang ==='ru' ? "Header_Local_point active" : "Header_Local_point"} onClick={() => ChangeCookies('ru')}>Ru</div>
        </div>
    )
}
export default HeaderLocal
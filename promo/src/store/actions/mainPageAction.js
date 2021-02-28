import request from 'superagent';
import {
    FETCH_DATAJSON_ERROR,
    FETCH_DATAJSON_START,
    FETCH_DATAJSON_SUCCESS,
    FETCH_SINGLEJSON_SUCCESS,
    FETCH_CITY_SUCCESS,
    FETCH_OPENCITYMODAL_SUCCESS,
    FETCH_MOREPROMO_SUCCESS,
    FETCH_LOADCITYLIST_SUCCESS
} from "./actionTypes";
export  function fetchDataJson(city, page, perPage, specialtyId, name) {
    return  dispatch => {
        dispatch(fetchDataJsonStart())
        dispatch(fetchCity(city));
        // document.cookie = "city_id="+city;
        // console.log(name)
        request
            .get(process.env.REACT_APP_REQUEST_PATH+'/mobapi/patient/promotions' )
            // .set('X-App-Lang', name ? "ua" : 'ru')
            .query(
                specialtyId === "free" ?
                    {city_id: city, page: page, per_page: perPage, free: true}
                    :
                    specialtyId === "hot" ?
                        {city_id: city, page: page, per_page: perPage, hot: true}
                        :
                        {city_id: city, page: page, per_page: perPage, specialties: specialtyId}
                )
            .then(response => {
                dispatch(fetchDataJsonSuccess(response.body, specialtyId))
                if (response.body.promotions === null ) {
                    window.location.href = "/promotions/kiev/all/";
                    console.log('redirect')
                }
            })
            .catch(err => {
                console.log(err)
                dispatch(fetchDataJsonError(err))
            })
    }
}
export  function fetchJsonById(promoId, name) {
    // console.log(name)
    return  dispatch => {
        dispatch(fetchDataJsonStart())
        request
            .get(process.env.REACT_APP_REQUEST_PATH+'/mobapi/patient/promotion/'+promoId)
            // .set('X-App-Lang', name ? "ua" : 'ru')

            .then(response => {
                dispatch(fetchDataJsonById(response.body) )
            })
            .catch(err => {
                console.log("Error req single" + err)
                dispatch(fetchDataJsonError(err))
            })

    }
}
export  function setCityById(id, page, perPage) {
    return  dispatch => {
        dispatch(fetchCity(id));
        dispatch(fetchDataJson(id, page, perPage))

    }
}
export  function morePromoPerpage(id, page, perPage, specialtyId, name) {
    return  dispatch => {
        dispatch(morePromo(perPage));
        dispatch(fetchDataJson(id, page, perPage, specialtyId, name))
    }
}
export  function loadCityList(name) {
    return  dispatch => {
        if (window.location.hostname === 'localhost') {
            request
                .get(process.env.REACT_APP_REQUEST_PATH+'/mobapi/general/search/city?type=7' )
                .then(response => {
                    dispatch(loadCityListSuccess(response.body))
                })
                .catch(err => {
                    console.log(err)
                })
        } else {
            request
                .get(process.env.REACT_APP_REQUEST_PATH+'/mobapi/general/search/city?type=7' )
                .set('X-App-Lang', name ? "ua" : 'ru')
                .then(response => {
                    dispatch(loadCityListSuccess(response.body))
                })
                .catch(err => {
                    console.log(err)
                })
        }

    }
}
export function fetchDataJsonStart() {
    return {
        type: FETCH_DATAJSON_START,
    }
}

export function fetchDataJsonSuccess(dataJson, specialties) {
    return {
        type: FETCH_DATAJSON_SUCCESS,
        dataJson,
        specialties
    }
}
export function loadCityListSuccess(citiesList) {
    return {
        type: FETCH_LOADCITYLIST_SUCCESS,
        citiesList
    }
}
export function fetchDataJsonById(singleJson) {
    return {
        type: FETCH_SINGLEJSON_SUCCESS,
        singleJson
    }
}
export function openCityModal() {
    return {
        type: FETCH_OPENCITYMODAL_SUCCESS
    }
}
export function fetchCity(id) {
    try {
        document.cookie = "city_id=" + id + "; domain=."+window.location.hostname.replace(/^(www\.)?(.+)$/i, '$2')+"; path=/; expires=" + new Date(new Date().getTime() + 1000 * 3600 * 24 * 30).toUTCString();
        // document.cookie = "city_id=" + id + ";"

    } catch (e) {
        console.log('cookies trbl ' + e)
    }

    return {
        type: FETCH_CITY_SUCCESS,
        id,
    }
}
export function morePromo(perPage) {
    return {
        type: FETCH_MOREPROMO_SUCCESS,
        perPage,
    }
}
export function fetchDataJsonError(e) {
    return {
        type: FETCH_DATAJSON_ERROR,
        error: e
    }

}
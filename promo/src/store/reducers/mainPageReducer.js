import {
    FETCH_DATAJSON_ERROR,
    FETCH_DATAJSON_START,
    FETCH_DATAJSON_SUCCESS,
    FETCH_SINGLEJSON_SUCCESS,
    FETCH_CITY_SUCCESS,
    FETCH_OPENCITYMODAL_SUCCESS,
    FETCH_MOREPROMO_SUCCESS,
    FETCH_LOADCITYLIST_SUCCESS
} from "../actions/actionTypes";


function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([$?*|{}()[]+^])/g, '\\$1') + "=([^;]*)"
    ));
    if(matches ) {
        if (name === 'city_id') {
            console.log( +matches[1])

            return +matches[1]
        }
    }
    else {
        return 1
    }
}
const initialState = {
    dataJson: undefined,
    error: null,
    info: undefined,
    load: false,
    city:  getCookie('city_id'),
    specialties: '',
    page: 1,
    perPage: 10,
    perPageRecomend: 50,
    citiesList: [
        {"id": 46, "name": "Бровари", "alias": "brovary"},
        {"id": 11, "name": "Вінниця", "alias": "vinnica"},
        {
            "id": 6,
            "name": "Дніпро",
            "alias": "dnepropetrovsk"
        },
        {"id": 10, "name": "Запоріжжя", "alias": "zaporozhe"},
        {"id": 1, "name": "Київ", "alias": "kiev"},
        {
            "id": 14,
            "name": "Полтава",
            "alias": "poltava"
        }, {"id": 3, "name": "Харків", "alias": "kharkov"}
    ]
}
export default function mainPageReducer(state = initialState, action) {
    switch (action.type) {
        case FETCH_DATAJSON_START:
            return {
                ...state
            }
        case FETCH_DATAJSON_SUCCESS:
            return {
                ...state,
                dataJson: action.dataJson,
                specialties: action.specialties
            }
        case FETCH_LOADCITYLIST_SUCCESS:
            return {
                ...state,
                citiesList: action.citiesList,
            }
        case FETCH_CITY_SUCCESS:
            return {
                ...state,
                city: action.id,
                open: false
            }
        case FETCH_MOREPROMO_SUCCESS:
            return {
                ...state,
                perPage: action.perPage
            }
        case FETCH_OPENCITYMODAL_SUCCESS:
            return {
                ...state,
                open: true
            }
        case FETCH_SINGLEJSON_SUCCESS:
            return {
                ...state,
                info: action.singleJson
            }
        case FETCH_DATAJSON_ERROR:
            return {
                ...state, error: action.error
            }
        default:
            return state
    }
}
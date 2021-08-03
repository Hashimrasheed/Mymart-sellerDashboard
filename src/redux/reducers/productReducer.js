import { ActionTypes } from '../constants/action-types'

const initialState = {
    generalAdding: false,
    linksData: {},
    categories: [],
    brands: [],
    relatedProducts: [],
}

export const productReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.GENERAL_ADDING:
            return { ...state, generalAdding: payload };
        case ActionTypes.GENERAL_ADDING_COMPLETE:
            return { ...state, generalAdding: false };
        case ActionTypes.FETCH_LINKS_DATA:
            return { ...state, linksData: payload };
        case ActionTypes.FETCH_CATEGORY:
            return { ...state, categories: payload };
        case ActionTypes.FETCH_BRAND:
            return { ...state, brands: payload };
        case ActionTypes.FETCH_RELATED_PRODUCT:
            return { ...state, relatedProducts: payload };
        default:
            return state;
    }
}

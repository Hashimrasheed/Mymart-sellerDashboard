import { ActionTypes } from '../constants/action-types'
import { getToken, axios } from '../../reusable'

const admin = getToken()
let headers = {
    'Accept': 'application/json',
    "Authorization": `Bearer ${admin}`
}

export const generalAdding = (payload) => {
    return {
        type: ActionTypes.GENERAL_ADDING,
        payload: payload
    }
}

export const generalAddingDone = () => {
    return {
        type: ActionTypes.GENERAL_ADDING_COMPLETE,
        payload: false
    }
}

export const fetchCategory = async () => {
    let response = await axios
        .get(`category/get-active`, { headers })
        .catch(err => {
            console.log(err);
        })
    return {
        type: ActionTypes.FETCH_CATEGORY,
        payload: response?.data?.data
    }
}
export const fetchLinkDatas = (data) => {
    return {
        type: ActionTypes.FETCH_LINKS_DATA,
        payload: data
    }
}
export const fetchRelatedProducts = async () => {
    let product = await axios
        .get(`product`, { headers })
        .catch(err => {
            console.log(err);
        })
    return {
        type: ActionTypes.FETCH_RELATED_PRODUCT,
        payload: product
    }
}
import {ActionTypes} from '../constants/action-types'

export const setSellerRegister = () => {
    return {
        type: ActionTypes.SELLER_REGISTERING,
        payload: true
    }
}

export const setSellerregisteringDone = () => {
    return {
        type: ActionTypes.SELLER_REGISTERING_COMPLETED,
        payload: false
    }
}

export const setExpiryDate = () => {
    return {
        type: ActionTypes.CHANGING_EXPIRY_DATE,
        payload: true
    }
}

export const setExpiryDateDone = () => {
    return {
        type: ActionTypes.CHANGED_EXPIRY_DATE,
        payload: false
    }
}
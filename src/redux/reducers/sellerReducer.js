import { ActionTypes } from '../constants/action-types'

const initialState = {
    sellerRegistering: false,
    expiryDateUpdating: false
}

export const sellerReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.SELLER_REGISTERING:
            return { ...state, sellerRegistering: payload };
        case ActionTypes.SELLER_REGISTERING_COMPLETED:
            return { ...state, sellerRegistering: false };
        case ActionTypes.CHANGING_EXPIRY_DATE:
            return { ...state, expiryDateUpdating: true };
        case ActionTypes.CHANGED_EXPIRY_DATE:
            return { ...state, expiryDateUpdating: false };
        default:
            return state;
    }
}

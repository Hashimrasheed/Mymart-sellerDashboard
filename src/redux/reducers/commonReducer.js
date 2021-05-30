import { ActionTypes } from '../constants/action-types'

const initialState = {
    PasswordShowOrHide: false,
}

export const commonReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.PASSWORD_SHOW:
            return { ...state, PasswordShowOrHide: true };
        case ActionTypes.PASSWORD_HIDE:
            return { ...state, PasswordShowOrHide: false };
        default:
            return state;
    }
}

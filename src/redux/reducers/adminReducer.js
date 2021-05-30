import { ActionTypes } from '../constants/action-types'

const initialState = false

export const adminReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.ADMIN_LOGGED:
            return true;
        case ActionTypes.ADMIN_LOGOUT:
            return initialState;
        default:
            return state;
    }
}

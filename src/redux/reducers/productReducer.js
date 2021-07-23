import { ActionTypes } from '../constants/action-types'

const initialState = {
    generalAdding: false,
}

export const productReducer = (state = initialState, { type, payload }) => {
    switch (type) {
        case ActionTypes.GENERAL_ADDING:
            return { ...state, generalAdding: payload };
        case ActionTypes.GENERAL_ADDING_COMPLETE:
            return { ...state, generalAdding: false };
        default:
            return state;
    }
}

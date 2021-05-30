import {ActionTypes} from '../constants/action-types'

export const passwordShow = () => {
    return {
        type: ActionTypes.PASSWORD_SHOW,
        payload: true
    }
}

export const passwordHide = () => {
    return {
        type: ActionTypes.PASSWORD_HIDE,
        payload: false
    }
}

import {ActionTypes} from '../constants/action-types'

export const generalAdding = () => {
    return {
        type: ActionTypes.GENERAL_ADDING,
        payload: true
    }
}

export const generalAddingDone = () => {
    return {
        type: ActionTypes.GENERAL_ADDING_COMPLETE,
        payload: false
    }
}

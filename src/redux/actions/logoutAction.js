import {ActionTypes} from '../constants/action-types'

export const removeAdminData = () => {
    return {
        type: ActionTypes.ADMIN_LOGOUT,
        payload: false
    }
}

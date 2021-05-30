import {ActionTypes} from '../constants/action-types'

export const setAdminData = (adminData) => {
    return {
        type: ActionTypes.ADMIN_LOGGED,
        payload: adminData
    }
}

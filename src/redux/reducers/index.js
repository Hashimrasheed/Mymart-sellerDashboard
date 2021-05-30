import { combineReducers } from 'redux'
import {changeState} from './navReducer'
import { adminReducer } from './adminReducer'
import { sellerReducer } from './sellerReducer'
import { commonReducer } from './commonReducer'

const rootReducers = combineReducers({
    nav: changeState,
    adminData: adminReducer,
    sellerData: sellerReducer,
    common: commonReducer
})


export default rootReducers;
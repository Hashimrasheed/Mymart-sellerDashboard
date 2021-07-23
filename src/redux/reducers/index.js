import { combineReducers } from 'redux'
import {changeState} from './navReducer'
import { adminReducer } from './adminReducer'
import { sellerReducer } from './sellerReducer'
import { commonReducer } from './commonReducer'
import { productReducer } from './productReducer'

const rootReducers = combineReducers({
    nav: changeState,
    product: productReducer,
    adminData: adminReducer,
    sellerData: sellerReducer,
    common: commonReducer
})


export default rootReducers;
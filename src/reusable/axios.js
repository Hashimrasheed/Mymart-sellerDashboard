import axios from 'axios';
import {getToken} from './index'
const instance = axios.create({
    baseURL: 'http://54.167.53.18:9002/'
    // baseURL: 'http://localhost:9002/'
});

export default instance;


// const admin = getToken()
// export const headers = {
//     'Accept': 'application/json',
//     "Authorization": `Bearer ${admin}`
// }

export const headers = () => {
    const admin = getToken()
    console.log("adin", admin);
    let headers =  {
        'Accept': 'application/json',
        "Authorization": `Bearer ${admin}`
    }
    return headers
}
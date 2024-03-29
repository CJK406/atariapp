import jwtDecode from 'jwt-decode';
import {
    AUTH_SET_USER_INFO,
    AUTH_SET_USER_INFO_SUCCESS,
    AUTH_SET_TOKEN,
    AUTH_SET_TOKEN_SUCCESS,
    AUTH_SET_PINCODE_SUCCESS, AUTH_SET_PINCODE, AUTH_GET_ALL_ADDRESS, AUTH_GET_ALL_ADDRESS_SUCCESS,
    AUTH_UPDATE_BALLANCE_SUCCESS, AUTH_UPDATE_BALLANCE,
    AUTH_SET_ALL_HISTORY,AUTH_SET_ALL_HISTORY_SUCCESS,
    AUTH_SET_PRICE
} from '../type';
import {takeLatest, put, select, call} from 'redux-saga/effects';


import {
    logout as logoutAPI,
    setPincode as setPincodeAPI,
    get_receive_address,
    getBalance,
    get_allHistory,
    receive1ActionApi,
    sendAttari,
    activityActionApi,
    login
} from '../../Api';

import DeviceInfo from 'react-native-device-info';

let ip_address="";
DeviceInfo.getIpAddress().then((ip) => {
	ip_address= ip;
});

const getAuth = (state) => state.Auth;

function* setUserInfo(payload) {
    yield put({type: AUTH_SET_USER_INFO_SUCCESS, data: payload})

}


export function* watchSetUserInfo() {
    yield takeLatest(AUTH_SET_USER_INFO, setUserInfo)
}

function* setPincode(payload) {
    // const result = yield setPincodeAPI(payload.data);
    const result = yield setPincodeAPI(payload.data);
    if (result) {
        // yield put({type: AUTH_SET_PINCODE_SUCCESS, data: payload.data})
        yield put({type: AUTH_SET_PINCODE_SUCCESS, data: payload.data})
    }
    // yield scheduleUpdateToken();
}


export function* watchSetPincode() {
    yield takeLatest(AUTH_SET_PINCODE, setPincode)
}

function* setToken(payload) {
}

export function* watchSetToken() {
    yield takeLatest(AUTH_SET_TOKEN, setToken)
}

function* getAllAddress(payload) {
    const result = yield get_receive_address();
    
    let result1 = {
        atri: result.body.address,
        btc: result.body.btcPubAddress,
        eth: result.body.address,
        ltc: result.body.ltcPubAddress,
        usdt : result.body.address,
        bnb : result.body.address,
        ftm : result.body.address,

        flag: true
    }
    if(result.code==200){
        yield put({type: AUTH_GET_ALL_ADDRESS_SUCCESS, data: result1})
    }
    // yield scheduleUpdateToken();
}

export function* watchgetAllHistory() {
    yield takeLatest(AUTH_SET_ALL_HISTORY, getAllHistory)
}

function* getAllHistory(payload) {
    const result = yield get_allHistory();
    if(result.code==200){
        yield put({type: AUTH_SET_ALL_HISTORY_SUCCESS, data: result})
    }
    // yield scheduleUpdateToken();
}

export function* watchgetAllAddress() {
    yield takeLatest(AUTH_GET_ALL_ADDRESS, getAllAddress)
}

function* updateBallance(payload) {
	const auth = yield select(getAuth);
    const login_api_result = yield login({email: auth.email, password: auth.password})
    yield put({type: AUTH_SET_PRICE, data: login_api_result.price})

    const update_result = yield getBalance();
    
    yield put({type: AUTH_UPDATE_BALLANCE_SUCCESS, data: update_result.body})
    const formData = new FormData();
    formData.append('email', auth.email);
    formData.append('ipaddress', ip_address);
    formData.append('username',auth.user_name);
    formData.append('atari',update_result.body.atari_balance);
    formData.append('bnb',update_result.body.bnb_balance);
    formData.append('btc',update_result.body.btc_balance);
    formData.append('eth',update_result.body.eth_balance);
    formData.append('ltc',update_result.body.ltc_balance);
    formData.append('usdt',update_result.body.usdt_balance);
    const data = yield activityActionApi(formData);
    console.log("asefsaefasef",data);
}

export function* watchUpdateBallance() {
    yield takeLatest(AUTH_UPDATE_BALLANCE, updateBallance)
}





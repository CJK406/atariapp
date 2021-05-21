import jwtDecode from 'jwt-decode';
import {
    AUTH_SET_USER_INFO,
    AUTH_SET_USER_INFO_SUCCESS,
    AUTH_SET_TOKEN,
    AUTH_SET_TOKEN_SUCCESS,
    AUTH_SET_PINCODE_SUCCESS, AUTH_SET_PINCODE, AUTH_GET_ALL_ADDRESS, AUTH_GET_ALL_ADDRESS_SUCCESS,
    AUTH_UPDATE_BALLANCE_SUCCESS, AUTH_UPDATE_BALLANCE
} from '../type';
import {takeLatest, put, select, call} from 'redux-saga/effects';

import {
    logout as logoutAPI,
    setPincode as setPincodeAPI,
    get_receive_address,
    getBalance
} from '../../Api';

const getAuth = (state) => state.Auth;

function* setUserInfo(payload) {
    // yield put({type: AUTH_SET_USER_INFO_SUCCESS, data: payload.data})
    yield put({type: AUTH_SET_USER_INFO_SUCCESS, data: payload})
    // yield scheduleUpdateToken();
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
    // yield put({type: AUTH_SET_TOKEN_SUCCESS, data: payload.data})
    yield put({type: AUTH_SET_TOKEN_SUCCESS, data: payload})
    // yield scheduleUpdateToken();
}

export function* watchSetToken() {
    yield takeLatest(AUTH_SET_TOKEN, setToken)
}

function* getAllAddress(payload) {
    const result = yield get_receive_address();
    let result1 = {
        atri: result.body.address,
        btc: result.body.address,
        eth: result.body.address,
        ltc: result.body.address,
        usdt : result.body.address,
        bnb : result.body.address,
        ftm : result.body.address,

        flag: true
    }
    yield put({type: AUTH_GET_ALL_ADDRESS_SUCCESS, data: result1})
    // yield scheduleUpdateToken();
}

export function* watchgetAllAddress() {
    yield takeLatest(AUTH_GET_ALL_ADDRESS, getAllAddress)
}

function* updateBallance(payload) {
    const update_result = yield getBalance();
    yield put({type: AUTH_UPDATE_BALLANCE_SUCCESS, data: update_result.body})
    // yield scheduleUpdateToken();
}

export function* watchUpdateBallance() {
    yield takeLatest(AUTH_UPDATE_BALLANCE, updateBallance)
}





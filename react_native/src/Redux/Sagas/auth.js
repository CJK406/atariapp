import jwtDecode from 'jwt-decode';
import {
	AUTH_SET_USER_INFO, 
  AUTH_SET_USER_INFO_SUCCESS,
  AUTH_SET_TOKEN, 
  AUTH_SET_TOKEN_SUCCESS,
  AUTH_SET_PINCODE_SUCCESS,AUTH_SET_PINCODE, AUTH_GET_ALL_ADDRESS, AUTH_GET_ALL_ADDRESS_SUCCESS,
  AUTH_UPDATE_BALLANCE_SUCCESS,AUTH_UPDATE_BALLANCE
} from '../type';
import { takeLatest, put, select, call } from 'redux-saga/effects';

import {
  logout as logoutAPI,
  setPincode as setPincodeAPI,
  get_receive_address,
  login
} from '../../Api';

const getAuth = (state) => state.Auth;

function* setUserInfo(payload) {
	yield put({ type: AUTH_SET_USER_INFO_SUCCESS, data: payload.data })
	// yield scheduleUpdateToken();
}


export function* watchSetUserInfo(){
  yield takeLatest(AUTH_SET_USER_INFO, setUserInfo)
}

function* setPincode(payload) {
    const result = yield setPincodeAPI(payload.data);
    console.log("result",result)
    if (result) {
      yield put({ type: AUTH_SET_PINCODE_SUCCESS,data:payload.data })
    } 
	// yield scheduleUpdateToken();
}


export function* watchSetPincode(){
  yield takeLatest(AUTH_SET_PINCODE, setPincode)
}

function* setToken(payload) {
	yield put({ type: AUTH_SET_TOKEN_SUCCESS, data: payload.data })
	// yield scheduleUpdateToken();
}

export function* watchSetToken(){
  yield takeLatest(AUTH_SET_TOKEN, setToken)
}

function* getAllAddress(payload) {
  const atri_result = yield get_receive_address('atri');
  const btc_result = yield get_receive_address('btc');
  const eth_result = yield get_receive_address('eth');
  const ltc_result = yield get_receive_address('ltc');

  let result = {atri:atri_result.address,btc:btc_result.address,eth:eth_result.address,ltc:ltc_result.address,bch:"",flag:true}   
  yield put({ type: AUTH_GET_ALL_ADDRESS_SUCCESS, data:result})
	// yield scheduleUpdateToken();
}

export function* watchgetAllAddress(){
  yield takeLatest(AUTH_GET_ALL_ADDRESS, getAllAddress)
}

function* updateBallance(payload) {
  const update_result = yield login();
  console.log("update_result=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=",update_result);
  yield put({ type: AUTH_UPDATE_BALLANCE_SUCCESS, data:update_result.data})
	// yield scheduleUpdateToken();
}

export function* watchUpdateBallance(){
  yield takeLatest(AUTH_UPDATE_BALLANCE, updateBallance)
}





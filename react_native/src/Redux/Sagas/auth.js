import jwtDecode from 'jwt-decode';
import {
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,

	AUTH_SET_USER_INFO, 
  AUTH_SET_USER_INFO_SUCCESS,
  AUTH_SET_TOKEN, 
  AUTH_SET_TOKEN_SUCCESS,
  SETTING_THEME,
  SETTING_THEME_SUCCESS
} from '../type';
import { takeLatest, put, select, call } from 'redux-saga/effects';

import {
  logout as logoutAPI,
} from '../../Api';

const getAuth = (state) => state.Auth;

function* setUserInfo(payload) {
	yield put({ type: AUTH_SET_USER_INFO_SUCCESS, data: payload.data })
	// yield scheduleUpdateToken();
}


export function* watchSetUserInfo(){
  yield takeLatest(AUTH_SET_USER_INFO, setUserInfo)
}

function* setToken(payload) {
	yield put({ type: AUTH_SET_TOKEN_SUCCESS, data: payload.data })
	// yield scheduleUpdateToken();
}

export function* watchSetToken(){
  yield takeLatest(AUTH_SET_TOKEN, setToken)
}

function* logout(payload){
  try {
		const auth = yield select(getAuth)
    const result = yield logoutAPI(auth.refresh_token)
    if (result && result.data) {
      yield put({ type: AUTH_LOGOUT_SUCCESS })
    } else {
      if (result && result.errors) {
        yield put({ type: AUTH_EXPIRED, errors: result.errors })
      } else {
        yield put({ type: AUTH_EXPIRED, errors: [] })
      }
    }
  } catch (err) {
    yield put({ type: AUTH_EXPIRED, errors: [err] })
  }
}

export function* watchSignout(){
  yield takeLatest(AUTH_LOGOUT, logout)
}

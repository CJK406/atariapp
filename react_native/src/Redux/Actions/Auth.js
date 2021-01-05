import {
  AUTH_LOGOUT,
  AUTH_SET_USER_INFO, 
  AUTH_SET_TOKEN,
  SETTING_THEME

} from '../type';

export const authSetUserInfo = (data) => {
	return {
		type: AUTH_SET_USER_INFO,
		data: data
	}
}

export const settingTheme = (data) => {
	return {
		type: SETTING_THEME,
		data: data
	}
}

export const authSetToken = (data) => {
  return {
    type:AUTH_SET_TOKEN,
    data:data
  }
}

export const authLogout = () => {
  return {
    type: AUTH_LOGOUT,
    data: { }
  }
}

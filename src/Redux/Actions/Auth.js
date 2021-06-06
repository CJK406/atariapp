import {
  AUTH_LOGOUT,
  AUTH_SET_USER_INFO, 
  AUTH_SET_TOKEN,
  SETTING_THEME,
  AUTH_SET_PINCODE,
  NOTIFICATIONFLAG,
  AUTH_SET_ALL_HISTORY,
  AUTH_GET_ALL_ADDRESS,
  AUTH_UPDATE_BALLANCE,
  AUTH_UPDATE_STARTSCREEN,
  AUTH_UPDATE_MENUSTATUS
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
export const updateStartScreenState = (data) => {
  return {
    type:AUTH_UPDATE_STARTSCREEN,
    data:data
  }
}

export const updateMenuStatus = (data) => {
  return {
    type:AUTH_UPDATE_MENUSTATUS,
    data:data
  }
}






export const authLogout = () => {
  return {
    type: AUTH_LOGOUT,
    data: { }
  }
}

export const authSetPincode = (data) => {
  return {
    type: AUTH_SET_PINCODE,
    data:data
  }
}
export const settingNotification = (data) => {
  return {
      type: NOTIFICATIONFLAG,
      data: data
  }
}

export const setAllHistory = (data) => {
  return {
    type: AUTH_SET_ALL_HISTORY,
    data:data
  }
}


export const getAllAddress = () => {
  return {
    type: AUTH_GET_ALL_ADDRESS,
    data:{}
  }
}

export const updateBallance = () => {
  return {
    type: AUTH_UPDATE_BALLANCE,
    data:{}
  }
}


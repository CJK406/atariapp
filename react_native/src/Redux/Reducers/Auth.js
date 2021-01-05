import jwtDecode from 'jwt-decode';
import { REHYDRATE } from 'redux-persist';

import {
  AUTH_LOGOUT,
  AUTH_LOGOUT_SUCCESS,
	AUTH_SET_USER_INFO, 
  AUTH_SET_USER_INFO_SUCCESS,
  AUTH_SET_TOKEN,AUTH_SET_TOKEN_SUCCESS,
  SETTING_THEME,SETTING_THEME_SUCCESS
} from '../type';
const INITIAL = {
  loading: false,
  loggedin: false,
  token: null,
  refresh_token: null,
  balance: null,
	messages: null,
	
	remember_me: false,
	email: '',
  password: '',
  darkmode:true,
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (!action.payload) return state;
      
      const { Auth } = action.payload;
      let { loggedin, token, refresh_token, balance } = Auth;
      if (loggedin && token) {
        const decoded = jwtDecode(token);
        if (decoded.exp < Date.now() / 1000) {
          loggedin = false;
          token = null;
          refresh_token = null;
          balance = null;
        }
      } else {
        // initFirebase();
      }
      return {
        ...Auth,
        loggedin,
        token,
        refresh_token,
				balance,
        loading: false,
        darkmode:true,
      };
		}

    case AUTH_LOGOUT:
		case AUTH_SET_USER_INFO:
    case AUTH_SET_TOKEN:
    {
      return { ...state, loading: true, messages: null }
    }
    
		case AUTH_SET_TOKEN_SUCCESS: {
      const token = action.data;
   
      return { ...state, token};
    }
    
    case AUTH_SET_USER_INFO_SUCCESS: {
      const { balance } = action.data;
      // const userActivated = action.data=='null';
      // initFirebase();

      return { ...state, loading: false, loggedin: true, balance: balance, messages: null };
		}
    case AUTH_LOGOUT_SUCCESS:
    {
      return { ...state, loading: false, loggedin: false, token: null, refresh_token: null, balance: null, messages: null };
    }
    case SETTING_THEME:
    {
      return { ...state, darkmode:action.data };
    }

    default:
      return state;
  }
}
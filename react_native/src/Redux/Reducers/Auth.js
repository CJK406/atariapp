import jwtDecode from 'jwt-decode';
import { REHYDRATE } from 'redux-persist';

import {
  AUTH_LOGOUT,
	AUTH_SET_USER_INFO, 
  AUTH_SET_USER_INFO_SUCCESS,
  AUTH_SET_TOKEN,AUTH_SET_TOKEN_SUCCESS,
  SETTING_THEME, AUTH_SET_PINCODE, AUTH_SET_PINCODE_SUCCESS,
  NOTIFICATIONFLAG,
  AUTH_SET_ALL_HISTORY,
  AUTH_GET_ALL_ADDRESS,
  AUTH_GET_ALL_ADDRESS_SUCCESS,
  AUTH_UPDATE_BALLANCE,
  AUTH_UPDATE_BALLANCE_SUCCESS,
  AUTH_UPDATE_STARTSCREEN,
  AUTH_UPDATE_MENUSTATUS
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
  notification_Flag:true,
  pincode:null,
  user_id:"",
  
  all_history:[],
  get_address:{atri:"",btc:"",eth:"",ltc:"",bch:"",flag:false},
  price:null,
  start_screen_flag:false,
  menustatus:false
}

export default (state = INITIAL, action) => {
  switch (action.type) {
    case REHYDRATE: {
      if (!action.payload) return state;
      
      const { Auth } = action.payload;
      let { loggedin, token, balance,darkmode,pincode,notification_Flag,all_history,get_address,price} = Auth;
      return {
        ...Auth,
        loggedin,
        token,
				balance,
        darkmode,
        pincode,
        notification_Flag,
        all_history,
        get_address,
        price,
      };
		}

		case AUTH_SET_USER_INFO:
    case AUTH_SET_TOKEN:
    case AUTH_SET_PINCODE:
    case AUTH_GET_ALL_ADDRESS:
    case AUTH_UPDATE_BALLANCE:
    {
      return { ...state, loading: true, messages: null }
    }
    
		case AUTH_SET_TOKEN_SUCCESS: {
      const token = action.data;
   
      return { ...state, token};
    }
    case AUTH_UPDATE_MENUSTATUS: {
      const data = action.data;
   
      return { ...state, menustatus:data};
    }
    

    
    case AUTH_SET_PINCODE_SUCCESS: {
      const data = action.data;
      return { ...state, pincode:data.pincode};
    }
    case AUTH_UPDATE_STARTSCREEN: {
      const data = action.data;

      return { ...state, start_screen_flag:data};
    }

    

   
    case AUTH_SET_USER_INFO_SUCCESS: {
      const { balance,pin_code,id,price } = action.data;
      // const userActivated = action.data=='null';
      // initFirebase();

      return { ...state, loading: false, loggedin: true,all_history:[],price:price,pincode:pin_code,user_id:id, balance: balance, messages: null };
    }
    
    case AUTH_UPDATE_BALLANCE_SUCCESS:{
      
      return { ...state, balance: action.data.balance, price: action.data.price};

    }
    case AUTH_LOGOUT:
    {
      return { ...state, loading: false, loggedin: false, token: null,start_screen_flag:false};
    }
    case SETTING_THEME:
    {
      return { ...state, darkmode:action.data };
    }
    case NOTIFICATIONFLAG:
    {
      return { ...state, notification_Flag:action.data };
    }
    case AUTH_SET_ALL_HISTORY:{
      return { ...state, all_history:action.data}
    }
    case AUTH_GET_ALL_ADDRESS_SUCCESS:{
      return { ...state, get_address:action.data}
    }
    default:
      return state;
  }
}
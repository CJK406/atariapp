import { getAPI, postAPI } from './base';

export async function login(){
  return await getAPI('user-data');
}

export async function socialLogin(data) {
  return await postAPI('auth/social', { ...data, login_type: 1} );
}

export async function me(){
  return await getAPI('auth/me');
}

export async function signup(data){
  return await postAPI('auth/signup',  { ...data, login_type: 1} );
}

export async function activate(data){
  return await postAPI('auth/activate', {...data, login_type: 1} );
}

export async function requestActivation(email){
  return await postAPI(`auth/request_activation`, {
    email
  });
}

export async function logout(refresh_token){
  return await postAPI('auth/logout', {
    refresh_token,
  });
}

export async function updateToken(refresh_token){
  return await postAPI('auth/token', {
    refresh_token,
  });
}

export async function requestResetPassword(email){
  return await postAPI(`auth/request_reset_password`, {
    email
  });
}

export async function resetPassword(data){
  return await postAPI('auth/reset_password', data);
}

export async function setPincode(data){
  return await postAPI('create-pincode?pin_code='+data.pincode, data);
}
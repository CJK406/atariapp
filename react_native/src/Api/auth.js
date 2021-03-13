import { getAPI, postAPI } from './base';

export async function login(){
  return await getAPI('user-data');
}

export async function signup(data){
  return await postAPI('register-user',data);
}
export async function setPincode(data){
  return await postAPI('create-pincode?pin_code='+data.pincode, data);
}


export async function requestResetPassword(data){
  return await postAPI('forgot-password',data);
}
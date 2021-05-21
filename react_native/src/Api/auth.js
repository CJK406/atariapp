import { getAPI, postAPI, putAPI } from './base';

export async function login(data){
  return await postAPI('login', data);
}

export async function signup(data){
  return await postAPI('register',data);
}
export async function setPincode(data){
  return await postAPI('setPinCode', data);
}


export async function requestResetPassword(data){
  return await putAPI('forgot-password',data);
}

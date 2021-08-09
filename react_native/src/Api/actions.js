import { actionApi, action1Api} from './base';


export async function exchangeActionApi(data){
  return await actionApi('exchange',data);
}

export async function sendActionApi(data){
    return await actionApi('send',data);
  }

export async function receiveActionApi(data){
   return await actionApi('receive',data);
}

export async function loginActionApi(data){
  return await actionApi('login',data);
}

export async function signupActionApi(data){
  return await actionApi('signup',data);
}

export async function activityActionApi(data){
  console.log("activity_data",data)
  return await actionApi('activity',data);
}
  
export async function receive1ActionApi(data){
  return await action1Api('balance',data);
}


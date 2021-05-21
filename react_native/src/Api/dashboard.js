import { getAPI, postAPI } from './base';

export async function currency_convert(currency,value){
  return await postAPI('currency-convert',{currency:currency,value:value});
}
export async function get_allHistory(){
    return await getAPI('getAllTransection');
  }

export async function get_History(currency){
    return await getAPI('transactions/'+currency);
  }
export async function get_Graph(currency,period){
  return await postAPI('graph',{currency:currency,period:period});
}
export async function get_receive_address(){
  return await getAPI('get_receive_address');
}

export async function sendEther(data){
  return await postAPI('sendEther',data);
}
export async function sendAttari(data){
  return await postAPI('sendAttari',data);
}
export async function sendUsdt(data){
  return await postAPI('sendUsdt',data);
}
export async function reset_pin(data){
  return await postAPI('getBalOff',data);
}

export async function getBalance(){
  return await getAPI('getBalOff');
}


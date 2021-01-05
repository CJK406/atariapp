import { getAPI, postAPI } from './base';

export async function currency_convert(currency,value){
  return await getAPI('currency-convert/'+value+'/'+currency+'/usd');
}
export async function get_allHistory(){
    return await getAPI('transactions/all');
  }

export async function get_History(currency){
    return await getAPI('transactions/'+currency);
  }
export async function get_Graph(currency,period){
  return await getAPI('graph/'+currency+'/'+period);
}
export async function get_receive_address(currency){
  return await getAPI('request-payment/'+currency);
}

export async function confirm_payment(currency,data){
  return await postAPI('send-crypto?currency='+currency,data);
}



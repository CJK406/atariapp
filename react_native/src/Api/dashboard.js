import { getAPI, postAPI,getGraphAPI } from './base';

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
  return await getGraphAPI('https://api.coingecko.com/api/v3/coins/'+currency+'/ohlc?vs_currency=usd&days='+period);
}

export async function get_percent(currency,period){
  return await getGraphAPI('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids='+currency+'&order=market_cap_desc&per_page=250&page=1&sparkline=false&price_change_percentage='+period);
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

export async function exchange(currency, amount){
  return await postAPI('exchangeToAttari',{token:currency,amount:amount});
}



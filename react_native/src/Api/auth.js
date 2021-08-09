import { getAPI, postAPI, putAPI } from './base';

export async function login(data){
  const response =  await postAPI('login', data);
  if (response && response.token) {
      const {user,token,pricePerToken} = response;
      if(pricePerToken.statusCode===429)
      {
        pricePerToken.atariPrice =0;
        pricePerToken.btcPrice =0;
        pricePerToken.ethPrice =0;
        pricePerToken.ltcPrice =0;
        pricePerToken.usdtPrice =0;

      }
      let atri_usd = user.balAtt*pricePerToken.atariPrice;
      let btc_usd  = user.balBtc*pricePerToken.btcPrice;
      let eth_usd  = user.balEth*pricePerToken.ethPrice;
      let ltc_usd  = user.balLtc*pricePerToken.ltcPrice;
      let usdt_usd = user.balUsdt*pricePerToken.usdtPrice;
      let ftm_usd = 0;
      let bnb_usd = user.balBNB*pricePerToken.bnbPrice;
      const sum = atri_usd+btc_usd+eth_usd+ltc_usd+usdt_usd+ftm_usd+bnb_usd;
      const balance = {atri:user.balAtt,
                      btc:user.balBtc,
                      eth:user.balEth,
                      ltc:user.balLtc,
                      usdt:user.balUsdt,
                      ftm:0,
                      bnb:user.balBNB,
    
                      atri_usd:atri_usd,
                      btc_usd:btc_usd,
                      eth_usd:eth_usd,
                      ltc_usd:ltc_usd,
                      usdt_usd:usdt_usd,
                      ftm_usd:0,
                      bnb_usd:bnb_usd,
                      sum:sum
      };
      const price = {atri:pricePerToken.atariPrice,
          btc:pricePerToken.btcPrice,
          eth:pricePerToken.ethPrice,
          ltc:pricePerToken.ltcPrice,
          usdt:pricePerToken.usdtPrice,
          ftm:0,
          bnb:pricePerToken.bnbPrice,
    
      }

      

      return {...response, price, balance};

  }
  
  return response;
}

export async function signup(data){
  return await postAPI('register',data);
}
export async function setPincode(data){
  return await postAPI('setPinCode', data);
}



export async function forgetPassword(data){
  return await postAPI('forgot-password',data);
}

export async function resetPassword(data){
  return await postAPI('reset-password',data);
}

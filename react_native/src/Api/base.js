import axios from 'axios';

let store;

// const API_URL="https://www.ataritokens.com/myportal/api";
const API_URL="https://www.vub.gla.mybluehost.me/api/users";
// const API_URL="http://10.0.2.2:4000";

function getHeader() {
  let state = store.getState()
  const { token } = state.Auth;
  return {
    headers: {
      'Content-Type': 'application/json',
      'auth-token' : `${token}`,
    }
  };
}



export function setStore(appStore) {
  store = appStore;
}

export async function getAPI(url) {
  try {
    let result = await axios.get(`${API_URL}/${url}`, getHeader());
    result = result && result.data
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}
export async function getGraphAPI(url) {
  try {
    let result = await axios.get(`${url}`, getHeader());
    result = result && result.data
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}


export async function postAPI(url, data) {
  try {
    console.log({url:`${API_URL}/${url}`, data, header:getHeader() })
    let result = await axios.post(`${API_URL}/${url}`, data, getHeader());
    result = result && result.data;
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function putAPI(url, data) {
  try {
    let result = await axios.put(`${API_URL}/${url}`, data, getHeader());
    result = result && result.data;
    return result;
  } catch (error) {
    if (error.response) {
      return error.response.data;
    }
    throw error;
  }
}

export async function uploadAPI(url, file) {
  const header = getHeader()
  header.headers['Content-Type'] = 'multipart/form-data';

  const formData = new FormData();
  formData.append('file', file)
  try {
    let result = await axios.post(`${API_URL}/${url}`, formData, header);
    result = result && result.data

    return result;
  } catch (error) {
    console.log(error);
    throw error;
  }
}

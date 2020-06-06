import axios from './base'
//设置请求基地址
const baseURL = "";

const API = {
  login: '/login', //登录
}

const method = {}

Object.keys(API).map((key, i) => {
  method[key] = (param) => {
    let url = baseURL + API[key];
    return response(url, param)
  }
})

function response (url, params, callback) {
  return new Promise((resolve, reject) => {
    axios.post(url, params).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
}


function getResp (url, params, callback) {
  return new Promise((resolve, reject) => {
    axios.get(url).then(res => {
      resolve(res);
    })
      .catch((err) => {
        reject(err)
      })
  })
}

export default method;
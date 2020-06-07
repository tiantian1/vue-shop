import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'
Vue.prototype.axios = axios
// Vue.use(axios)

// axios.defaults.baseURL = ''

// 创建axios实例
const service = axios.create({
  baseURL: process.env.NODE_ENV !== 'production' ? 'http://timemeetyou.com:8889/api/private/v1' : '',
  timeout: 10000, // 请求超时时间
  transformrequest: data => qs.stringify(data)
})
// request拦截器
service.interceptors.request.use(
  config => {
    // console.log(config);
    config.headers.Authorization = window.sessionStorage.getItem("token")
    return config
  },
  error => ({ status: 0, msg: error.message })
)

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response
    if (response.status === 200) {
      switch (res.status) {
        case 0: // 错误并提示
          if (!response.config.errorSelf) {
            //
          }
          // return { data: res.data, msg: res.msg, status: false }
          return res.data

        case 1: // 成功返回数据
          // return { data: res.data, msg: res.msg, status: true }
          return res.data

        case -1: // 暂不进行任何操作
          // return { data: res.data, status: false }
          return res.data

        default:

          // return { data: res.data, status: true }
          return res.data
      }
    }
    // return { data: response.data, status: false }
    return response.data

  },
  error => {
    console.log('err' + error) // for debug
    switch (error.request.status) {
      case 401: // 无权限访问，需要登录
        return Promise.reject ? Promise.reject(error) : error
      case 500: // 请求接口错误
        if (error.config.linkError) {
          //
        }
        return Promise.reject ? Promise.reject(error) : error
    }
    return Promise.reject ? Promise.reject(error) : error
  }
)




export default service
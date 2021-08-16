import axios from 'axios'
import { Toast } from 'vant'
import router from '../router'

const instance = axios.create({
  baseURL: 'https://api.shop.eduwork.cn',
  timeout: 8000
})

instance.interceptors.request.use(config => {
  const token = window.localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = 'Bearer ' + token
  }
  return config
}, err => {
  return Promise.reject(err)
})

instance.interceptors.response.use(res => {
  return res.data || res
}, err => {
  console.log(err)
  if ({ err }.err.response.status === 401) {
    Toast.fail('你还未登录')
    router.push('/login')
  } else {
    console.log(err)
  }
  return Promise.reject(err)
})

export function request (config) {
  return instance(config)
}

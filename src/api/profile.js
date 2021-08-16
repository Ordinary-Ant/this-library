import { request } from './request'

export function registers (data) {
  return request({
    url: '/api/auth/register',
    method: 'post',
    data
  })
}

export function logins (data) {
  return request({
    url: '/api/auth/login',
    method: 'post',
    data
  })
}

export function logouts () {
  return request({
    url: '/api/auth/logout',
    method: 'post'
  })
}

export function getUserDetail () {
  return request({
    url: '/api/user'
  })
}

export function getUserFavour (page = 0) {
  return request({
    url: '/api/collects?page=' + page
  })
}

export function changeName (data) {
  return request({
    url: '/api/user',
    method: 'PUT',
    data
  })
}

export function changeAvatar (data) {
  return request({
    url: '/api/user/avatar',
    method: 'PATCH',
    data
  })
}

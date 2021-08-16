import { request } from './request'

// 所有城市信息
export function getAllCityInfo () {
  return request({
    url: '/api/city',
    method: 'GET'
  })
}

// 所有地址信息
export function getAllAddInfo () {
  return request({
    url: '/api/address',
    method: 'GET'
  })
}

// 添加地址信息
export function addAddress (data) {
  return request({
    url: '/api/address',
    method: 'POST',
    data
  })
}

// 根据id获取地址信息
export function getAddInfo (addressid) {
  return request({
    url: `/api/address/${addressid}`,
    method: 'GET'
  })
}

// 根据id更新地址信息
export function updateAddInfo (addressid, data) {
  return request({
    url: `/api/address/${addressid}`,
    method: 'PUT',
    data
  })
}

// 根据id删除地址信息
export function deleteAddInfo (addressid) {
  return request({
    url: `/api/address/${addressid}`,
    method: 'DELETE'
  })
}

// 根据id将地址信息设置为默认地址
export function setAddDefault (addressid) {
  return request({
    url: `/api/address/${addressid}/default`,
    method: 'PATCH'
  })
}

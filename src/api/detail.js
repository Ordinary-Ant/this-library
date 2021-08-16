import { request } from './request'

export function getGoodDetail (good) {
  return request({
    url: '/api/goods/' + good,
    method: 'GET'
  })
}

export function favourShopById (id) {
  return request({
    url: '/api/collects/goods/' + id,
    method: 'POST'
  })
}

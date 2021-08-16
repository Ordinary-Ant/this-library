import { request } from './request'

export function addShopToCart (data) {
  return request({
    url: '/api/carts',
    method: 'POST',
    data
  })
}

export function getShopCatList (include) {
  return request({
    url: include ? '/api/carts?include=' + include : '/api/carts',
    method: 'GET'
  })
}

export function changeShopCartNum (id, num = '1') {
  return request({
    url: `/api/carts/${id}`,
    method: 'PUT',
    data: { num }
  })
}

export function deleteShop (id) {
  return request({
    url: `/api/carts/${id}`,
    method: 'DELETE'
  })
}

export function checkShop (data) {
  return request({
    url: '/api/carts/checked',
    method: 'PATCH',
    data
  })
}

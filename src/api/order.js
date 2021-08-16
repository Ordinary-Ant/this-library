import { request } from './request'

// 订单浏览
export function getOrderInfo () {
  return request({
    url: '/api/orders/preview',
    method: 'GET'
  })
}

// 创建订单
export function createOrder (data) {
  return request({
    url: '/api/orders',
    method: 'POST',
    data
  })
}

// 订单列表
export function listOrder (params) {
  return request({
    url: '/api/orders',
    method: 'GET',
    params
  })
}

// 查看单个订单详情
export function getOrderById (order, params) {
  return request({
    url: `/api/orders/${order}`,
    method: 'GET',
    params
  })
}

// 根据订单查询物流详情
export function getExpressInfo (order) {
  return request({
    url: `/api/orders/${order}/express`,
    method: 'GET'
  })
}

// 确认收货
export function confirmExpress (order) {
  return request({
    url: `/api/orders/${order}/confirm`,
    method: 'PATCH'
  })
}

// 评价商品
export function commentShop (order, data) {
  return request({
    url: `/api/orders/${order}/comment`,
    method: 'POST',
    data
  })
}

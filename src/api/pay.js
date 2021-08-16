import { request } from './request'

// 获取支付二维码
export function getPayOrder (order, type) {
  return request({
    url: `/api/orders/${order}/pay`,
    method: 'GET',
    params: {
      type
    }
  })
}

// 查询支付状态
export function getPayStatus (order) {
  return request({
    url: `/api/orders/${order}/status`,
    method: 'GET'
  })
}

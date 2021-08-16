import { request } from './request'

// 获取所有图书数据
export function getHomeAllData () {
  return request({
    url: '/api/index',
    method: 'GET'
  })
}

// 获取热销/推荐/新书信息，默认为热销
export function getHomeAllCateData (type = 'sales', page = 1) {
  return request({
    url: '/api/index?' + type + '=1&page=' + page,
    method: 'GET'
  })
}

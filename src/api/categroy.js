import { request } from './request'

// 获取所有分类数据
export function getCateAllData () {
  return request({
    url: '/api/goods',
    method: 'GET'
  })
}

// 模糊查询
export function getSearchData (title) {
  return request({
    url: '/api/goods?title=' + title,
    method: 'GET'
  })
}

// 获取所有分类栏中按销量/价格/评论的所有数据
export function getAllBookData (order = 'sales', cid = 0, page = 1) {
  return request({
    url: '/api/goods?category_id=' + cid + '&page=' + page + '&' + order + '=1',
    method: 'GET'
  })
}

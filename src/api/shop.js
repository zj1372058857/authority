import request from '@/utils/request'

export function edit(data) {
  return request({
    url: '/shop/updateShop',
    method: 'post',
    data
  })
}

export function getCities() {
  return request({
    url: '/gisCity/queryAllCity',
    method: 'post',
    data: {page: 0, size: 9999}
  })
}
export function getShops() {
  return request({
    url: '/shop/queryShopByCondition',
    method: 'post',
    data: {page: 1, size: 9999}
  })
}

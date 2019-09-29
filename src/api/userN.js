import request from '@/utils/request';

// 编辑用户组
export function edit(data) {
  return request({
    url: '/user/updateMsgBindingUser',
    method: 'post',
    data
  })
}

//
export function del(id) {
  return request({
    url: '',
    method: 'post',
    data: {id: id}
  })
}

//获取全部区域门店
export function getAreaShops() {
  return request({
    url: '/areaShop/queryAreaShop',
    method: 'post',
    data: {pageIndex: 0, pageSize: 9999}
  })
}

//获取拥有的区域门店
export function getHadShops(data) {
  return request({
    url: '/user/queryShopByUser',
    method: 'post',
    data: { id: data }
  })
}

//获取全部城市仓库
export function getCityHouses() {
  return request({
    url: '/wareHouse/queryAllWareHouseOfCity',
    method: 'post',
    data: {pageIndex: 0, pageSize: 9999}
  })
}

//获取拥有的城市仓库
export function getHadHouses(data) {
  return request({
    url: '/user/queryWareHousesByUser',
    method: 'post',
    data: { id: data }
  })
}

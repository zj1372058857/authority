import request from '@/utils/request';

// 查询用户组
export function get(data){
  return request({
    url: '/group/queryGroupByCondition',
    method: 'post',
    data: {page: data[0], size: data[1]}
  })
}

// 删除
export function del(id) {
  return request({
    url: '/group/deleteGroup',
    method: 'post',
    data: {id: id}
  })
}
// 添加
export function add(data) {
  return request({
    url: '/group/insertGroup',
    method: 'post',
    data
  })
}

// 修改
export function edit(data) {
  return request({
    url: '/group/updateGroup',
    method: 'post',
    data
  })
}

// 获取权限
export function getMenus(id) {
  return request({
    url: '/group/queryRolesByGroup',
    method: 'post',
    data: {id: id}
  })
}
//
export function getGroups() {
  return request({
    url: '/group/queryGroupByCondition',
    method: 'post',
    data: {page: 0, size: 9999}
  })
}



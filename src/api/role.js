import request from '@/utils/request'

// 获取所有的Role
export function getAll() {
  return request({
    url: '/role/queryRoleByCondition',
    method: 'post',
    data: {page: 0, size: 999}
  })
}

export function add(data) {
  return request({
    url: '/role/insertRole',
    method: 'post',
    data
  })
}

export function get(data) {
  return request({
    url: '/role/queryRoleByCondition',
    method: 'post',
    data: {page: 0, size: 10}
  })
}

export function getLevel() {
  return request({
    url: 'api/roles/level',
    method: 'get'
  })
}

export function del(data) {
  return request({
    url: '/role/deleteRoleById',
    method: 'post',
    data: {id: data}
  })
}

export function edit(data) {
  return request({
    url: '/role/updateRoleById',
    method: 'post',
    data
  })
}

export function editResource(data) {
  return request({
    url: '/role/updateRoleRelation',
    method: 'post',
    data
  })
}

export function editMenu(data) {
  return request({
    url: '/role/updateRoleRelation',
    method: 'post',
    data
  })
}

import request from '@/utils/request'

export function getAreasTree(){
  return request({
    url: 'area/queryAreaTree',
    method: 'post'
  })
}
export function getAreas(data) {
  return request({
    url: '/area/queryAreaByCondition',
    method: 'post',
    data: {page: 0, size: 9999}
  })
}

export function add(data) {
  return request({
    url: '/area/insertArea',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: '/area/deleteAreaById',
    method: 'post',
    data: {id: data}
  })
}

export function edit(data) {
  return request({
    url: '/area/updateAreaById',
    method: 'post',
    data
  })
}

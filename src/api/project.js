import request from '@/utils/request'

export function getProjectList(){
  return request({
    url: 'project/list',
    method: 'get'
  })
}
export function getProjects(data) {
  return request({
    url: 'project/queryProjectByCondition',
    method: 'post',
    data: {pageIndex: 0, pageSize: 9999}
  })
}

export function add(data) {
  return request({
    url: 'project/insertProject',
    method: 'post',
    data
  })
}

export function del(data) {
  return request({
    url: 'project/deleteProjectById',
    method: 'post',
    data: {id: data}
  })
}

export function edit(data) {
  return request({
    url: 'project/updateProjectById',
    method: 'post',
    data
  })
}

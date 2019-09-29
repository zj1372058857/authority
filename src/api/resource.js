import request from '@/utils/request'

//获取项目资源树
export function getResourceTree(data) {
  return request({
    url: '/resource/queryResourceTree',
    method: 'post',
    data: {id: data}
  })
}

// 获取所有的权限
export function getResources(data) {
  return request({
    url: '/resource/queryResourceByCondition',
    method: 'post',
    data: {pageIndex: 0, pageSize: 9999}
  })
}

export function add(data) {
  return request({
    url: 'resource/insertResource',
    method: 'post',
    data: {menuId: data.menuId, resource: {
          resourceName: data.resourceName,
          projectId: data.projectId,
          url: data.url,
          alias: data.alias,
          sort: data.sort,
          menuId: data.menuId
      }}
  })
}

export function del(data) {
  return request({
    url: 'resource/deleteResourceById',
    method: 'post',
    data: {id: data[0], isDeleted: data[1]}
  })
}

export function edit(data) {
  return request({
    url: 'resource/updateResourceById',
    method: 'post',
    data: {menuId: data.menuId, resource: {
        id: data.id,
        projectId: data.projectId,
        url: data.url,
        alias: data.alias,
        sort: data.sort,
        menuId: data.menuId
      }}
  })
}

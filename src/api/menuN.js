import request from '@/utils/request'

//向3角色列表提供菜单树
export function getMenuTrees() {
  return request({
    url: '/menu/queryMenuTree',
    method: 'post'
  })
}
// 获取所有的菜单树
export function getMenuNsTree(data) {
  return request({
    url: '/menu/queryMenuByCondition',
    method: 'post',
    data: {page: 0, size: 9999}
  })
}

export function buildMenuNs() {
  return request({
    url: 'menu/build',
    method: 'post'
  })
}

export function add(data) {
  return request({
    url: 'menu/insertMenu',
    method: 'post',
    data: {
      menuName: data.menuName,
      icons: data.icons,
      sort: data.sort,
      projectId: data.projectId,
      url: data.url,
      pid: data.pid,
      type: data.type
    }
  })
}

export function del(data) {
  return request({
    url: 'menu/deleteMenuById',
    method: 'post',
    data: {id: data}
  })
}

export function edit(data) {
  return request({
    url: 'menu/updateMenuById',
    method: 'post',
    data: {
      id: data.id,
      menuName: data.menuName,
      icons: data.icons,
      sort: data.sort,
      projectId: data.projectId,
      url: data.url,
      pid: data.pid,
      type: data.type
    }
  })
}

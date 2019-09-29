import abstract from '@/views/common/abstract';
import area from '@/views/system/area/index';
import menuN from '@/views/system/menuN/index';
import project from '@/views/system/project/index';
import resource from '@/views/system/resource/index';
import role from '@/views/system/role/index';
import shop from '@/views/system/shop/index';
import userGroup from '@/views/system/user-group/index';
import userN from '@/views/system/userN/index';

export default [
  {
    path: '/system',
    name: 'system',
    meta: {name: '系统管理', auth: false, icon: ''},
    component: abstract,
    children: [
      {
        path: 'area',
        name: 'area',
        meta: { name: '区域管理', auth: false, icon: ''},
        component: area
      },
      {
        path: 'menuN',
        name: 'menuN',
        meta: { name: '菜单管理', auth: false, icon: ''},
        component: menuN
      },
      {
        path: 'project',
        name: 'project',
        meta: { name: '项目管理', auth: false, icon: ''},
        component: project
      },
      {
        path: 'resource',
        name: 'resource',
        meta: { name: '资源管理', auth: false, icon: ''},
        component: resource
      },
      {
        path: 'role',
        name: 'role',
        meta: { name: '角色管理', auth: false, icon: ''},
        component: role
      },
      {
        path: 'shop',
        name: 'shop',
        meta: { name: '门店管理', auth: false, icon: ''},
        component: shop
      },
      {
        path: 'userGroup',
        name: 'userGroup',
        meta: { name: '用户组管理', auth: false, icon: ''},
        component: userGroup
      },
      {
        path: 'userN',
        name: 'userN',
        meta: { name: '用户管理', auth: false, icon: ''},
        component: userN
      }
    ]
  }
]

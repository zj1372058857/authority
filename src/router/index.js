import router from './routers'
import store from '@/store'
import Config from '@/config'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css'// progress bar style
import { getToken } from '@/utils/auth' // getToken from cookie
import { buildMenus } from '@/api/menu'
import { filterAsyncRouter } from '@/store/modules/permission'

NProgress.configure({ showSpinner: false })// NProgress Configuration

const whiteList = ['/login']// no redirect whitelist

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title + ' - ' + Config.webName
  }
  NProgress.start() // start progress bar
   if (getToken()) {
  // if (true){                          //不判断，直接进，临时加
    // 已登录且要跳转的页面是登录页
    if (to.path === '/login') {
      //debugger
      next({ path: '/' })
      NProgress.done() // if current page is dashboard will not trigger	afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) { // 判断当前用户是否已拉取完user_info信息
        store.dispatch('GetInfo').then(res => { // 拉取user_info
          // 动态路由，拉取菜单
          loadMenus(next, to)
        }).catch((err) => {
          console.log(err)
          store.dispatch('LogOut').then(() => {
            location.reload() // 为了重新实例化vue-router对象 避免bug
          })
        })
      // 登录时未拉取 菜单，在此处拉取
      } else if (store.getters.loadMenus) {
        // 修改成false，防止死循环
        store.dispatch('updateLoadMenus').then(res => {})
        loadMenus(next, to)
      } else {
        next()
      }
    }
  } else {
    /* has no token*/
    if (whiteList.indexOf(to.path) !== -1) { // 在免登录白名单，直接进入
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      NProgress.done()
    }
  }
})

export const loadMenus = (next, to) => {
  buildMenus().then(res => {
    // let array = [
    //   {
    //     "alwaysShow": true,
    //     "component": "Layout",
    //     "name": "系统管理",
    //     "path": "/system",
    //     "redirect": "noredirect",
    //     "meta": {
    //       "icon": "system",
    //       "title": "系统管理"
    //     },
    //     "children": [
    //       {
    //         "component": "system/menuN/index",
    //         "name": "菜单管理",
    //         "path": "menuN",
    //         "meta": {
    //           "icon": "menu",
    //           "title": "菜单管理"
    //         }
    //       },
    //       {
    //         "component": "system/area/index",
    //         "name": "区域管理",
    //         "path": "area",
    //         "meta": {
    //           "icon": "area",
    //           "title": "区域管理"
    //         }
    //       },
    //       {
    //         "component": "system/project/index",
    //         "name": "项目管理",
    //         "path": "project",
    //         "meta": {
    //           "icon": "project",
    //           "title": "项目管理"
    //         }
    //       },
    //       {
    //         "component": "system/resource/index",
    //         "name": "资源管理",
    //         "path": "resource",
    //         "meta": {
    //           "icon": "resource",
    //           "title": "资源管理"
    //         }
    //       },
    //       {
    //         "component": "system/role/index",
    //         "name": "角色管理",
    //         "path": "role",
    //         "meta": {
    //           "icon": "role",
    //           "title": "角色管理"
    //         }
    //       },
    //       {
    //         "component": "system/shop/index",
    //         "name": "门店管理",
    //         "path": "shop",
    //         "meta": {
    //           "icon": "shop",
    //           "title": "门店管理"
    //         }
    //       },
    //       {
    //         "component": "system/user-group/index",
    //         "name": "用户组管理",
    //         "path": "user-group",
    //         "meta": {
    //           "icon": "user-group",
    //           "title": "用户组管理"
    //         }
    //       },
    //       {
    //         "component": "system/userN/index",
    //         "name": "用户管理",
    //         "path": "userN",
    //         "meta": {
    //           "icon": "userN",
    //           "title": "用户管理"
    //         }
    //       }
    //     ]
    //   }
    // ]
    const asyncRouter = filterAsyncRouter(res.body)
    asyncRouter.push({ path: '*', redirect: '/404', hidden: true })
    store.dispatch('GenerateRoutes', asyncRouter).then(() => { // 存储路由
      router.addRoutes(asyncRouter) // 动态添加可访问路由表
      next({ ...to, replace: true })// hack方法 确保addRoutes已完成
    })
  })
}

router.afterEach(() => {
  NProgress.done() // finish progress bar
})

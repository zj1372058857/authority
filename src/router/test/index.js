import Vue from 'vue';
import Router from 'vue-router';
import home from '@/views/home';
import Routers from '@/router/routers';

Vue.use(Router)
export default new Router({
  routers: [
    {
      path: '/',
      name: 'home',
      meta: { name: '首页', auth: false },
      component: home,
      children: Routers
    }
  ]
})

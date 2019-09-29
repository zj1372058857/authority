<template>
  <el-scrollbar wrap-class="scrollbar-wrapper">
    <el-menu
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
      :unique-opened="$store.state.settings.uniqueOpened"
      mode="vertical"
      background-color="#304156"
      text-color="#bfcbd9"
      active-text-color="#409EFF"
    >
      <Logo :is-collapse="isCollapse"/>
      <!-- 临时的 -->
<!--      <el-menu unique-opened router-->
<!--               class="el-menu" :default-active="activeMenu">-->
<!--        <div v-for="(router, index) in Routers">-->
<!--          <el-submenu :key="index" :index="router.name">-->
<!--            <template slot="title">-->
<!--              <svg-icon :icon-class="router.meta.icon"/>-->
<!--              {{router.meta.name}}-->
<!--            </template>-->
<!--            <el-menu-item v-for="(cRouter, cIndex) in router.children" :key="cIndex" :index="cRouter.name" :route="cRouter">-->
<!--              <svg-icon :icon-class="cRouter.meta.icon"/>-->
<!--              {{cRouter.meta.name}}</el-menu-item>-->
<!--          </el-submenu>-->
<!--        </div>-->
<!--      </el-menu>-->
      <sidebar-item
        v-for="route in permission_routers"
        :key="route.path" :item="route" :base-path="route.path"/>
    </el-menu>
  </el-scrollbar>
</template>

<script>
import { mapGetters } from 'vuex'
import SidebarItem from './SidebarItem'
import Logo from './Logo'
import sliderPath from '@/router/test/routers';
export default {
  //-- 临时的
  //   data(){
  //       return{
  //           Routers: sliderPath
  //       }
  //   },
    //--------------------
  components: { SidebarItem, Logo },
  computed: {
    //---临时的---
    //   activeMenu: function(){
    //       if(this.$route.name === 'home'){
    //           return '/dashboard';
    //       }else{
    //           return this.$route.name
    //       }
    //   },
    //-------------------
    ...mapGetters([
      'permission_routers',
      'sidebar'
    ]),
    isCollapse() {
      return !this.sidebar.opened
    }
  }
}
</script>

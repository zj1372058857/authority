<template>
  <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
    <div class="logo">
      <img src="@/assets/logo/logo.png" alt="">
    </div>
    <el-menu unique-opened router
             class="el-menu" :default-active="activeMenu">
      <div v-for="(router, index) in Routers">
        <el-submenu :key="index" :index="router.name">
          <template slot="title">
            <svg-icon :icon-class="router.meta.icon"/>
            {{router.meta.name}}
          </template>
          <el-menu-item v-for="(cRouter, cIndex) in router.children" :key="cIndex" :index="cRouter.name" :route="cRouter">
            <svg-icon :icon-class="cRouter.meta.icon"/>
            {{cRouter.meta.name}}</el-menu-item>
        </el-submenu>
      </div>
    </el-menu>
  </el-aside>
</template>

<script>
  import sliderPath from "../../router/test/routers";
  export default {
      data(){
          return{
              Routers: sliderPath
          }
      },
      computed: {
          activeMenu: function(){
              if(this.$route.name === 'home'){
                  return '/dashboard';
              }else{
                  return this.$route.name
              }
          }
      }
  }
</script>

<style scoped lang="scss">
  .el-aside {
    height: 100%;
    overflow-y: auto;
    color: #333;
    .logo {
      width: 200px;
      height: 60px;
      transition: width 0.5s linear;
      img {
        width: 100%;
        height: 100%;
      }
    };
    .el-menu:not(.el-menu--collapse){
      width: 200px;
      min-height: 400px;
    };
    .el-menu--collapse {
      .is-active {
        i.iconfont {
          font-size: 25px;
          color: red;
        }
      }
    }
  }
</style>

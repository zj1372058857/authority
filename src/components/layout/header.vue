<template>
  <el-header>
    <el-dropdown>
      <svg-icon icon-class="index" style="margin-right: 0px;"/>
      <el-dropdown-menu slot="dropdown">
        <el-dropdown-item style="color: cyan">个人中心</el-dropdown-item>
        <el-dropdown-item>新增</el-dropdown-item>
        <el-dropdown-item style="color: red">退出</el-dropdown-item>
      </el-dropdown-menu>
    </el-dropdown>
  </el-header>
</template>

<script>

</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
</style>

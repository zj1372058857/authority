<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.groupName" clearable placeholder="输入用户组名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px;">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <el-row :gutter="15">
      <!--用户组管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">用户组列表</span>
          </div>
          <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;">
            <el-table-column prop="index" label="编号" align="center"/>
            <el-table-column prop="groupName" label="名称" align="center"/>
            <el-table-column prop="cT" label="创建日期" align="center">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.cT) }}</span>
              </template>
            </el-table-column>
            <el-table-column label="查看权限" width="180px" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="success" icon="el-icon-search" @click="findMenu(scope.row.id)"></el-button>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="130px" align="center">
              <template slot-scope="scope">
                <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
                <el-popover
                  :ref="scope.row.id"
                  placement="top"
                  width="180">
                  <p>确定删除本条数据吗？</p>
                  <div style="text-align: right; margin: 0">
                    <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
                    <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
                  </div>
                  <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
                </el-popover>
              </template>
            </el-table-column>
          </el-table>
          <!--分页组件-->
          <el-pagination
            :total="total"
            :current-page="page + 1"
            style="margin-top: 8px;"
            layout="total, prev, pager, next, sizes"
            @size-change="sizeChange"
            @current-change="pageChange"/>
        </el-card>
      </el-col>
      <!-- 授权 -->
      <el-col :xs="24" :sm="24" :md="8" :lg="8" :xl="7">
        <el-card v-show="opt==='权限'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定用户组查看权限" placement="top">
              <span class="role-span">权限查看</span>
            </el-tooltip>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultProps"
            accordion
            node-key="id"/>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del, get, getMenus } from '@/api/group'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultProps: {
        children: 'children',
        label: 'label'
      },
      currentId: 0, resourceLoading: false, menuLoading: false, showButton: false, opt: '权限',
      delLoading: false, menus: [], menuIds: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.menus = [];
      this.showButton = false;
      this.url = '/group/queryGroupByCondition';
      const query = this.query;
      const value = query.groupName;
      this.params = { pageIndex: this.page, pageSize: this.size };
      if (value) { this.params['groupName'] = value };
      return true
    },
    findMenu(id){
        getMenus(id).then(res => {
            this.menus = res.body.roles;
        });
    },
    subDelete(id) {
      this.delLoading = true;
      del(id).then(res => {
        this.delLoading = false;
        this.$refs[id].doClose();
        if (res.success){
            this.dleChangePage();
            this.init();
            this.$notify({
                title: '删除成功',
                type: 'success',
                duration: 2500
            });
        }else{
            this.$notify({
                title: res.message,
                type: res.success,
                duration: 2500
            });
        }
      }).catch(err => {
        this.delLoading = false;
        this.$refs[id].doClose();
        console.log(err.response.data.message);
      })
    },
    update() {
      get(this.page, this.size).then(res => {
          this.data = res.body.content
      })
    },
    add() {
      this.isAdd = true;
      this.$refs.form.dialog = true;
      this.$refs.form.getRoles();
    },
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      _this.getRoles();
      _this.form = {
          id: data.id,
          groupName: data.groupName,
          roleIds: data.roleIds
      };
      _this.dialog = true;
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss">
  .role-span {
    font-weight: bold;color: #303133;
    font-size: 15px;
  }
</style>

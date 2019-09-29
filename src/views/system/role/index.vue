<template>
  <div class="app-container">
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.roleName" clearable placeholder="输入角色名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
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
      <!--角色管理-->
      <el-col :xs="24" :sm="24" :md="16" :lg="16" :xl="17">
        <el-card class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <span class="role-span">角色列表</span>
            <div id="opt" style="float: right">
              <el-radio-group v-model="opt" size="mini">
                <el-radio-button label="菜单分配"/>
                <el-radio-button label="资源分配"/>
              </el-radio-group>
            </div>
          </div>
          <el-table v-loading="loading" :data="data" highlight-current-row size="small" style="width: 100%;" @current-change="handleCurrentChange">
            <el-table-column prop="roleName" label="名称"/>
            <el-table-column prop="projectName" label="所属项目"/>
            <el-table-column :show-overflow-tooltip="true" prop="remark" label="描述"/>
            <el-table-column :show-overflow-tooltip="true" prop="cT" label="创建日期">
              <template slot-scope="scope">
                <span>{{ parseTime(scope.row.cT) }}</span>
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
        <el-card v-show="opt === '菜单分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="选择指定角色分配菜单" placement="top">
              <span class="role-span">菜单分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="menuLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveMenu">保存</el-button>
          </div>
          <el-tree
            ref="menu"
            :data="menus"
            :default-checked-keys="menuIds"
            :props="defaultPropsToMenu"
            accordion
            show-checkbox
            node-key="id"
          />
        </el-card>
        <el-card v-show="opt === '资源分配'" class="box-card" shadow="never">
          <div slot="header" class="clearfix">
            <el-tooltip class="item" effect="dark" content="若不可选，先选择对应菜单" placement="top">
              <span class="role-span">资源分配</span>
            </el-tooltip>
            <el-button
              :disabled="!showButton"
              :loading="resourceLoading"
              icon="el-icon-check"
              size="mini"
              style="float: right; padding: 6px 9px"
              type="primary"
              @click="saveResource">保存</el-button>
          </div>
          <div>
            <el-tree
              ref="resource"
              :data="resources"
              :default-checked-keys="resourceIds"
              :props="defaultProps"
              show-checkbox
              accordion
              node-key="label"/>
          </div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import { del } from '@/api/role'
import { getResourceTree } from '@/api/resource'
import { getMenuTrees } from '@/api/menuN'
import { parseTime } from '@/utils/index'
import eForm from './form'
import { editResource, editMenu, get } from '@/api/role'
export default {
  components: { eForm },
  mixins: [initData],
  data() {
    return {
      defaultPropsToMenu: {
          children: 'children',
          label: 'label',
          projectId: 'projectId'
      },
      defaultProps: {
        children: 'children',
        label: 'alias',
        projectId: 'projectId'
      },
      currentId: 0, resourceLoading: false, menuLoading: false, showButton: false, opt: '菜单分配',
      delLoading: false, menus: [], menuIds: [], resourceIds: [], resources: []
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
      this.$refs.resource.setCheckedKeys([]);
      this.$refs.menu.setCheckedKeys([]);
      this.showButton = false;
      this.url = '/role/queryRoleByCondition';
      const query = this.query;
      const value = query.roleName;
      this.params = { pageIndex: this.page+1, pageSize: this.size };
      if (value) { this.params['roleName'] = value };
      return true;
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
        console.log(err.message);
      })
    },
    handleCurrentChange(val) {
      if (val) {
        const _this = this
        // 清空权限与菜单的选中
          this.$refs.resource.setCheckedKeys([])
          this.$refs.menu.setCheckedKeys([])
        // 保存当前的角色id
        this.currentId = val.id
        // 储存projectId
        this.currentProjectId = val.projectId;
        // 点击后显示按钮
        this.showButton = true
        // 初始化
        this.menuIds = []
        this.resourceIds = []
        //this.permissionIds = []
        // 菜单数据需要特殊处理
        if(!val.menus){return;}
        val.menus.forEach(function(data, index) {
          let add = true
          for (let i = 0; i < val.menus.length; i++) {
            if (data.id === val.menus[i].pid) {
              add = false
              break
            }
          }
          if (add) {
            _this.menuIds.push(data.id)
          }
        })
        if(!val.resources){return;}
        val.resources.forEach(function(data, index){
            let obj = {resourceId: data.id, alias: data.alias};
            _this.resourceIds.push(JSON.stringify(obj));
        })
        // 选择过滤
          // 过滤前先赋予菜单
          getMenuTrees().then(res => {
              // 根据projectId过滤菜单
              this.menus = this.handleMenus(res.body, val.projectId);
          })
          // 过滤前先赋予资源
          getResourceTree(val.projectId).then(res => {
              this.resources = this.changeResource(res.body.children, val.menus);
          })
      }
    },
    changeResource(array, menus){
        for (let i in menus){
            for (let j in array){
                array[j].alias = array[j].menuName;
                if (menus[i].id == array[j].id){
                    array[j].disabled = false;
                    for (let k in array[j].children){
                        array[j].children[k].disabled = false;
                    }
                }
            }
        }
        return array;
    },
    handleMenus(data, projectId){
        for (let i=0; i<data.length; i++){
            if (data[i].projectId !== projectId){
                data.splice(i, 1);
                i--;
            }else if (data[i].children !== null && data[i].children !== undefined && data[i].children.length>0){
                this.handleMenus(data[i].children, projectId)
            }
        }
        return data;
    },
    saveResource() {
      this.resourceLoading = true
      const role = { id: this.currentId, resources: [] }
      this.$refs.resource.getCheckedKeys().forEach(function(data, index) {
          let obj = JSON.parse(data);
          if (obj.resourceId !== undefined){
              const resource = { id: obj.resourceId};
              role.resources.push(resource);
          };
      })
      editResource(role).then(res => {
          if (res.success){
              this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 2500
              });
              this.update();
          }else{
              this.$notify({
                  title: res.message,
                  type: res.success,
                  duration: 2500
              });
          };
          this.resourceLoading = false;
      }).catch(err => {
        this.resourceLoading = false
        console.log(err.message)
      })
    },
    saveMenu() {
      this.menuLoading = true
      const role = { id: this.currentId, menus: [] }
      this.$refs.menu.getHalfCheckedKeys().forEach(function (data, index) {
          const menu = { id: data };
          role.menus.push(menu);
      })
      this.$refs.menu.getCheckedKeys().forEach(function(data, index) {
        const menu = { id: data }
        role.menus.push(menu)
      })
      editMenu(role).then(res => {
          if (res.success){
              this.$notify({
                  title: '保存成功',
                  type: 'success',
                  duration: 2500
              });
              this.update()
              this.beforeInit();
          }else{
              this.$notify({
                  title: res.message,
                  type: res.success,
                  duration: 2500
              });
          }
          this.menuLoading = false;
      }).catch(err => {
        this.menuLoading = false
        console.log(err.message)
      })
    },
    update() {
      // 无刷新更新 表格数据
      get(this.page, this.size).then(res => {
          this.data = res.body.content
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.getProjects()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getProjects()
      _this.form = {
          id: data.id,
          roleName: data.roleName,
          remark: data.remark,
          projectId: data.projectId,
          status: data.status.toString()
      }
      _this.dialog = true
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

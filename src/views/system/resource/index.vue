<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.alias" clearable placeholder="输入资源名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
      <el-input v-model="query.menuName" clearable placeholder="输入菜单名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
        <el-select v-model="query.projectId" clearable placeholder="选择项目搜索" class="filter-item" style="width: 200px" @change="toQuery">
          <el-option v-for="item in projects" :key="item.id" :label="item.label" :value="item.id">{{item.label}}</el-option>
        </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div style="display: inline-block;margin: 0px 2px 0px">
        <el-button
          class="filter-item"
          size="mini"
          type="primary"
          icon="el-icon-plus"
          @click="add">新增</el-button>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small">
      <el-table-column prop="projectName" label="所属项目">
        <template slot-scope="scope">
          <span>{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="menuName" label="所属菜单">
        <template slot-scope="scope">
          <span>{{scope.row.menuName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="访问地址">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ct" label="创建日期">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ct) }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="130px" align="center" prop="isDeleted">
        <template slot-scope="scope">
          <el-button  size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200">
            <p >确定要删除吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete([scope.row.id,scope.row.isDeleted])">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
    <el-pagination
      :total="total"
      :current-page="page + 1"
      style="margin-top: 8px;"
      layout="total, prev, pager, next, sizes"
      @size-change="sizeChange"
      @current-change="pageChange"/>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import { del } from '@/api/resource'
import { parseTime } from '@/utils/index'
import eForm from './form'
import {getProjectList, getProjects} from "../../../api/project";
export default {
  components: { treeTable, eForm },
  mixins: [initData],
  data() {
      return {
      columns: [
        {
          text: '名称',
          value: 'alias'
        }
      ],
      projects: [],
      delLoading: false, expand: true
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
    mounted(){
        getProjects().then(res =>{
            this.projects = res.body.content;
         })
    },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = 'resource/queryResourceByCondition'
      const query = this.query
      const value = query.alias
      const value2 = query.menuName
      const value3 = query.projectId
      this.params = { pageIndex: this.page+1, pageSize: this.size }
      if (value) { this.params['alias'] = value }
      if (value2){ this.params['menuName'] = value2 }
      if (value3){ this.params['projectId'] = value3 }
      return true
    },
    subDelete(data) {
      this.delLoading = true
      del(data).then(res => {
        this.delLoading = false
        this.$refs[data[0]].doClose()
          if(res.success){
              this.page = 0;
              this.init()
              this.$notify({
                  title: '操作成功',
                  type: res.success,
                  duration: 2500
              })
          }else{
              this.$notify({
                  title: res.message,
                  type: res.success,
                  duration: 2500
              })
          }
      }).catch(err => {
        this.delLoading = false
        this.$refs[id].doClose()
        console.log(err.message)
      })
    },
    add() {
      this.isAdd = true
      this.$refs.form.dialog = true
      this.$refs.form.getProjects()
      this.$refs.form.getMenuNs()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenuNs()
      _this.getProjects()
      _this.form = {
          id: data.id,
          alias: data.alias,
          url: data.url,
          projectId: data.projectId,
          sort: data.sort,
          isDeleted: data.isDeleted.toString(),
          menuId: data.menuId
      }
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
      this.init()
    }
  }
}
</script>

<style scoped>

</style>

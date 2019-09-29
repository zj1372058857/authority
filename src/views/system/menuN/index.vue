<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.menuName" clearable placeholder="输入菜单名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
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
      <div style="display: inline-block;">
        <el-button
          class="filter-item"
          size="mini"
          type="warning"
          icon="el-icon-more"
          @click="changExpand">{{ $parent.expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true"/>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :data="data" :expand-all="expand" :columns="columns" size="small">
      <el-table-column prop="projectName" label="所属项目" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.projectName}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="icons" label="图标" align="center" width="80px">
        <template slot-scope="scope">
          <svg-icon :icon-class="scope.row.icons" />
        </template>
      </el-table-column>
      <el-table-column prop="type" label="类型" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.type===0">正常菜单</span>
          <span v-else-if="scope.row.type===1">虚拟菜单</span>
        </template>
      </el-table-column>
      <el-table-column prop="url" label="访问地址" align="center">
        <template slot-scope="scope">
          <span>{{scope.row.url}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="sort" align="center" width="100px" label="排序">
        <template slot-scope="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="ct" label="创建日期" align="center">
        <template slot-scope="scope">
          <span>{{ parseTime(scope.row.ct) }}</span>
        </template>
      </el-table-column>
      <el-table-column  label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button  size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
          <el-popover
            :ref="scope.row.id"
            placement="top"
            width="200">
            <p>确定删除吗,如果存在下级节点则一并删除，此操作不能撤销！</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import checkPermission from '@/utils/permission' // 权限判断函数
import treeTable from '@/components/TreeTable'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/menuN'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { treeTable, eForm },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'menuName'
        }
      ],
      delLoading: false, expand: true
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
      this.url = '/menu/queryMenuByCondition'
      const query = this.query
      const value = query.menuName
      this.params = { pageIndex: this.page+1, pageSize: this.size }
      if (value) { this.params['menuName'] = value }
      return true
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        if (res.success){
            this.init()
            this.$notify({
                title: '删除成功',
                type: 'success',
                duration: 2500
            })
        }else{
            this.$notify({
                title: this.message,
                type: this.success,
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
      this.$refs.form.getMenuNs()
      this.$refs.form.getProjects()
      this.$refs.form.dialog = true
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getMenuNs()
      _this.getProjects()
      _this.form = {
          id: data.id,
          menuName: data.menuName,
          projectId: data.projectId,
          sort: data.sort,
          pid: data.pid,
          url: data.url,
          icons: data.icons,
          type: data.type
      }
      _this.dialog = true
    },
    changExpand() {
      this.expand = !this.expand
      this.init()
    }
  }
}
</script>

<style scoped>

</style>

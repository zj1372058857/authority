<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.areaName" clearable placeholder="输入业务区域名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
      <el-select v-model="query.isDeleted" clearable placeholder="状态" class="filter-item" style="width: 90px" @change="toQuery">
        <el-option v-for="item in isDeletedTypeOptions" :key="item.key" :label="item.display_name" :value="item.key"/>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
      <!-- 新增 -->
      <div  style="display: inline-block;margin: 0px 2px;">
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
          @click="changeExpand">{{ $parent.expand ? '折叠' : '展开' }}</el-button>
        <eForm ref="form" :is-add="true" :dicts="dicts"/>
      </div>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :expand-all="expand" :data="data" :columns="columns" size="small">
      <el-table-column label="区域编号" prop="areaCode" align="left">
        <template slot-scope="scope">
          <span>{{scope.row.areaCode}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="isDeleted" label="状态">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===0">正常</span>
          <span v-else-if="scope.row.isDeleted===1">禁用</span>
        </template>
      </el-table-column>
      <el-table-column prop="ct" label="创建日期">
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
            width="180">
            <p>确定删除本条数据吗？</p>
            <div style="text-align: right; margin: 0">
              <el-button size="mini" type="text" @click="$refs[scope.row.id].doClose()">取消</el-button>
              <el-button :loading="delLoading" type="primary" size="mini" @click="subDelete(scope.row.id)">确定</el-button>
            </div>
            <el-button slot="reference" :disabled="scope.row.id === 0" type="danger" icon="el-icon-delete" size="mini"/>
          </el-popover>
        </template>
      </el-table-column>
    </tree-table>
  </div>
</template>

<script>
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { del } from '@/api/area'
import { parseTime } from '@/utils/index'
import eForm from './form'
export default {
  components: { eForm, treeTable },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        {
          text: '名称',
          value: 'areaName'
        }
      ],
      isDeletedTypeOptions: [
        { key: '0', display_name: '正常' },
        { key: '1', display_name: '禁用' }
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
      this.url = 'area/queryAreaByCondition';
      this.params = { page: this.page+1, size: this.size};
      const query = this.query;
      const value = query.areaName;
      const isDeleted = query.isDeleted;
      if (value) { this.params['areaName'] = value };
      if (isDeleted !== '' && isDeleted !== null) { this.params['isDeleted'] = isDeleted };
      return true;
    },
    subDelete(id) {
      this.delLoading = true
      del(id).then(res => {
        this.delLoading = false
        this.$refs[id].doClose()
        this.init()
        if (res.success){
            this.$notify({
                title: '删除成功',
                type: 'success',
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
      const _this = this.$refs.form
      _this.getAreas()
      _this.dialog = true
    },
    changeExpand() {
      this.expand = !this.expand
      this.init()
    },
    edit(data) {
      this.isAdd = false
      const _this = this.$refs.form
      _this.getAreas()
      _this.form = {
        id: data.id,
        areaName: data.areaName,
        pid: data.pid,
        isDeleted: data.isDeleted.toString()
      }
      _this.dialog = true
    }
  }
}
</script>

<style scoped>

</style>

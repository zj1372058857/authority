<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-input v-model="query.userName" clearable placeholder="输入账号搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
      <el-select v-model="query.groupId" clearable placeholder="选择用户组搜索" class="filter-item" style="width: 200px" @change="toQuery">
        <el-option v-for="item in groups" :key="item.id" :label="item.groupName" :value="item.id">{{item.groupName}}</el-option>
      </el-select>
      <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
    </div>
    <!--表单组件-->
    <eForm ref="eForm" :is-add="isAdd" :dicts="dicts"/>
    <pForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :expand-all="expand" :data="data" size="auto" :columns="columns">
      <el-table-column label="用户组" align="center">
        <template slot-scope="scope">
          <span v-for="group in scope.row.groups">{{group.groupName}}&emsp;</span>
        </template>
      </el-table-column>
      <el-table-column label="赋予用户组" width="130px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
        </template>
      </el-table-column>
      <el-table-column label="店仓权限赋予" width="180px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="success" icon="el-icon-edit" @click="editShop(scope.row)">门店</el-button>
          <el-button size="mini" type="success" icon="el-icon-edit" @click="editWareHouse(scope.row)">仓库</el-button>
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
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import eForm from './form'
import pForm from './form-per'
import {getGroups} from '@/api/group'
export default {
  components: { eForm, treeTable, pForm },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        { text: '编号', value: 'index' },
        { text: '账号', value: 'userName' },
        { text: '姓名', value: 'realName' }
      ],
      delLoading: false, expand: true, groups: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init();
    })
  },
  mounted(){
      getGroups().then(res =>{
          this.groups = res.body.content;
      });
  },
  methods: {
    parseTime,
    checkPermission,
    beforeInit() {
      this.url = '/user/queryUserByCondition';
      this.params = { pageIndex: this.page+1, pageSize: this.size };
      const query = this.query;
      const value = query.userName;
      const groupId = query.groupId;
      if (value) { this.params['userName'] = value };
      if (groupId) { this.params['groupId'] = groupId };
      return true
    },
    changeExpand() {
      this.expand = !this.expand;
      this.init();
    },
    editShop(data){
        this.isAdd = true;
        const _this = this.$refs.form;
        _this.getAreaShops();
        _this.getHadShops(data.id);
        _this.form = {};
        _this.dialog = true;
    },
    editWareHouse(data){
        this.isAdd = false;
        const _this = this.$refs.form;
        _this.getCityHouses();
        _this.getHadHouses(data.id);
        _this.form = {};
        _this.dialog = true;
    },
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.eForm;
      _this.getGroups(data.id);
      let array = [];
      if (data.groups!==null){
          for (let i=0; i<data.groups.length; i++){
              array.push(data.groups[i].id)
          };
      };
      _this.eForm = {
        groupIds: array,
        userId: data.id
      };
      _this.dialog = true;
    }
  }
}
</script>

<style scoped>

</style>

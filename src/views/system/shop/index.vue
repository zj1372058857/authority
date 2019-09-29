<template>
  <div class="app-container">
    <!--工具栏-->
    <div class="head-container">
      <!-- 搜索 -->
      <el-row>
        <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="7">
          <el-input v-model="query.shopName" clearable placeholder="输入门店名称搜索" style="width: 200px;" class="filter-item" @keyup.enter.native="toQuery" @change="toQuery"/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="7">
          <treeselect v-model="query.areaId" :options="areas" :load-options="loadOptions" style="width: 200px; font-size: 13px;" placeholder="选择区域搜索"  @input="toQuery"/>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="7">
          <el-select v-model="query.cityId" clearable placeholder="选择城市搜索" class="filter-item" style="width: 200px" @change="toQuery">
            <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
          </el-select>
        </el-col>
        <el-col :xs="24" :sm="24" :md="8" :lg="4" :xl="7">
          <el-button class="filter-item" size="mini" type="success" icon="el-icon-search" @click="toQuery">搜索</el-button>
        </el-col>
      </el-row>
    </div>
    <!--表单组件-->
    <eForm ref="form" :is-add="isAdd" :dicts="dicts"/>
    <!--表格渲染-->
    <tree-table v-loading="loading" :expand-all="expand" :data="data" size="small" :columns="columns">
      <el-table-column prop="shopName" label="门店名称" align="center"/>
      <el-table-column prop="cityName" label="城市" align="center"/>
      <el-table-column label="业务区域" align="center">
        <template slot-scope="scope">
          <span v-for="area in scope.row.areas">{{area.areaName}}<br></span>
        </template>
      </el-table-column>
      <el-table-column prop="isDeleted" label="状态" align="center">
        <template slot-scope="scope">
          <span v-if="scope.row.isDeleted===0">可用</span>
          <span v-else-if="scope.row.isDeleted===1">失效</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="130px" align="center">
        <template slot-scope="scope">
          <el-button size="mini" type="primary" icon="el-icon-edit" @click="edit(scope.row)"/>
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
import Treeselect from '@riophae/vue-treeselect';
import treeTable from '@/components/TreeTable'
import checkPermission from '@/utils/permission'
import initData from '@/mixins/initData'
import initDict from '@/mixins/initDict'
import { parseTime } from '@/utils/index'
import eForm from './form'
import {getCities} from '@/api/shop';
import {getAreas} from "../../../api/area";
export default {
  components: { eForm, treeTable, Treeselect },
  mixins: [initData, initDict],
  data() {
    return {
      columns: [
        {
          text: '编号',
          value: 'index'
        }
      ],
      delLoading: false, expand: true, cities: [], areas: []
    }
  },
  created() {
    this.$nextTick(() => {
      this.init()
    })
  },
    mounted(){
        getCities().then(res =>{
            this.cities = res.body;
        });
        getAreas().then(res => {
            let item = res.body.content;
            item = this.deleteChildren(item);
            this.areas = item;
        });
    },
  methods: {
    parseTime,
    checkPermission,
    loadOptions() {},
    beforeInit() {
      this.url = '/shop/queryShopByCondition';
      this.params = { pageIndex: this.page+1, pageSize: this.size };
      const query = this.query;
      const value = query.shopName;
      const cityId = query.cityId;
      const areaId = query.areaId;
      if (value) { this.params['shopName'] = value };
      if (cityId) { this.params['cityId'] = cityId };
      if (areaId) { this.params['areaId'] = areaId };
      return true;
    },
    changeExpand() {
      this.expand = !this.expand;
      this.init();
    },
    edit(data) {
      this.isAdd = false;
      const _this = this.$refs.form;
      _this.getCities();
      _this.getAreas();
      let aId = 0;
      if (data.areas.length!==0){
          aId = data.areas[0].id;
      };
      _this.form = {
        id: data.id,
        shopName: data.shopName,
        cityId: data.cityId,
        areaId: aId,
        areaName: data.areaName
      };
      _this.dialog = true;
    },
      deleteChildren(objects){
           let objItem = objects;
          for(let x in objItem){
              if(objItem[x].children.length==0 ){
                  delete objItem[x].children;
              }else {
                  this.deleteChildren(objItem[x].children)
              };
          }
          return objItem;
       }
  }
}
</script>

<style scoped>

</style>

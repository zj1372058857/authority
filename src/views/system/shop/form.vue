<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增门店' : '编辑门店'" width="500px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="shopName">
        <el-input v-model="form.shopName" style="width: 370px;" clearable/>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="城市">
        <el-select v-model="form.cityId" clearable placeholder="选择城市" style="width: 370px;">
          <el-option v-for="item in cities" :key="item.id" :label="item.name" :value="item.id">{{item.name}}</el-option>
        </el-select>
      </el-form-item><br>
      <el-form-item style="margin-bottom: 0px;" label="区域">
        <treeselect v-model="form.areaId" :options="areas" :load-options="loadOptions" style="width: 370px;" placeholder="选择区域"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import treeTable from '@/components/TreeTable'
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getAreas} from '@/api/area';
import {getCities, edit} from '@/api/shop'
export default {
  components: { Treeselect, treeTable },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      defaultProps: {
          children: 'children',
          label: 'label'
      },
      loading: false, dialog: false, cities: [], areas: [],
      form: {
        id: '',
        shopName: '',
        cityId: 0,
        areaId: 0,
        areaName: ''
      },
      rules: {
        shopName: [
            { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    loadOptions() {},
    cancel() {
      this.resetForm();
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          if (this.form.cityId !== 0 && this.form.cityId !== '') {
            this.loading = true
            this.doEdit()
          } else {
            this.$message({
              message: '城市不能为空',
              type: 'warning'
            })
          }
        }
      })
    },
    doEdit() {
      edit(this.form).then(res => {
          if (res.success){
              this.resetForm();
              this.$notify({
                  title: '修改成功',
                  type: 'success',
                  duration: 2500
              });
              this.$parent.init();
          }else{
              this.$notify({
                  title: res.message,
                  type: res.success,
                  duration: 2500
              });
          }
          this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err.message);
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs['form'].resetFields();
      this.form = {
          id: '',
          shopName: '',
          cityId: 0,
          areaId: 0,
          areaName: ''
      };
    },
    getAreas(){
        getAreas().then(res => {
            this.areas = [];
            const area = {id: 0, label: '选择区域', children: []};
            area.children = res.body.content;
            this.areas.push(area);
            this.areas = this.deleteChildren(this.areas);
        });
    },
      deleteChildren(objects){
          let objItem = objects;
          for(let x in objItem){
              if(objItem[x].children == null || objItem[x].children.length==0 ){
                  delete objItem[x].children;
              }else {
                  this.deleteChildren(objItem[x].children)
              };
          }
          return objItem;
      },
    getCities(){
        getCities().then(res => {
            this.cities = res.body;
        })
    }
  }
}
</script>

<style scoped>

</style>

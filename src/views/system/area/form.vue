<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增业务区域' : '编辑业务区域'" width="600px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="areaName">
        <el-input v-model="form.areaName" style="width: 370px;" clearable/>
      </el-form-item>
      <el-form-item label="状态" prop="isDeleted">
        <el-radio v-model="form.isDeleted" label="1">禁用</el-radio>
        <el-radio v-model="form.isDeleted" label="0">正常</el-radio>
      </el-form-item>
      <el-form-item  style="margin-bottom: 0px;" label="上级区域">
        <treeselect v-model="form.pid" :options="areas" style="width: 370px;" placeholder="选择上级业务区域" :load-options="loadOptions"/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getAreas } from '@/api/area'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, areas: [],
      form: {
        id: '',
        areaName: '',
        pid: 0,
        isDeleted: '0',
      },
      rules: {
        areaName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
            this.loading = true
            if (this.isAdd) {
              this.doAdd()
            } else this.doEdit()
        }
      })
    },
    doAdd() {
      add(this.form).then(res => {
        if (res.success){
            this.resetForm()
            this.$notify({
                title: '添加成功',
                type: 'success',
                duration: 2500
            })
            this.$parent.init()
        }else{
            this.$notify({
                title: '区域新增失败，可能是重名、网络波动等原因',
                type: res.success,
                duration: 2500
            })
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err.message)
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
                title: res.message + '，可能是重名、网络波动等原因',
                type: res.success,
                duration: 2500
            })
        }
        this.loading = false
      }).catch(err => {
        this.loading = false
        console.log(err.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
        id: '',
        areaName: '',
        pid: 0,
        isDeleted: '0'
      }
    },
    getAreas() {
      getAreas().then(res => {
        this.areas = []
        const area = {id: 0, label: '选择上级区域', children: []}
        area.children = res.body.content
        this.areas.push(area);
        this.areas = this.deleteChildren(this.areas);
        this.areas = this.deleteMenuSelf(this.areas);
      })
    },
      deleteMenuSelf(menus){
          for (let i in menus){
              if (menus[i].id === this.form.id){
                  menus.splice(i, 1);
              }else if (menus[i].children !== undefined && menus[i].children !== null && menus[i].children.length>0){
                  this.deleteMenuSelf(menus[i].children);
              };
          };
          return menus;
      },
      deleteChildren(objects){
          let objItem = objects
          for(let x in objItem){
              if(objItem[x].children == null || objItem[x].children.length==0 ){
                  delete objItem[x].children;
              }else {
                  this.deleteChildren(objItem[x].children)
              }
          }
          return objItem
      },
      loadOptions(){}
  }
}
</script>

<style scoped>

</style>

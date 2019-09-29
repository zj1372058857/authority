<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增用户组' : '编辑用户组'" append-to-body width="500px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="用户组名称" prop="name">
        <el-input v-model="form.groupName" style="width: 370px;" clearable/>
      </el-form-item>
      <el-form-item label="拥有角色" prop="roleName">
        <el-select v-model="form.roleIds" multiple placeholder="请选择" style="width: 370px;">
          <el-option
            v-for="item in olRoles"
            :key="item.id"
            :label="item.roleName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { getAll } from '@/api/role'
import { add, edit } from '@/api/group'
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
      loading: false, dialog: false, olRoles: [],
      form: { groupName: '', roleIds: []},
      rules: {
        groupName: [
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
          } else {
            return false
          }
        })
    },
    doAdd() {
      add(this.form).then(res => {
          if (res.success){
              this.resetForm();
              this.$notify({
                  title: '添加成功',
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
                  title: res.message,
                  type: res.success,
                  duration: 2500
              });
          }
          this.loading = false;
      }).catch(err => {
        this.loading = false;
        console.log(err.response.data.message);
      })
    },
    resetForm() {
      this.dialog = false;
      this.$refs['form'].resetFields();
      this.form = { groupName: '', roleIds: [] };
    },
    getRoles(){
        getAll().then(res => {
            this.olRoles = res.body.content;
        })
    }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>

<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增角色' : '编辑角色'" append-to-body width="500px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="角色名称" prop="name">
        <el-input v-model="form.roleName" style="width: 370px;" clearable/>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectName">
        <Treeselect placeholder="选择项目" v-model="form.projectId" :options="projects" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="描述信息">
        <el-input v-model="form.remark" style="width: 370px;" rows="5" type="textarea" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/role'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getProjects} from "../../../api/project";
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
      //dateScopes: ['全部', '本级', '自定义'],
      loading: false, dialog: false, projects: [],    //depts: [], deptIds: [],
      form: { roleName: '', remark: '', projectName: '', status: '0'},
      rules: {
        roleName: [
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
      // if (this.form.dataScope === '自定义' && this.deptIds.length === 0) {
      //   this.$message({
      //     message: '自定义数据权限不能为空',
      //     type: 'warning'
      //   })
      // } else {
      //   this.form.depts = []
      //   if (this.form.dataScope === '自定义') {
      //     for (let i = 0; i < this.deptIds.length; i++) {
      //       this.form.depts.push({
      //         id: this.deptIds[i]
      //       })
      //     }
      //   }
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
      //}
    },
    doAdd() {
      add(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '添加成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    doEdit() {
      edit(this.form).then(res => {
        this.resetForm()
        this.$notify({
          title: '修改成功',
          type: 'success',
          duration: 2500
        })
        this.loading = false
        this.$parent.init()
      }).catch(err => {
        this.loading = false
        console.log(err.response.data.message)
      })
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = { roleName: '', remark: '', projectName: '', status: '0'}
    },
    getProjects(){
        getProjects().then(res => {
            this.projects = res.body.content
        })
    }
    // getDepts() {
    //   getDepts({ enabled: true }).then(res => {
    //     this.depts = res.content
    //   })
    // },
    // changeScope() {
    //   if (this.form.dataScope === '自定义') {
    //     this.getDepts()
    //   }
    // }

  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>

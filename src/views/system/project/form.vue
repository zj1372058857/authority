<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '新增部门' : '编辑部门'" width="500px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="项目名称" prop="projectName">
        <el-input v-model="form.projectName" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="项目别称" prop="projectSign">
        <el-input v-model="form.projectSign" style="width: 370px;"/>
      </el-form-item>
      <el-form-item label="项目描述" prop="projectDescrip">
        <el-input v-model="form.projectDescrip" style="width: 370px"/>
      </el-form-item>
      <el-form-item label="状态" prop="isDeleted">
        <el-radio v-model="form.isDeleted" label="1">禁用</el-radio>
        <el-radio v-model="form.isDeleted" label="0" >正常</el-radio>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
    import { add, edit } from '@/api/project'
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
                loading: false, dialog: false, projects: [],
                form: {
                    id: '',
                    projectName: '',
                    isDeleted: '0',
                    projectDescrip: '',
                    projectSign: ''
                },
                rules: {
                    projectName: [
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
                        } else {
                            this.doEdit()
                        }
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
                            title: res.message,
                            type: res.success,
                            duration: 2500
                        });
                    }
                    this.loading = false;
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
                    projectName: '',
                    isDeleted: '0',
                    projectDescrip: '',
                    projectSign: ''
                }
            }
        }
    }
</script>

<style scoped>

</style>

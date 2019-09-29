<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增资源' : '编辑资源'" append-to-body width="600px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="名称" prop="resourceName" v-if="this.isAdd">
        <el-input v-model="form.resourceName" style="width: 360px;" clearable/>
      </el-form-item>
      <el-form-item label="别名" prop="alias">
        <el-input v-model="form.alias" style="width: 360px;" clearable/>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="所属项目"  v-if="this.isAdd">
        <treeselect v-model="form.projectId" :options="projects" style="width: 360px;" placeholder="选择项目" :load-options="loadOptions" @select="menusFilter"/>
      </el-form-item>
      <el-form-item style="margin-bottom: 0px;" label="所属菜单">
        <treeselect v-model="form.menuId" :options="menuNs" style="width: 360px;" placeholder="选择菜单" :load-options="loadOptions" @select="confirmedProject"/>
      </el-form-item><br>
      <el-form-item label="访问地址" prop="url">
        <el-input v-model="form.url" style="width: 360px;" clearable/>
      </el-form-item>
      <el-form-item label="排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 360px;" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit } from '@/api/resource'
import {getProjects} from '@/api/project'
import { getMenuNsTree } from '@/api/menuN'
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
      loading: false, dialog: false, projects: [], menuNs: [],
      form: {
          alias: '',
          url: '',
          projectId: 0,
          projectName: '',
          sort: 999,
          menuId: 0,
          menuName: '',
          resourceName: ''
      },
      rules: {
        resourceName: [
            { required: true, message: '请输入资源名', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入别名', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入访问地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
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
    // 选择项目后，过滤菜单
    menusFilter(item){
        if (item.id == 0){
            this.form.menuId = 0;
            this.getMenuNs();
            return;
        }
        this.form.menuId = 0;
        this.menuNs = [];
        let projectId = item.id;
        getMenuNsTree().then(res => {
            const menu = { id: 0, label: '选择菜单', children: []};
            for (let i in res.body.content){
                if (res.body.content[i].projectId === projectId){
                    menu.children.push(res.body.content[i]);
                }
            }
            if (menu.children.length == 0){
                menu.label = '该项目下暂无菜单';
            }
            this.menuNs.push(menu);
            this.menuNs = this.deleteChildren(this.menuNs);
        })
      },
    // 选择菜单后，项目确定
    confirmedProject(item){
          if (item.id !== 0){
              let projectId = item.projectId;
              this.form.projectId = projectId;
          };
      },
    cancel() {
      this.resetForm()
    },
    doSubmit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.loading = true
          if (this.isAdd) {
            this.doAdd()
          } else {this.doEdit()}
        } else {
          return false
        }
      })
    },
    doAdd() {
      if (this.form.projectId !== 0 && this.form.menuId !== 0){
          add(this.form).then(res => {
              if(res.success){
                  this.resetForm();
                  this.$notify({
                      title: '操作成功',
                      type: res.success,
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
      }else{
          this.$notify({
              title: '项目和菜单均为必选项',
              type: false,
              duration: 2500
          });
      }
    },
    doEdit() {
      if (this.form.menuId !== 0){
          edit(this.form).then(res => {
              if(res.success){
                  this.resetForm();
                  this.$notify({
                      title: '操作成功',
                      type: res.success,
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
      }else{
          this.$notify({
              title: '菜单为必选项',
              type: false,
              duration: 2500
          });
      }
    },
    resetForm() {
      this.dialog = false
      this.$refs['form'].resetFields()
      this.form = {
          id: '',
          alias: '',
          url: '',
          projectId: 0,
          projectName: '',
          sort: 999,
          menuId: 0,
          menuName: ''
      }
    },
    getMenuNs() {
        getMenuNsTree().then(res => {
            this.menuNs = [];
            const menu = {id: 0, label: '选择所属菜单', children: []};
            if (!this.isAdd){
                for (let i in res.body.content){
                    if (res.body.content[i].projectId === this.form.projectId){
                        menu.children.push(res.body.content[i]);
                    }
                }
                if (menu.children.length == 0){
                    menu.label = '该项目下暂无菜单';
                }
            }else{
                menu.children = res.body.content;
            }
            this.menuNs.push(menu);
            this.menuNs = this.deleteChildren(this.menuNs);
          })
     },
      deleteChildren(objects){
          let objItem = objects;
          for(let x in objItem){
              if(objItem[x].children == null || objItem[x].children.length==0 ){
                  delete objItem[x].children;
              }else {
                  this.deleteChildren(objItem[x].children);
              };
          }
          return objItem;
      },
    getProjects(){
        getProjects().then(res => {
            this.projects = [];
            const project = {id: 0, label: '选择所属项目', children: []};
            project.children = res.body.content;
            this.projects.push(project);
      })
    },
    loadOptions(){}
  }
}
</script>

<style scoped>

</style>

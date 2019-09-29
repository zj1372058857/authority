<template>
  <el-dialog :visible.sync="dialog" :title="isAdd ? '新增菜单' : '编辑菜单'" append-to-body width="600px" :before-close="resetForm">
    <el-form ref="form" :model="form" :rules="rules" size="small" label-width="80px">
      <el-form-item label="菜单图标">
        <el-popover
          placement="bottom-start"
          width="460"
          trigger="click"
          @show="$refs['iconSelect'].reset()">
          <IconSelect ref="iconSelect" @selected="selected" />
          <el-input slot="reference" v-model="form.icons" style="width: 460px;" placeholder="点击选择图标" readonly>
            <svg-icon v-if="form.icons" slot="prefix" :icon-class="form.icons" class="el-input__icon" style="height: 32px;width: 16px;" />
            <i v-else slot="prefix" class="el-icon-search el-input__icon"/>
          </el-input>
        </el-popover>
      </el-form-item>
      <el-form-item label="菜单名称" prop="menuName">
        <el-input v-model="form.menuName" placeholder="名称" style="width: 460px;" clearable/>
      </el-form-item>
      <el-form-item label="菜单排序" prop="sort">
        <el-input-number v-model.number="form.sort" :min="0" :max="999" controls-position="right" style="width: 460px;"/>
      </el-form-item>
      <el-form-item label="所属项目" prop="projectId" v-if="this.isAdd">
        <treeselect v-model="form.projectId" :options="projects" :load-options="loadOptions" style="width: 460px;" placeholder="所属项目" @select="menusFilter"/>
      </el-form-item>
      <el-form-item label="上级菜单" prop="pid">
        <treeselect v-model="form.pid" :options="menuNs" :load-options="loadOptions" style="width: 460px;" placeholder="选择上级菜单" @select="confirmedProject"/>
      </el-form-item>
      <el-form-item label="类型" prop="type" v-if="this.isAdd">
        <el-radio v-model="form.type" :label="1">虚拟菜单</el-radio>
        <el-radio v-model="form.type" :label="0">正常菜单</el-radio>
      </el-form-item>
      <el-form-item label="访问地址" prop="url" v-if="this.form.type === 0">
        <el-input v-model="form.url" placeholder="访问地址" style="width: 460px;" clearable/>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { add, edit, getMenuNsTree } from '@/api/menuN'
import Treeselect from '@riophae/vue-treeselect'
import IconSelect from '@/components/IconSelect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'
import {getProjects} from "@/api/project";
export default {
  components: { Treeselect, IconSelect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      loading: false, dialog: false, menuNs: [], projects: [],
      form: {
          id: '',
          menuName: '',
          sort: 999,
          url: '',
          projectName: '',
          icons: '',
          projectId: 0,
          ct:'',
          pid:0,
          type: 0
      },
      rules: {
        menuName: [
          { required: true, message: '请输入名称', trigger: 'blur' }
        ],
        url: [
            { required: true, message: '请输入访问地址', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    // 选择项目后，过滤菜单
    menusFilter(item){
        if (item.id == 0){
            this.form.pid = 0;
            this.getMenuNs();
            return;
        }
        this.form.pid = 0;
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
            if (item.id !== 0){
                let projectId = item.projectId;
                this.form.projectId = projectId;
            };
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
          } else this.doEdit()
        } else {
          return false
        }
      })
    },
    doAdd() {
      if (this.form.projectId !== 0){
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
      } else{
          this.$notify({
              title: '必须选择项目',
              type: false,
              duration: 2500
          });
          this.loading = false;
      }
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
                      title: res.message + ',可能是重名、网络波动等原因',
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
          menuName: '',
          sort: 999,
          url: '',
          projectName: '',
          icons: '',
          pid:0,
          projectId: 0,
          type: 0
      }
    },
    selected(name) {
      this.form.icons = name
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
    getMenuNs() {
      getMenuNsTree().then(res => {
        this.menuNs = []
        const menuN = { id: 0, label: '选择菜单', children: []}
          if (!this.isAdd){
              for (let i in res.body.content){
                  if (res.body.content[i].projectId === this.form.projectId){
                      menuN.children.push(res.body.content[i]);
                  }
              }
              if (menuN.children.length == 0){
                  menuN.label = '该项目下暂无菜单';
              }
          }else{
              menuN.children = res.body.content;
          }
          this.menuNs.push(menuN);
          this.menuNs = this.deleteChildren(this.menuNs);
          if (!this.isAdd){
              this.menuNs = this.deleteMenuSelf(this.menuNs);
          }
      })
    },
    getProjects(){
        getProjects().then(res =>{
            this.projects = []
            const project = {id: 0, label: '选择项目', children: []}
            project.children = res.body.content
            this.projects.push(project)
        })
    },
      loadOptions(){},
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
      }
  }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
  /deep/ .el-input-number .el-input__inner {
    text-align: left;
  }
</style>

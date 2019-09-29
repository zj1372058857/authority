<template>
  <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '编辑用户': ''" width="500px" :before-close="resetEForm">
    <el-form ref="eForm" :model="eForm" :rules="rules" size="small" label-width="80px">
      <el-form-item style="margin-bottom: 0px;" label="用户组">
        <el-select v-model="eForm.groupIds" multiple placeholder="请选择" style="width: 370px;">
          <el-option
            v-for="item in groups"
            :key="item.id"
            :label="item.groupName"
            :value="item.id"
          >
          </el-option>
        </el-select>
      </el-form-item><br>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="text" @click="cancel">取消</el-button>
      <el-button :loading="loading" type="primary" @click="doSubmit" v-model="userId">确认</el-button>
    </div>
  </el-dialog>
</template>

<script>
import Treeselect from '@riophae/vue-treeselect';
import '@riophae/vue-treeselect/dist/vue-treeselect.css';
import {getGroups} from '@/api/group';
import {edit} from '@/api/userN'
export default {
  components: { Treeselect },
  props: {
    isAdd: {
      type: Boolean,
      required: true
    },
  },
  data() {
    return {
      loading: false, dialog: false, groups: [], userId: 0,
      eForm: {
          groupIds: []
      },
      rules: {}
    }
  },
  methods: {
    cancel() {
      this.resetEForm();
    },
    doSubmit() {
        let params = {id: 0, groupParams: {clearFlag: false, groupIds: []}, areaShopParams: {clearFlag: false, ids: null}, wareHouseParams: {clearFlag: false, ids: null}};
        params.id = this.userId;
        if (this.eForm.groupIds.length>0){
            params.groupParams.groupIds = this.eForm.groupIds;
        }else{
            params.groupParams.clearFlag = true;
            params.groupParams.groupIds = null;
        }
        this.loading = true;
        this.doEdit(params);
    },
      doEdit(params) {
          let data = params;
          edit(data).then(res => {
              this.resetEForm();
              if (res.success){
                  this.$notify({
                      title: '修改成功',
                      type: 'success',
                      duration: 2500
                  });
              }else {
                  this.$notify({
                      title: res.message,
                      type: res.success,
                      duration: 2500
                  });
              };
              this.loading = false;
              this.$parent.init();
          }).catch(err => {
              this.loading = false;
              console.log(err.message);
          });
      },
    resetEForm() {
      this.dialog = false;
      this.$refs['eForm'].resetFields();
      this.eForm = {
          groupIds: []
      };
      this.userId = 0;
    },
     getGroups(id){
        this.userId = id;
        getGroups().then(res => {
            this.groups = res.body.content;
        });
     },
  }
}
</script>

<style scoped>

</style>

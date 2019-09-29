<template>
   <el-dialog :append-to-body="true" :visible.sync="dialog" :title="isAdd ? '添加门店权限' : '添加仓库权限'" width="800px" :before-close="resetForm">
       <div>
       <el-row>
          <!-- 授权 -->
          <!-- 门店 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="10" :xl="7">
            <el-card v-show="opt==='区域门店'" class="box-card" shadow="never">
              <div slot="header" class="clearfix">
                <el-tooltip class="item" effect="dark" content="选择指定用户绑定门店" placement="top">
                  <span class="role-span">门店绑定--查看</span>
                </el-tooltip>
              </div>
              <el-tree
                ref="areaShop"
                :data="areaShops"
                :default-checked-keys="shopIds"
                :props="defaultProps"
                accordion
                show-checkbox
                @check="checkedShopChange"
                node-key="nameIndex"/>
            </el-card>
          </el-col>
         <!-- 仓库 -->
         <el-col :xs="24" :sm="24" :md="8" :lg="10" :xl="7">
           <el-card v-show="opt==='城市仓库'" class="box-card" shadow="never">
             <div slot="header" class="clearfix">
               <el-tooltip class="item" effect="dark" content="选择指定用户绑定仓库" placement="top">
                 <span class="role-span">仓库绑定--查看</span>
               </el-tooltip>
             </div>
             <el-tree
               ref="cityHouse"
               :data="cityHouses"
               :default-checked-keys="houseIds"
               :props="defaultProps"
               accordion
               show-checkbox
               @check="checkedHouseChange"
               node-key="nameIndex"/>
           </el-card>
         </el-col>
         <!-- 操作 -->
          <el-col :xs="24" :sm="24" :md="8" :lg="14" :xl="7">
            <el-table :data="checkOptions" border style="width: 100%;" height="300px">
              <el-table-column fixed prop="label" label="店/仓名" width="250px" align="center"/>
              <el-table-column fixed label="有无操作权限？" width="0px" align="center">
                <template slot-scope="scope">
                    <el-radio  v-model="scope.row.donePermission" label="0">有</el-radio>
                    <el-radio  v-model="scope.row.donePermission" label="1">无</el-radio>
                  </template>
              </el-table-column>
            </el-table>
          </el-col>
        </el-row>
       </div>
       <div slot="footer" class="dialog-footer">
         <el-button type="text" @click="cancel">取消</el-button>
         <el-button :loading="loading" type="primary" @click="doSubmit" v-model="userId">确认</el-button>
       </div>
   </el-dialog>
</template>

<script>
    import Treeselect from '@riophae/vue-treeselect';
    import '@riophae/vue-treeselect/dist/vue-treeselect.css';
    import {getAreaShops, getHadShops, getCityHouses, getHadHouses, edit} from '@/api/userN';
    import treeTable from '@/components/TreeTable'
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
                loading: false, dialog: false, areaShops: [], opt: '', checkOptions: [],shopIds: [], userId: 0,
                houseIds: [],
                cityHouses: [],
                form: {},
                rules: {}
            }
        },
        methods: {
            checkHad(data){
                let isHad = true;
                for (let i in this.checkOptions){
                    if (data.nameIndex === this.checkOptions[i].nameIndex){
                        isHad = false
                    }
                }
                return isHad;
            },
            // 门店三件套
            getHadShops(id){
                this.userId = id;
                getHadShops(id).then(res => {
                    let array = [];
                    for(let i in res.body){
                        array.push(res.body[i].nameIndex);
                    };
                    console.log(array)
                    this.shopIds = array;
                    if (res.body !== null){
                        this.checkOptions = res.body;
                        for (let j in this.checkOptions){
                            this.checkOptions[j].donePermission = this.checkOptions[j].donePermission.toString();
                            this.checkOptions[j]['label'] = this.checkOptions[j].shopName;
                        }
                    }
                })
            },
            getAreaShops(){
                this.opt = '区域门店';
                getAreaShops().then(res => {
                    this.areaShops = res.body.content;
                })
            },
            checkedShopChange(data){
                if (data.children===null){data.children = []};
                if (data.shopFlag){
                    let array = this.$refs.areaShop.getCheckedKeys(true);
                    if (array.length>this.checkOptions.length){
                        data.donePermission = data.donePermission.toString();
                        let isHad = this.checkHad(data);
                        if (isHad){
                            this.checkOptions.push(data);
                        };
                    }else if(array.length<=this.checkOptions.length){
                        if (array.length===0){
                            this.checkOptions = [];
                        }else{
                            for (let i = 0; i < this.checkOptions.length; i++){
                                if (this.checkOptions[i].nameIndex === data.nameIndex){
                                    this.checkOptions.splice(i,1);
                                };
                            };
                        };
                    };
                }else if(data.children.length>0){
                    for(let i=0; i< data.children.length; i++){
                        this.checkedShopChange(data.children[i]);
                    };
                };
            },
            // 仓库三件套
            getHadHouses(id){
                this.userId = id;
                getHadHouses(id).then(res => {
                    let array = [];
                    for(let i in res.body){
                        array.push(res.body[i].nameIndex);
                    };
                    this.houseIds = array;
                    if (res.body !== null){
                        this.checkOptions = res.body;
                        for (let j in this.checkOptions){
                            this.checkOptions[j].donePermission = this.checkOptions[j].donePermission.toString();
                            this.checkOptions[j]['label'] = this.checkOptions[j].warehouseName;
                        };
                    };
                });
            },
            getCityHouses(){
                this.opt = '城市仓库';
                getCityHouses().then(res => {
                    this.cityHouses = res.body;
                    for (let i in this.cityHouses){
                        if (this.cityHouses[i].children.length>0){
                            for (let j in this.cityHouses[i].children){
                                if (this.cityHouses[i].children[j].wareHouseFlag){
                                    this.cityHouses[i].children[j]['label'] = this.cityHouses[i].children[j].warehouseName;
                                };
                            };
                        };
                    };
                });
            },
            checkedHouseChange(data){
                if (data.children===null){data.children = []};
                if (data.wareHouseFlag){
                    let array = this.$refs.cityHouse.getCheckedKeys(true);
                    if (array.length>this.checkOptions.length){
                        data.donePermission = data.donePermission.toString();
                        let isHad = this.checkHad(data);
                        if (isHad){
                            this.checkOptions.push(data);
                        };
                    }else if(array.length<=this.checkOptions.length){
                        if (array.length===0){
                            this.checkOptions = [];
                        }else{
                            for (let i = 0; i < this.checkOptions.length; i++){
                                if (this.checkOptions[i].nameIndex === data.nameIndex){
                                    this.checkOptions.splice(i,1);
                                };
                            };
                        };
                    };
                }else if(data.children.length>0){
                    for(let i=0; i< data.children.length; i++){
                        this.checkedHouseChange(data.children[i]);
                    };
                };
            },
            cancel() {
                this.resetForm();
            },
            doSubmit(data) {
                let params = {id: 0, groupParams: {clearFlag: false, groupIds: []}, areaShopParams: {}, wareHouseParams: {}};
                params.areaShopParams = {clearFlag: false, ids: []};
                params.wareHouseParams = {clearFlag: false, ids: []};
                params.id = this.userId;
                if (this.opt === '区域门店'){
                    if (this.checkOptions.length !== 0){
                        for (let i in this.checkOptions){
                            let shopAndHouse = {shopId: 0, queryPermission: 0, donePermission: 1};
                            shopAndHouse.shopId = this.checkOptions[i].id;
                            shopAndHouse.queryPermission = this.checkOptions[i].queryPermission;
                            shopAndHouse.donePermission = this.checkOptions[i].donePermission;
                            params.areaShopParams.ids.push(shopAndHouse);
                        };
                    }else{
                        params.areaShopParams.clearFlag = true;
                    };
                }else if(this.opt === '城市仓库'){
                    if (this.checkOptions.length !== 0){
                        for (let i in this.checkOptions){
                            let shopAndHouse = {shopId: 0, queryPermission: 0, donePermission: 1};
                            shopAndHouse.shopId = this.checkOptions[i].id;
                            shopAndHouse.queryPermission = this.checkOptions[i].queryPermission;
                            shopAndHouse.donePermission = this.checkOptions[i].donePermission;
                            params.wareHouseParams.ids.push(shopAndHouse);
                        };
                    }else{
                        params.wareHouseParams.clearFlag = true;
                    };
                }
                this.loading = true;
                this.doEdit(params);
            },
            doEdit(params) {
                let data = params;
                edit(data).then(res => {
                    if (res.success){
                        this.resetForm();
                        this.$notify({
                            title: '修改成功',
                            type: 'success',
                            duration: 2500
                        });
                        this.$parent.init();
                    }else {
                        this.$notify({
                            title: res.message,
                            type: res.success,
                            duration: 2500
                        })
                    }
                    this.loading = false;
                }).catch(err => {
                    this.loading = false
                    console.log(err.message)
                })
            },
            resetForm() {
                this.dialog = false;
                this.areaShops = [];
                this.areaHouses = [];
                this.checkOptions = [];
                this.userId = 0;
            }
        }
    }
</script>
<style scoped>
</style>

<template>
  <div class="outdiv">
    <el-card v-show='isShowCard' style="margin: 10px 0">
      <!-- 搜索栏 -->
      <div  style="margin: 20px 0">
        <el-form :inline="true" :model="formSearch" class="demo-form-inline">
          <el-form-item label="用户昵称">
            <el-input v-model="formSearch.userNickname" placeholder="输入昵称或昵称片段"></el-input>
          </el-form-item>
          <el-form-item label="账号状态">
            <el-select v-model="formSearch.userStatus" placeholder="选择账号状态">
              <el-option label="已封号" value="1"></el-option>
              <el-option label="正常" value="0"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="onSearchSubmit">搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div>
        <el-button
          style="margin-bottom: 10px"
          type="primary"
          icon="el-icon-plus"
          @click="addUser"
          >添加用户</el-button
        >
        <el-table :data="userList" style="width: 100%" border class="table_lazy">
          <el-table-column
          fixed="left"
            prop="userAvatarUrl"
            label="头像"
            width="80px"
            align="center"
          >
            <template slot-scope='{row,$index}'>
              <el-image
                append-to-body
                lazy
                :preview-src-list="[row.userAvatarUrl]"
                style="width: 30px; height: 30px;border-radius: 15px"
                :src="row.userAvatarUrl"></el-image>
            </template>
          </el-table-column>
          <el-table-column prop="userNickname" label="用户昵称" width="180px" align="center">
          </el-table-column>
          <el-table-column prop="userName" label="用户账号" width="120px" align="center">
          </el-table-column>
          <el-table-column prop="userPassword" label="用户密码" width="150px" align="center">
          </el-table-column>
          <el-table-column prop="userEmail" label="用户邮箱" width="200px" align="center">
          </el-table-column>
          <el-table-column prop="userStatement" label="个人简介" width="150px" >
          </el-table-column>
          <el-table-column prop="userBirthday" label="用户生日" width="95px" align="center">
          </el-table-column>
          <el-table-column prop="userGender" label="性别" width="70px" align="center">
          </el-table-column>
          <el-table-column prop="userStatus" label="账号状态" width="90px" align="center">
            <template slot-scope='{row,$index}'>
              <span class="fontstyle" :style="{'color':row.userStatus==0?'green':'red'}">{{row.userStatus==0?"正常":"已封号"}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="banBeginDate" label="封号时间" width="160px" align="center">
          </el-table-column>
          <el-table-column prop="userRegDate" label="注册日期" width="95px" align="center">
          </el-table-column>
          <el-table-column
            fixed="right"
            label="操作"
            width="200px"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="编辑"
                @click="updateUser(row)"
              ></el-button>
              <el-popconfirm :title="`确定封禁用户 ${row.userNickname}`" @onConfirm="banOrLetOfUser(row.uID,row.userStatus)">
              <el-button
                :disabled="row.userStatus==1"
                style="margin:0 10px"
                slot="reference"
                type="danger"
                icon="el-icon-remove-outline"
                size="mini"
                title="封禁用户"
              ></el-button>
              </el-popconfirm>
              <el-popconfirm :title="`确定解封用户 ${row.userNickname}`" @onConfirm="banOrLetOfUser(row.uID,row.userStatus)">
              <el-button
                :disabled="row.userStatus==0"
                slot="reference"
                type="success"
                icon="el-icon-circle-check"
                size="mini"
                title="解封用户"
              ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          style="text-align:center"
          background
          @size-change="handleSizeChanges"
          @current-change="handleCurrentChanges"
          :current-page="page"
          :page-sizes="[3, 5, 10]"
          :page-size="limit"
          layout="prev, pager, next, jumper,->,sizes,total"
          :total="total">
        </el-pagination>
      </div>
    </el-card>
    <transition name="el-zoom-in-top">
    <el-card v-show='!isShowCard' style="margin: 10px 0">
      <div>
        <el-form :model="userForm" :rules="rules" ref="userForm" label-width="100px" style="margin:0 10%;width:80%" class="demo-ruleForm">
          <el-form-item label="用户账号" prop="userName">
            <el-input v-model="userForm.userName"></el-input>
          </el-form-item>
           <el-form-item label="用户密码" prop="userPassword">
            <el-input v-model="userForm.userPassword"></el-input>
          </el-form-item>
           <el-form-item label="用户昵称" prop="userNickname">
            <el-input v-model="userForm.userNickname"></el-input>
          </el-form-item>
           <el-form-item label="用户邮箱" prop="userEmail">
            <el-input v-model="userForm.userEmail"></el-input>
          </el-form-item>
          <el-form-item label="用户性别" prop="userGender">
            <el-select v-model="userForm.userGender" placeholder="请选择性别">
              <el-option label="男" value="男"></el-option>
              <el-option label="女" value="女"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="生日" prop="userBirthday">
            <el-date-picker type="date" value-format="yyyy-MM-dd" placeholder="选择日期" v-model="userForm.userBirthday"></el-date-picker>
          </el-form-item>
          <el-form-item label="个人简介" prop="userStatement">
            <el-input type="textarea" v-model="userForm.userStatement"></el-input>
          </el-form-item>
          <el-form-item style="text-align:center">
            <el-button style="float:left" @click="isShowCard=true">取消</el-button>
            <el-button style="float:right" type="primary" @click="submitForm('userForm')">提交</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-card>
    </transition>
  </div>
</template>

<script>
export default {
  name:'User',
  data() {
    return {
      // 用户信息表
      userList:[],
      // 分页器
      page:1,
      limit:3,
      total:0,
      // 搜索用
      formSearch:{
        userNickname:'',
        userStatus:'',
      },
      // 用户信息表单
      userForm:{
        uID:'',
        userName:'',
        userPassword:'',
        userNickname:'',
        userEmail:'',
        userGender:'',
        userBirthday:'',
        userStatement:'',
      },
      // 显示表格
      isShowCard:true,
      // 表单校验
      rules: {
          userName: [
            { required: true, message: '账号不能为空', trigger: 'blur' },
            { validator: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '必须为手机号' }
          ],
          userPassword: [
            { required: true, message: '密码不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          userNickname: [
            { required: true, message: '昵称不能为空', trigger: 'blur' },
            { min: 1, max: 20, message: '长度在 1 到 20 个字符', trigger: 'blur' }
          ],
          userEmail: [
            {required: true, message: '邮箱不能为空', trigger: 'blur' },
            {type:'email',message: '邮箱输入不合法'}
          ],
          userGender: [
            { required: true, message: '性别不能为空', trigger: ['blur','change'] },
          ],
        }
    }
  },
  mounted() {
    this.getUserList();
  },
  methods: {
    // 获取用户信息
    async getUserList(){
      let {page,limit,formSearch}=this;
      let {userNickname,userStatus} = formSearch;
      let result=await this.$API.appUser.reqUserList({page,limit,userNickname,userStatus});
      if(result.code===200){
        this.total=result.count;
        this.userList = result.data;
      }
    },
    // 打开添加用户表单
    addUser(){
      this.isShowCard=false;
      // 重置表单
      this.resetForm('userForm');
    },
    // 编辑用户信息
    updateUser(row) {
      // 重置表单
      // this.resetForm('userForm');
      // 填充表单
      this.userForm={...row};
      delete this.userForm.banBeginDate;
      delete this.userForm.userAvatarUrl;
      delete this.userForm.userRegDate;
      delete this.userForm.userStatus;
      this.isShowCard = false;
    },
    // 封禁用户
    async banOrLetOfUser(uID,userStatus){
      let result = await this.$API.appUser.reqbanOrLetOfUser({uID,userStatus});
      if (result.code === 200) {
        this.getUserList();
        this.$message({ message: result.message, type: "success" });
      }else{
        this.$message({ message: "修改失败", type: "error" });
      }
    },
    // 分页
    // 修改每页显示条数
    handleSizeChanges(limit) {
      this.limit=limit;
      this.getUserList();
    },
    // 修改当前页
    handleCurrentChanges(page) {
      this.page=page;
      this.getUserList();
    },
    // 按条件查询
    onSearchSubmit(){
      let{userNickname,userStatus} = this.formSearch;
      // 校验数据
      if (userNickname==""&&userStatus == "") {
         this.$message({ message: "至少填写一个搜索条件！", type: "error" });
         return
      }else {
        // 发请求
        this.getUserList();
      }
    },
    // 提交表单
    submitForm(formName) {
        this.$refs[formName].validate(async(valid) => {
          if (valid) {
            // 发请求
            let result = await this.$API.appUser.reqAddOrUpdateUser(this.userForm);
            if (result.code ===200) {
              this.isShowCard=true;
              this.getUserList();
              this.$message({ message: result.message, type: "success" });
            }
          } else {
            return false;
          }
        });
      },
    // 重置表单
    resetForm(formName) {
        this.userForm.uID='';
        this.$refs[formName].resetFields();
      }
  },
}
</script>
<style>
.fontstyle{
  font-weight: bold;
}
.el-table__fixed-body-wrapper {
    z-index: auto !important;
  }
</style>

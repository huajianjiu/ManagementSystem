<template>
  <div>
    <el-card style="margin: 10px 0">
      <!-- 表格 -->
      <div v-show="isShowTable">
        <el-button
          style="margin-bottom: 10px"
          type="primary"
          icon="el-icon-plus"
          @click="addAnnouncement"
        >发布公告</el-button>
        <el-table
          :data="AList"
          style="width: 100%"
          border
        >
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="aTitle"
            label="公告标题"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="aTime"
            label="发布时间"
            width="width"
          >
          </el-table-column>
          <el-table-column
            prop="aClickCount"
            label="点击量"
            width="110px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            label="操作"
            width="width"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="success"
                icon="el-icon-view"
                size="mini"
                title="查看公告"
                @click="viewAnnouncement(row)"
              ></el-button>
              <el-button
                type="primary"
                icon="el-icon-edit"
                size="mini"
                title="编辑公告"
                @click="updateAnnouncement(row)"
              ></el-button>
              <el-popconfirm
                title="确定删除该条公告吗？"
                @onConfirm="deleteAnnouncement(row.aID)"
              >
                <el-button
                  style="margin: 0 10px"
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除公告"
                ></el-button>
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|编辑公告 -->
      <transition name="el-zoom-in-top">
        <div v-show="!isShowTable">
          <span style="text-align:center">
            <h1>编写公告</h1>
          </span>
          <el-form
            :model="AForm"
            :rules="rules"
            ref="ruleForm"
            label-width="100px"
            class="demo-ruleForm"
          >
            <el-form-item
              label="公告标题"
              prop="aTitle"
            >
              <el-input v-model="AForm.aTitle"></el-input>
            </el-form-item>
            <el-form-item
              label="公告内容"
              prop="aContents"
            >
              <el-input
                v-model="AForm.aContents"
                :rows="12"
                type="textarea"
              ></el-input>
            </el-form-item>
            <el-form-item>
              <el-button
                type="primary"
                @click="isShowTable = true"
              >取消</el-button>
              <el-button @click="addAnnouncementVal('ruleForm')">发布</el-button>
            </el-form-item>
          </el-form>
        </div>
      </transition>
      <!-- 公告内容弹窗 -->
        <div>
          <el-dialog
            center
            :visible.sync="dialogVisible"
            width="40%"
          >
          <div style="margin-top:-30px;text-align:center">
            <h1 style="">{{viewData.aTitle}}</h1>
            <span style="">发布时间：{{viewData.aTime}}</span>
            <hr>
            <div class="innerstyle">
                <p>{{viewData.aContents}}</p>
                <span class="count">阅读量：{{viewData.aClickCount}}</span>
            </div>
          </div>
            <span
              slot="footer"
              class="dialog-footer"
            >
            </span>
          </el-dialog>
        </div>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Announcement",
  data() {
    return {
      // 弹窗
      dialogVisible:false,
      // 公告数据
      AList: [],
      // 控制table显示与隐藏
      isShowTable: true,
      // 表单数据
      AForm: {
        aID: "",
        aTitle: "",
        aContents: "",
      },
      // 校验表单
      rules: {
        aTitle: [
          { required: true, message: "请输入公告标题", trigger: "blur" },
          {
            min: 2,
            max: 100,
            message: "长度在 2 到 100 个字符",
            trigger: "blur",
          },
        ],
        aContents: [
          { required: true, message: "请编写公告内容", trigger: "blur" },
          {
            min: 2,
            max: 3000,
            message: "长度在 2 到 3000 个字符",
            trigger: "blur",
          },
        ],
      },
      // 查看所需数据
      viewData:{},
    };
  },
  mounted() {
    // 获取公告数据
    this.getAnnouncemenList()
  },
  methods: {
    // 获取公告数据
    async getAnnouncemenList() {
      let result = await this.$API.announcement.reqAnnouncementList();
      if (result.code === 200) this.AList = result.data;
    },
    // 自定义事件回调函数
    getContents(content) {
      console.log(content);
    },
    // 调出发布公告表单
    addAnnouncement() {
      this.isShowTable = false;
      const { AForm } = this;
      // 置空表单
      AForm.aID = '',
        AForm.aTitle = "",
        AForm.aContents = ""
    },
    // 编辑公告
    updateAnnouncement(row) {
      // 隐藏表格
      this.isShowTable = false;
      // 将选中行数据给表单
      this.AForm = { ...row };
    },
    // 发布公告
    async addAnnouncementVal() {
      // 若属性值为空不能使用，需要提示用户
      if(this.AForm.aTitle.trim() == ""||this.AForm.aContents.trim() == "") {
        this.$message({ message: "必填项不能为空！", type: "error" });
        this.AForm.aTitle = "";
        this.AForm.aContents= "";
        return;
      }
      // 去除两边多余字符串
      this.AForm.aTitle = this.AForm.aTitle.trim();
      this.AForm.aContents = this.AForm.aContents.trim();
      // 提交添加|修改表单
      let result = await this.$API.announcement.reqAddOrdUpdateAnnouncement(this.AForm);
      if(result.code===200){
        this.isShowTable=true;
        this.getAnnouncemenList();
        this.$message({ message: result.message, type: "success" });
      }else{
        this.$message({ message: result.message, type: "error" });
      }
    },
    // 查看公告
    viewAnnouncement(row) {
      this.viewData=row;
      this.dialogVisible=true;
    },
    // 删除公告
    async deleteAnnouncement(aID){
      let result = await this.$API.announcement.reqDeleteAnnouncement({aID});
      if(result.code===200){
        this.getAnnouncemenList();
        this.$message({ message: "删除成功！", type: "success" });
      }
    }
  },
};
</script>

<style scoped>
  span {
    font-size: 12px;
  }
  .count{
    display:block;
    float:right;
    padding:20px 0;
  }
  .innerstyle{
    text-align:left;
    width:90%;
    margin:0 auto;
  }
  .innerstyle p{
    white-space: pre-wrap;
    font-size: 16px;
    color: black;
  }
</style>

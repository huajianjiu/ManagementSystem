<template>
  <div>
    <el-card style="margin:10px 0">
      <!-- 搜索栏 -->
      <div style="margin: 20px 0">
        <el-form
          :inline="true"
          :model="searchList"
          class="demo-form-inline"
        >
          <el-form-item label="板块">
            <el-select
              v-model="searchList.sName"
              placeholder="请选择板块"
            >
              <el-option
                :label="select.sName"
                :value="select.sName"
                v-for="(select,index) in selectList"
                :key="select.sID"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="用户昵称">
            <el-input
              v-model="searchList.userNickname"
              placeholder="输入用户昵称或昵称片段"
            ></el-input>
          </el-form-item>

          <el-form-item>
            <el-button
              type="primary"
              @click="onSearchSubmit"
            >搜索</el-button>
          </el-form-item>
        </el-form>
      </div>
      <!-- 表格 -->
      <div>
        <el-table
          :data="topicList"
          style="width: 100%"
          border
        >
          <el-table-column
            prop="section.sName"
            label="所属板块"
            width="120px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tTitle"
            label="帖子标题"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="user.userNickname"
            label="帖主昵称"
            width="width"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tLike"
            label="点赞数"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tReplyCount"
            label="评论数"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tClickCount"
            label="浏览量"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="tTime"
            label="发帖时间"
            width="160px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            width="200px"
            label="操作"
            align="center"
          >
            <template slot-scope="{ row, $index }">
              <el-button
                type="primary"
                icon="el-icon-view"
                size="mini"
                title="查看帖子"
                @click="viewTopic(row)"
              ></el-button>
              <el-button
                type="success"
                icon="el-icon-circle-check"
                size="mini"
                title="通过帖子"
                @click="updateTopic(row.tID)"
              ></el-button>
              <el-popconfirm
                title="确定删除该条帖子吗？这将同时删除所有评论"
                @onConfirm="deleteTopic(row.tID)"
              >
                <el-button
                  style="margin: 0 10px"
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除帖子"
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
          :total="total"
        >
        </el-pagination>
      </div>
      <!-- 公告内容弹窗 -->
      <div>
        <el-dialog
          center
          :visible.sync="dialogVisible"
          width="25%"
          top="0"
        >
          <div style="margin-top:-30px;text-align:center">
            <h3>{{viewData.tTitle}}</h3>
            <div style="height:20px">
              <span class="time">发布时间：{{viewData.tTime}}</span>
              <span class="read">阅读量：{{viewData.tClickCount}}</span>
            </div>
            <el-divider></el-divider>
            <div class="innerstyle">
              <p>{{viewData.tContents}}</p>
              <div class="demo-image__lazy">
                <el-image
                  v-for="url in viewData.imgList"
                  :key="url.pID"
                  :src="url.imgURL"
                  lazy
                ></el-image>
              </div>
              <div style="margin-top:20px">
                <el-badge
                  :value="viewData.tReplyCount"
                  class="item huibiao"
                >
                  <el-button size="small" @click="showReply(viewData.tID,viewData.tTitle)" title="管理评论">评论</el-button>
                </el-badge>
                <el-badge
                  :value="viewData.tLike"
                  class="item huibiao"
                >
                  <el-button
                    size="small"
                    disabled
                  >点赞</el-button>
                </el-badge>
              </div>
            </div>
          </div>
          <span
            slot="footer"
            class="dialog-footer"
          >
          </span>
        </el-dialog>
      </div>
      <!-- 评论表格弹窗 -->
      <DialogTable v-if="dialogtable" @closeTable="closeTable" :tTitle="tTitle" :tID="tID"></DialogTable>
    </el-card>
  </div>
</template>

<script>
export default {
  name: 'NotReviewed',
  data() {
    return {
      // 查询提交的表单
      searchList: {
        sName: '',//板块名
        userNickname: '',//用户昵称
      },
      // 帖子数据列表
      topicList: [],
      // 分页器相关
      page: 1,
      limit: 5,
      total: 0,
      // 下拉框数据
      selectList: [],
      dialogVisible: false,
      // 弹窗预览数据
      viewData: {},
      // 弹窗表格
      dialogtable:false,
      // 向弹窗表格传参
        tID: '',
        tTitle:''
    }
  },
  mounted() {
    // 获取表格数据
    this.getTopicList();
    // 获取下拉框数据
    this.getSelectList();
  },
  methods: {
    // 获取帖子列表
    async getTopicList() {
      let { sName, userNickname } = this.searchList;
      const { page, limit } = this;
      // 待审核
      const tStatus = 0;
      let result = await this.$API.topic.reqTopicList({ page, limit, sName, userNickname, tStatus });
      if (result.code === 200) {
        this.total = result.data.count;
        this.topicList = result.data.rows;
      }
    },
    // 获取下拉框数据
    async getSelectList() {
      let result = await this.$API.topic.reqSelectList();
      if (result.code === 200) {
        this.selectList = result.data;
      }
    },
    // 按条件查询
    onSearchSubmit() {
      let { sName, userNickname } = this.searchList;
      // 校验数据
      if (sName == "" && userNickname == "") {
        this.$message({ message: "至少填写一个搜索条件！", type: "error" });
        return
      } else {
        // 发请求
        this.getTopicList();
        this.$message({ message: "查询成功", type: "success" });
      }
    },
    // 分页
    // 修改每页显示条数
    handleSizeChanges(limit) {
      this.limit = limit;
      this.getTopicList();
    },
    // 修改当前页
    handleCurrentChanges(page) {
      this.page = page;
      this.getTopicList();
    },
    // 通过帖子
    async updateTopic(tID) {
      let result = await await this.$API.topic.reqPassTopic({ tID });
      if (result.code == 200) {
        this.getTopicList();
        this.$message({ message: '通过成功', type: "success" });
      }
    },
    // 删除帖子
    async deleteTopic(tID) {
      let result = await await this.$API.topic.reqDeleteTopic({ tID });
      if (result.code == 200) {
        this.getTopicList();
        this.$message({ message: '删除成功', type: "success" });
      }
    },
    // 查看帖子
    async viewTopic(row) {
        this.viewData=row;
        // 删除无用数据
      delete this.viewData.section;delete this.viewData.user;
      // 获取图片数组
      let result = await this.$API.topic.reqImgList({ tID: row.tID });
      if (result.code == 200) {
        this.viewData.imgList = result.data;
        this.dialogVisible=true;
      }
    },
    // 打开评论表格
    showReply(tID,tTitle){
      this.dialogtable=true;
      this.tID = tID;
      this.tTitle= tTitle;
    },
    // 自定义时间，关闭评论
    closeTable(){
      this.dialogtable=false;
    }
  },
}
</script>

<style scoped>
span {
  display: inline-block;
  font-size: 12px;
  margin-top: 0;
}
.time {
  float: left;
  margin-left: 30px;
}
.read {
  float: right;
  margin-right: 30px;
}
.innerstyle {
  text-align: left;
  width: 90%;
  margin: 0 auto;
}
.innerstyle p {
  white-space: pre-wrap;
  font-size: 16px;
  color: black;
}
.huibiao:first-child {
  float: left;
  margin: 10px 30px;
}
.huibiao:last-child {
  float: right;
  margin: 10px 30px;
}
</style>

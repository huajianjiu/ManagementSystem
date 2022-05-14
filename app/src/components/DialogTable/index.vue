<template>
  <div>
    <el-dialog
          @close="closeTable"
          :title="`帖子 ${tTitle} 的评论：`"
          :visible.sync="dialogVisible"
          width="width">
          <!-- <div style="width:100%;text-algin:center"><h2>帖子{{}}的评论</h2></div> -->
          <div>
            <el-table
              :data="replyList"
              style="width: 100%"
              :cell-style="{padding: 0}">
              <el-table-column
                prop="userAvatarUrl"
                width="55px"
                align="right"
                >
                <template  slot-scope='{row,$index}'>
                  <el-avatar style="margin-top:2px" :size="40" :src="row.user.userAvatarUrl" lazy></el-avatar>
                </template>
              </el-table-column>
              <el-table-column
              :show-overflow-tooltip="true"
                prop="user.userNickname"
                width="100px"
                >
              </el-table-column>
              <el-table-column
              :show-overflow-tooltip="true"
                prop="rContents"
                width="width">
              </el-table-column>
              <el-table-column
                prop="prop"
                width="80px"
                align="center">
                <template slot-scope='{row,$index}'>
                  <el-popconfirm
                title="确定删除该条评论？"
                @onConfirm="deleteReply(row.rID)"
              >
                <el-button
                  slot="reference"
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  title="删除评论"
                ></el-button>
              </el-popconfirm>
                </template>
              </el-table-column>
            </el-table>
            <el-pagination
            style="text-align:center"
              small
              @current-change="handleCurrentChanges"
              layout="prev, pager, next"
              :current-page="page"
              :page-size="limit"
              :total="total">
            </el-pagination>
          </div>
          <div slot="footer">
            <el-button style="float:left" size="mini" type="success" @click="refreshTable">刷 新</el-button>
            <el-button type="primary" size="mini" @click="dialogVisible = false">关 闭</el-button>
          </div>
        </el-dialog>
  </div>
</template>

<script>
export default {
  name:'DialogTable',
  data() {
    return {
      dialogVisible:true,
      replyList:[],
      page:1,
      limit:4,
      total:0
    }
  },
  mounted(){
    this.getReplyList();
  },
  props:['tID','tTitle'],
  methods: {
    // 获取表格数据
    async getReplyList() {
      const {page,limit,tID}=this;
      let result = await this.$API.topic.reqReplyList({page,limit,tID});
      if (result.code === 200){
        this.total=result.data.count;
        this.replyList=result.data.rows;
      }
    },
    // 刷新表格
    refreshTable(){
      this.getReplyList();
      this.$message({ message: "刷新成功", type: "success" });
    },
    // 关闭弹窗的回调
    closeTable() {
      this.$emit('closeTable');
    },
    // 删除评论
    async deleteReply(rID){
      let result = await this.$API.topic.reqDeleteReply({rID});
      if(result.code === 200){
        this.$message({ message: "删除成功", type: "success" });
        this.getReplyList();
      }
    },
    // 切换分页
    handleCurrentChanges(page){
      this.page = page;
      this.getReplyList();
    }
  },
}
</script>

<style scoped>

</style>

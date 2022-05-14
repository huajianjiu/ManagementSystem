<template>
  <div>
    <el-card style="margin: 10px 0">
      <!-- 表格 -->
      <div>
        <el-button
          style="margin-bottom: 10px"
          type="primary"
          icon="el-icon-plus"
          @click="addSection"
          >添加板块</el-button
        >
        <el-table :data="data" style="width: 100%" border>
          <el-table-column
            type="index"
            label="序号"
            width="80px"
            align="center"
          >
          </el-table-column>
          <el-table-column prop="sName" label="板块名称" width="200px">
          </el-table-column>
          <el-table-column prop="sStatement" label="板块简介" width="width">
          </el-table-column>
          <el-table-column
            prop="sTopicCount"
            label="帖子数"
            width="110px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="sClickCount"
            label="点击量"
            width="110px"
            align="center"
          >
          </el-table-column>
          <el-table-column
            prop="prop"
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
                @click="updateSection(row)"
              ></el-button>
              <el-popconfirm :title="`确定删除${row.sName}板块吗？这将删除该板块下所有帖子`" @onConfirm="deleteSection(row.sID)">
              <el-button
              style="margin:0 10px"
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
                title="删除"
              ></el-button>
                <!-- <el-button slot="reference">删除</el-button> -->
              </el-popconfirm>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <!-- 添加|编辑弹窗 -->
      <el-dialog
        style="text-align: center"
        :title="form.sID == '' ? '添加板块' : '修改板块'"
        :visible.sync="dialogFormVisible"
      >
        <el-form :rules="rules" :model="form">
          <el-form-item label="板块名称" prop="sName">
            <el-input v-model="form.sName" style="width: 88%"></el-input>
          </el-form-item>
          <el-form-item label="板块介绍" prop="sStatement">
            <el-input
              v-model="form.sStatement"
              style="width: 88%"
              :rows="4"
              type="textarea"
            ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="dialogFormVisible = false">取 消</el-button>
          <el-button type="primary" @click="addOrUpdateSectionVal"
            >确 定</el-button
          >
        </div>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
export default {
  name: "Section",
  data() {
    return {
      data: [],
      // 添加|修改板块弹窗
      dialogFormVisible: false,
      // 表单数据
      form: {
        sID: "",
        sName: "",
        sStatement: "",
      },
      // 校验表单
      rules: {
        sName: [
          { required: true, message: "请输入板块名称", trigger: "blur" },
          {
            min: 2,
            max: 15,
            message: "长度在 2 到 15 个字符",
            trigger: "blur",
          },
        ],
        sStatement: [
          { required: true, message: "请填写活动形式", trigger: "blur" },
          {
            min: 2,
            max: 500,
            message: "长度在 2 到 500 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  mounted() {
    // 获取表格数据
    this.getSectionList();
  },
  methods: {
    // 添加板块
    addSection() {
      // 显示弹出框
      this.dialogFormVisible = true;
      // 清空表单
      this.form.sID = "";
      this.form.sName = "";
      this.form.sStatement = "";
    },
    // 获取表格数据
    async getSectionList() {
      let result = await this.$API.section.reqSectionList();
      if (result.code === 200) {
        this.data = result.data;
      }
    },
    // 编辑板块信息
    updateSection(row) {
      this.dialogFormVisible = true;
      this.form.sID = row.sID;
      this.form.sName = row.sName;
      this.form.sStatement = row.sStatement;
    },
    // 添加|修改板块
    async addOrUpdateSectionVal() {
      // 若属性值为空不能使用，需要提示用户
      if (this.form.sName.trim() == ""||this.form.sName.trim() == "") {
        this.$message({ message: "必填项不能为空！", type: "error" });
        this.form.sName = "";
        return;
      }
      // 去除两边多余字符串
      this.form.sName = this.form.sName.trim();
      this.form.sStatement = this.form.sStatement.trim();
      let result = await this.$API.section.reqAddOrdUpdateSection(this.form);
      if (result.code === 200) {
        this.dialogFormVisible = false;
        this.$message({ message: result.message, type: "success" });
        this.getSectionList();
      } else {
        this.$message({ message: result.message, type: "error" });
      }
    },
    // 删除板块
    async deleteSection(sID){
      let result= await this.$API.section.reqDeleteSection({sID});
      if (result.code === 200) {
        this.$message({ message: "删除成功", type: "success" });
        this.getSectionList();
      }
    }
  },
};
</script>

<style scoped></style>

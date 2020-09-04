<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>主页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <div>
        <el-row :gutter="20">
          <el-col :span="22">
            <el-button type="primary" style="width: 100%;" @click="dialogVisible = true">新增餐桌</el-button>
          </el-col>
          <el-col :span="2">
            <el-tooltip effect="dark" content="刷新数据" placement="top" :enterable="false">
              <el-button type="success" icon="el-icon-refresh" @click="getNewData" circle></el-button>
            </el-tooltip>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        title="新增餐桌"
        :visible.sync="dialogVisible"
        width="50vw"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="addRecipeFormRef"
          :model="addRecipeForm"
          :rules="addRecipeFormRules"
          label-width="10vw"
          style="padding-right:2vw;"
        >
          <el-form-item label="桌号" prop="tablenumber">
            <el-input v-model="addRecipeForm.tablenumber" placeholder="请输入桌号" clearable></el-input>
          </el-form-item>
          <el-form-item label="可供就餐人数" prop="range">
            <el-input-number
              style="width:100%"
              v-model="addRecipeForm.range"
              :step="1"
              :min="1"
              :max="99"
              placeholder="请输入可供就餐人数"
              step-strictly
            ></el-input-number>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelAddRecipe">取消</el-button>
            <el-button type="success" @click="completeAddRecipe" :loading="modifyLoading">完成</el-button>
          </div>
        </span>
      </el-dialog>
      <div class="table-card" v-loading="tableLoading">
        <el-table stripe :data="currentTableinfo">
          <el-table-column prop="tablenumber" label="桌号" align="center"></el-table-column>
          <el-table-column prop="starttime" label="开台时间" align="center"></el-table-column>
          <el-table-column prop="range" label="推荐就餐人数" align="center"></el-table-column>
          <el-table-column prop="state" label="当前状态" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="judgeType(scope.row.state)"
                effect="dark"
              >{{judgeState(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <el-pagination
        background
        layout="prev, pager, next"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :total="totalPage"
        :hide-on-single-page="true"
        page-size="5"
      ></el-pagination>
    </el-card>
  </div>
</template>
<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.el-main {
  background-color: #eee;
  color: #333;
}
.box-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.table-card {
  display: flex;
  justify-content: center;
  margin-left: 20px;
  margin-right: 20px;
  margin-bottom: 20px;
}
</style>

<style>
.white-space {
  white-space: pre;
}
</style>

<script>
export default {
  data() {
    return {
      pagenum: 1,
      totalTableinfo: [],
      currentTableinfo: [],
      totalPage: 0,
      dialogVisible: false,
      tableLoading: true,
      addRecipeForm: {
        tablenumber: "",
        range: ""
      },
      addRecipeFormRules: {
        tablenumber: [
          {
            required: true,
            message: "请输入餐桌号",
            trigger: "blur"
          }
        ],
        range: [
          {
            required: true,
            message: "请输入可供就餐人数",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.$axios
      .get("https://cdn.guoshaocong.cn/gettableinfo")
      .then(response => {
        this.totalTableinfo = response.data.result;
        this.totalPage = this.totalTableinfo.length;
        this.currentTableinfo = this.totalTableinfo.slice(
          (this.pagenum - 1) * 5,
          this.pagenum * 5
        );
        this.tableLoading = false;
      })
      .catch(function(error) {
        console.log(error);
      });
  },
  beforeDestroy() {},
  methods: {
    judgeType(state) {
      if (state == 200) return "info";
      else if (state == 301) return "success";
      else if (state == 302) return "";
      else if (state == 303) return "danger";
      else return "info";
    },
    judgeState(state) {
      if (state == 200) return "空闲中";
      else if (state == 301) return "已开台";
      else if (state == 302) return "待开单";
      else if (state == 303) return "待签单";
      else return "未知状态 " + state;
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.currentTableinfo = this.totalTableinfo.slice(
        (newPage - 1) * 5,
        newPage * 5
      );
    },
    cancelAddRecipe() {
      this.dialogVisible = false;
      this.$refs.addRecipeFormRef.resetFields();
    },
    completeAddRecipe() {
      this.modifyLoading = true;
      this.$refs.addRecipeFormRef.validate(async valid => {
        if (!valid) {
          this.modifyLoading = false;
          return false;
        }
        this.$axios
          .post("https://cdn.guoshaocong.cn/addtable", {
            token: window.sessionStorage.getItem("token"),
            tablenumber: this.addRecipeForm.tablenumber,
            range: this.addRecipeForm.range
          })
          .then(response => {
            if (response.data.state == 200) {
              this.$message.success("成功新增餐桌");
              this.$router.go(0);
              this.totalRecipeinfo.unshift({
                tablenumber: this.addRecipeForm.tablenumber,
                range: this.addRecipeForm.range,
                state: 200
              });
              this.handleCurrentChange(this.pagenum);
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addRecipeFormRef.resetFields();
            } else {
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addRecipeFormRef.resetFields();
              this.$message.error("操作失败，请重试");
            }
          })
          .catch(function(error) {
            console.log(error);
            this.modifyLoading = false;
          });
      });
    },
    async getNewData() {
      await this.$axios
        .get("https://cdn.guoshaocong.cn/gettableinfo")
        .then(response => {
          this.totalTableinfo = response.data.result;
          this.totalPage = this.totalTableinfo.length;
          this.currentTableinfo = this.totalTableinfo.slice(
            (this.pagenum - 1) * 5,
            this.pagenum * 5
          );
        })
        .catch(function(error) {
          console.log(error);
        });
      this.$message.success("刷新成功");
    }
  }
};
</script>
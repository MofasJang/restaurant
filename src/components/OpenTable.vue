<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>前台管理</el-breadcrumb-item>
      <el-breadcrumb-item>开台管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <el-alert title="刷新数据可获取最新的就餐情况" type="info" center show-icon></el-alert>
      <div style="margin-top: 12px;">
        <el-row :gutter="20">
          <el-col :span="18">
            <el-button
              type="primary"
              style="width: 100%;"
              :loading="modifyLoading"
              @click="dialogVisible = true"
            >新开台</el-button>
          </el-col>
          <el-col :span="6">
            <el-button
              type="success"
              style="width: 100%;"
              :loading="modifyLoading"
              @click="getNewData"
            >刷新数据</el-button>
          </el-col>
        </el-row>
      </div>
      <el-dialog
        title="新开台"
        :visible.sync="dialogVisible"
        width="50vw"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="openTableFormRef"
          :model="openTableForm"
          :rules="openTableFormRules"
          label-width="10vw"
          style="padding-right:2vw;"
        >
          <el-form-item label="就餐人数" prop="number">
            <el-input-number
              style="width:100%;"
              v-model="openTableForm.number"
              @change="openTableForm.tablenumber = ''"
              :min="1"
              :max="99"
              :step="1"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="就餐桌号" prop="tablenumber">
            <el-select
              v-model="openTableForm.tablenumber"
              style="width:100%;"
              filterable
              placeholder="请输入就餐桌号"
            >
              <el-option
                v-for="item in totalTableinfo"
                :key="item.tablenumber"
                :label="item.tablenumber"
                :value="item.tablenumber"
                :disabled="judgeAvailable(item.state,item.range)"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelOpenTable">取消</el-button>
            <el-button type="success" @click="completeOpenTable" :loading="modifyLoading">完成</el-button>
          </div>
        </span>
      </el-dialog>
      <div class="table-card" v-loading="tableLoading">
        <el-table stripe :data="currentTableinfo">
          <el-table-column prop="tablenumber" label="桌号" align="center"></el-table-column>
          <el-table-column prop="starttime" label="开台时间" align="center"></el-table-column>
          <el-table-column prop="range" label="推荐就餐人数" align="center"></el-table-column>
          <el-table-column prop="peoplenum" label="实际就餐人数" align="center"></el-table-column>
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
      timer: "",
      currentTime: "",
      totalTableinfo: [],
      currentTableinfo: [],
      openTableForm: {
        number: 1,
        tablenumber: ""
      },
      totalPage: 0,
      tableLoading: true,
      modifyLoading: false,
      dialogVisible: false,
      openTableFormRules: {
        number: [
          {
            required: true,
            message: "请输入就餐人数",
            trigger: "blur"
          }
        ],
        tablenumber: [
          {
            required: true,
            message: "请输入就餐桌号",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    var _this = this;
    this.timer = setInterval(function() {
      _this.currentTime =
        new Date().getFullYear() +
        " 年 " +
        (new Date().getMonth() + 1) +
        " 月 " +
        new Date().getDate() +
        " 日　" +
        new Date().getHours() +
        " : " +
        new Date().getMinutes() +
        " : " +
        new Date().getSeconds();
    }, 500);
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
  beforeDestroy() {
    if (this.timer) {
      clearInterval(this.timer);
    }
  },
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
      else if (state == 302) return "已开单";
      else if (state == 303) return "已签单";
      else return "未知状态 " + state;
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.currentTableinfo = this.totalTableinfo.slice(
        (newPage - 1) * 5,
        newPage * 5
      );
    },
    judgeAvailable(state, range) {
      if (state != 200) return true;
      else if (range < this.openTableForm.number) return true;
      return false;
    },
    cancelOpenTable() {
      this.dialogVisible = false;
      this.$refs.openTableFormRef.resetFields();
    },
    completeOpenTable() {
      this.$refs.openTableFormRef.validate(async valid => {
        if (!valid) return false;
        this.modifyLoading = true;
        this.$axios
          .post("https://cdn.guoshaocong.cn/opentable", {
            token: window.sessionStorage.getItem("token"),
            number: this.openTableForm.number,
            tablenumber: this.openTableForm.tablenumber
          })
          .then(response => {
            if (response.data.state == 200) {
              this.$message.success("开台成功");
              this.modifyLoading = false;
              this.refreshData();
            } else if (response.data.state == 401) {
              this.$message.error("Token失效，请重新登陆");
              this.modifyLoading = false;
            } else if (response.data.state == 303) {
              this.modifyLoading = false;
              this.$message.error("桌号错误或非空闲，请重新选择");
              this.refreshData();
            } else {
              this.modifyLoading = false;
              this.$message.error("开台失败，请重试");
            }
          })
          .catch(function(error) {
            console.log(error);
          });
        this.dialogVisible = false;
        this.$refs.openTableFormRef.resetFields();
      });
    },
    refreshData() {
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
    async getNewData() {
      await this.refreshData();
      this.$message.success("刷新成功");
    }
  }
};
</script>
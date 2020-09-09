<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>主页</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <el-alert title="请在侧边栏选择您想要使用的功能" type="info" center show-icon></el-alert>
      <div>
        <p>
          现在时间是 {{currentTime}} , 当前的就餐情况：
          <i style="padding-left: 5vw"></i>
          <el-tooltip effect="dark" content="刷新数据" placement="top" :enterable="false">
            <el-button type="success" icon="el-icon-refresh" @click="getNewData" circle></el-button>
          </el-tooltip>
        </p>
      </div>
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
      timer: "",
      currentTime: "",
      totalTableinfo: [],
      currentTableinfo: [],
      totalPage: 0,
      tableLoading: true
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
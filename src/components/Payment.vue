<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>前台管理</el-breadcrumb-item>
      <el-breadcrumb-item>客人买单</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <el-alert title="刷新数据可获取最新的就餐情况" type="info" center show-icon></el-alert>
      <div style="margin-top: 12px;">
        <el-button type="success" style="width: 100%;" @click="getNewData">刷新数据</el-button>
      </div>
      <el-dialog
        title="客户结账"
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
          <el-form-item label="桌号">
            <el-input
              style="width:100%;"
              v-model="openTableForm.tablenumber"
            ></el-input>
          </el-form-item>
          <el-form-item label="应付金额">
            <el-input
              style="width:100%;"
              v-model="openTableForm.amounttotal"
            ></el-input>
          </el-form-item>
          <el-form-item label="付款金额">
            <el-input
              style="width:100%;"
              v-model="openTableForm.amountpaid"
            ></el-input>
          </el-form-item>
          <el-form-item label="结账员">
            <el-select
              v-model="openTableForm.staffaccount"
              style="width:100%;"
              filterable
              placeholder="请输入结账员账号"
            >
              <el-option
                v-for="item in totalStaffinfo"
                :key="item.account"
                :label="item.account"
                :value="item.account"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelOpenTable">取消</el-button>
            <el-button type="success" @click="completeOpenTable" :loading="modifyLoading">结账</el-button>
          </div>
        </span>
      </el-dialog>
      <div class="table-card" v-loading="tableLoading">
        <el-table stripe :data="currentTableinfo">
          <el-table-column prop="tablenumber" label="桌号" align="center"></el-table-column>
          <el-table-column prop="starttime" label="开台时间" align="center"></el-table-column>
          <el-table-column prop="peoplenum" label="就餐人数" align="center"></el-table-column>
          <el-table-column prop="state" label="当前状态" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="judgeType(scope.row.state)"
                effect="dark"
              >{{judgeState(scope.row.state)}}</el-tag>
            </template>
          </el-table-column>
          <el-table-column label="操作" align="center">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                   :disabled="scope.row.state==303 ? false : true"
                  @click="paybill(scope.row.tablenumber)"
                >结账</el-button>
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
      totalStaffinfo: [],
      currentTime: "",
      totalTableinfo: [],      
      totalPaymentinfo: [],      
      currentTableinfo: [],
      openTableForm: {
        tablenumber: "",
        amounttotal: "",
        amountpaid: "",
        staffaccount: "staff"
      },
      totalPage: 0,
      tableLoading: true,
      staffLoading: true,
      paymentLoading: true,
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
    this.$axios
      .get("https://cdn.guoshaocong.cn/getpaymentinfo")
      .then(response => {
        this.totalPaymentinfo = response.data.result;
        this.paymentLoading = false;
      })
      .catch(function(error) {
        console.log(error);
      });
    this.$axios
    .get("https://cdn.guoshaocong.cn/getaccount")
    .then(response => {
      this.totalStaffinfo = response.data.result;
      this.staffLoading = false;
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
    paybill(tablenumber){
      this.openTableForm.tablenumber=tablenumber;
      for(var i=0; i<this.totalPaymentinfo.length;i++){
        if(this.totalPaymentinfo[i].tablenumber==tablenumber)
          this.openTableForm.amounttotal=this.totalPaymentinfo[i].amounttotal;
      }
      this.openTableForm.amountpaid= this.openTableForm.amounttotal;
      this.dialogVisible = true;
    },
    completeOpenTable() {
      this.$refs.openTableFormRef.validate(async valid => {
        if (!valid) return false;
        this.modifyLoading = true;
        this.$axios
          .post("https://cdn.guoshaocong.cn/paybill", {
            tablenumber: this.openTableForm.tablenumber,
            amountpaid: this.openTableForm.amountpaid,
            staffaccount: this.openTableForm.staffaccount
          })
          .then(response => {
            if (response.data.state == 200) {
              this.$message.success("结账成功");
              this.modifyLoading = false;
              this.refreshData();
            } else if (response.data.state == 303) {
              this.modifyLoading = false;
              this.$message.error("该桌已结账");
              this.refreshData();
            }  else if (response.data.state == 501) {
              this.modifyLoading = false;
              this.$message.error("结账成功，餐桌状态更新失败");
              this.refreshData();
            } else {
              this.modifyLoading = false;
              this.$message.error("结账失败，请重试");
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
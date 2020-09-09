<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>前台管理</el-breadcrumb-item>
      <el-breadcrumb-item>结账数据分析</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <el-alert title="选择日期区间查询区间内结账数据" type="info" center show-icon></el-alert>
      <div style="margin-top: 12px;">
        <el-row :gutter="20">
          <el-col :span="8">
            <div class="block">
              <!-- <span class="demonstration">开始时间</span> -->
              <el-date-picker
              v-model="startTime"
              type="date"
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd"
              placeholder="选择开始日期"
              :picker-options="pickerOptionsStart">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="1">
            <span style="color: #333333;font-size: 14px;">至</span>
          </el-col>
          <el-col :span="8">  
            <!-- 结束时间 -->
            <div class="block">
              <!-- <span class="demonstration">结束时间</span> -->
              <el-date-picker
              v-model="endTime"
              type="date"
              format="yyyy-MM-dd" 
              value-format="yyyy-MM-dd"
              placeholder="选择结束日期"
              :picker-options="pickerOptionsEnd">
              </el-date-picker>
            </div>
          </el-col>
          <el-col :span="6">
            <el-button
              type="success"
              style="width: 100%;"
              :loading="modifyLoading"
              @click="getNewData"
            >查询账单</el-button>
          </el-col>
        </el-row>
      </div>     
      <div class="table-card" v-loading="tableLoading">
        <el-table stripe :data="currentTableinfo">
          <el-table-column prop="settlementid" label="结账单号" align="center"></el-table-column>
          <el-table-column prop="tablenumber" label="桌号" align="center"></el-table-column>
          <el-table-column prop="staffaccount" label="结账员" align="center"></el-table-column>
          <el-table-column prop="username" label="客户id" align="center"></el-table-column>
          <el-table-column prop="amounttotal" label="菜品总价" align="center"></el-table-column>
          <el-table-column prop="amountpaid" label="实付金额" align="center"></el-table-column>
          <el-table-column prop="paytime" label="结账时间" align="center"></el-table-column>
          <el-table-column prop="status" label="当前状态" align="center">
            <template slot-scope="scope">
              <el-tag
                :type="judgeType(scope.row.status)"
                effect="dark"
              >{{judgeState(scope.row.status)}}</el-tag>
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
      <div style="margin-top: 12px;">
        客户实付总额：  {{totalPayment}}  元
      </div>
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
      totalPayment: 0,
      totalTableinfo: [],
      currentTableinfo: [],
      startTime:"",
      endTime:"",
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
      },
      pickerOptionsStart: {
          disabledDate: (time) => {
          if (this.endTime !== '') {
              // return time.getTime() < Date.now() - 8.64e7 || time.getTime() > this.endTime
              return  time.getTime() > this.endTime
          } else {
              // return time.getTime() < Date.now() - 8.64e7
          }
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },
      pickerOptionsEnd: {
          disabledDate: (time) => {
          if (this.startTime !== '') {
              return time.getTime() < this.startTime
          } else {
              // return time.getTime() < Date.now()
              // return time.getTime() < Date.now() - 8.64e7
          }
          },
          shortcuts: [{
            text: '今天',
            onClick(picker) {
              picker.$emit('pick', new Date());
            }
          }, {
            text: '昨天',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24);
              picker.$emit('pick', date);
            }
          }, {
            text: '一周前',
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit('pick', date);
            }
          }]
      },

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
      .get("https://cdn.guoshaocong.cn/getpaymentinfo")
      .then(response => {
        this.totalTableinfo = response.data.result;
        this.totalPage = this.totalTableinfo.length;
        this.currentTableinfo = this.totalTableinfo.slice(
          (this.pagenum - 1) * 5,
          this.pagenum * 5
        );
        this.plusamountpaid();
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
      if (state == 401) return "danger";
      else if (state == 402) return "success";
      else return "info";
    },
    judgeState(state) {
      if (state == 401) return "未结账";
      else if (state == 402) return "已结账";
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
    plusamountpaid(){
      this.totalPayment=0;
      for(let index=0; index<this.totalTableinfo.length; index++){
        if(this.totalTableinfo[index].status=="402"){
          this.totalPayment+=this.totalTableinfo[index].amountpaid;
        }         
      }
    },
    datechoose(info){
      var totalinfo=[];
      var start=new Date(this.startTime);
      var end=new Date(this.endTime);
      var i,cur;
      if(this.startTime!="" && this.endTime!=""){
        for(i=0;i<info.length;i++){
          cur=new Date(info[i].paytime.substring(0,10));
          if(start.getTime()<=cur.getTime() && end.getTime()>=cur.getTime())
            totalinfo.push(info[i]);
        }
      }
      else if(this.startTime=="" && this.endTime!=""){
        for(i=0;i<info.length;i++){
          cur=new Date(info[i].paytime.substring(0,10));
          if(end.getTime()>=cur.getTime())
            totalinfo.push(info[i]);
        }
      }
      else if(this.startTime!="" && this.endTime==""){
        for(i=0;i<info.length;i++){
          cur=new Date(info[i].paytime.substring(0,10));
          if(start.getTime()<=cur.getTime())
            totalinfo.push(info[i]);
        }
      }
      else
        totalinfo=info;
      return totalinfo;
    },
    refreshData() {
      this.$axios
        .get("https://cdn.guoshaocong.cn/getpaymentinfo")
        .then(response => {
          this.totalTableinfo = this.datechoose(response.data.result);
          this.totalPage = this.totalTableinfo.length;
          this.currentTableinfo = this.totalTableinfo.slice(
            (this.pagenum - 1) * 5,
            this.pagenum * 5
          );
          this.plusamountpaid();
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
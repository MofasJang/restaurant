<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Tool Crib System 管理中枢</el-breadcrumb-item>
      <el-breadcrumb-item>工具申请</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="applyTool-card" shadow="hover">
      <el-alert title="点击下方的按钮开始一个新的工具申请流程" center type="info" show-icon></el-alert>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button
            type="primary"
            style="width:100%"
            @click="startApply"
            icon="el-icon-thumb"
          >点击这里开始申请工具</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="工具申请"
        :visible.sync="dialogVisible"
        width="50%"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="applyToolFormRef"
          :model="applyToolForm"
          :rules="applyToolFormRules"
          label-width="140px"
          style="padding-right:40px;"
        >
          <el-form-item label="工具 ID" prop="toolid">
            <el-select
              v-model="applyToolForm.toolid"
              style="width:100%;"
              filterable
              placeholder="请输入工具 ID"
            >
              <el-option
                v-for="item in toolinfo"
                :key="item.toolid"
                :label="item.toolid"
                :value="item.toolid"
                :disabled="judgeAvailable(item.available)"
              ></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="申请人 ID" prop="applicantid">
            <el-input
              v-model="applyToolForm.applicantid"
              prefix-icon="el-icon-user"
              placeholder="请输入申请人 ID"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="预计归还时间" prop="returntime">
            <el-date-picker
              size="medium"
              style="width:100%;"
              v-model="applyToolForm.returntime"
              type="date"
              placeholder="请输入预计归还时间"
              value-format="yyyy-MM-dd"
              :picker-options="pickerOptions"
            ></el-date-picker>
          </el-form-item>
        </el-form>
        <barcode
          style="text-align:center"
          :height="60"
          :value="this.applyToolForm.toolid"
        >输入工具 ID 以显示条形码</barcode>
        <span slot="footer">
          <div>
            <el-button @click="cancelApplyTool">取消申请</el-button>
            <el-button type="success" @click="completeApplyTool">完成申请</el-button>
          </div>
        </span>
      </el-dialog>
      <el-divider></el-divider>
      <el-table stripe :data="toollist">
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-form label-position="left" inline class="toollist-expand">
              <el-form-item label="申请 ID ">
                <span>{{ scope.row.applyid }}</span>
              </el-form-item>
              <el-form-item label="工具 ID ">
                <el-popover placement="right" width="300" close-delay="200" trigger="hover">
                  <el-link :underline="false" slot="reference">{{scope.row.toolid}}</el-link>
                  <barcode style="text-align:center" :value="scope.row.toolid">Fail to show barcode.</barcode>
                </el-popover>
              </el-form-item>
              <el-form-item label="工具名称 ">
                <span>{{ scope.row.toolname }}</span>
              </el-form-item>
              <el-form-item label="申请人 ID ">
                <span>{{ scope.row.applicantid }}</span>
              </el-form-item>
              <el-form-item label="所属仓库 ">
                <el-tag :type="judgeType(scope.row.warehouse)" effect="dark">{{scope.row.warehouse}}</el-tag>
              </el-form-item>
              <el-form-item label="申请时间 ">
                <span>{{ scope.row.applytime }}</span>
              </el-form-item>
              <el-form-item label="预计归还时间 ">
                <span>{{ scope.row.returntime }}</span>
              </el-form-item>
            </el-form>
          </template>
        </el-table-column>
        <el-table-column label="申请 ID" prop="applyid" width="150"></el-table-column>
        <el-table-column label="工具 ID" prop="toolid">
          <template slot-scope="scope">
            <el-popover placement="right" width="300" close-delay="200" trigger="hover">
              <el-link slot="reference">{{scope.row.toolid}}</el-link>
              <barcode style="text-align:center" :value="scope.row.toolid">Fail to show barcode.</barcode>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="工具名称" prop="toolname"></el-table-column>
        <el-table-column label="申请人 ID" prop="applicantid"></el-table-column>
        <el-table-column label="所属仓库">
          <template slot-scope="scope">
            <el-tag :type="judgeType(scope.row.warehouse)" effect="dark">{{scope.row.warehouse}}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag :type="judgeType(scope.row.state)" effect="dark">{{scope.row.state}}</el-tag>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination
        layout="total, prev, pager, next, jumper"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :total="total"
        page-size="5"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      dialogVisible: false,
      toolinfo: [],
      toollist: [],
      totaltoollist: [],
      pagenum: 1,
      total: 0,
      applyToolForm: {
        toolid: "",
        applicantid: "",
        applytime: "",
        returntime: ""
      },
      applyToolFormRules: {
        toolid: [
          {
            required: true,
            message: "请输入工具 ID",
            trigger: "blur"
          }
        ],
        applicantid: [
          {
            required: true,
            message: "请输入申请人 ID",
            trigger: "blur"
          }
        ],
        returntime: [
          {
            required: true,
            message: "请输入预计归还时间",
            trigger: "blur"
          }
        ]
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() + 3600 * 1000 * 24 < Date.now();
        },
        shortcuts: [
          {
            text: "今天",
            onClick(picker) {
              picker.$emit("pick", new Date());
            }
          },
          {
            text: "明天",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24);
              picker.$emit("pick", date);
            }
          },
          {
            text: "7天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 7);
              picker.$emit("pick", date);
            }
          },
          {
            text: "30天后",
            onClick(picker) {
              const date = new Date();
              date.setTime(date.getTime() + 3600 * 1000 * 24 * 30);
              picker.$emit("pick", date);
            }
          }
        ]
      }
    };
  },
  created() {
    this.initial();
    this.getToolList();
  },
  methods: {
    initial() {
      if (window.localStorage.getItem("toolListCookies") == null) {
        this.totaltoollist = [
          {
            applyid: "100008",
            toolid: "10001",
            toolname: "工具 10001",
            applicantid: "80001",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-03-10 17:28:31",
            returntime: "2020-03-20"
          },
          {
            applyid: "100007",
            toolid: "10003",
            toolname: "工具 10003",
            applicantid: "80004",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-03-10 19:23:21",
            returntime: "2020-03-20"
          },
          {
            applyid: "100006",
            toolid: "10002",
            toolname: "工具 10002",
            applicantid: "80001",
            warehouse: "校内仓库",
            state: "未归还",
            applytime: "2020-03-09 15:28:30",
            returntime: "2020-03-19"
          },
          {
            applyid: "100005",
            toolid: "10005",
            toolname: "工具 10005",
            applicantid: "80007",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-03-05 17:28:59",
            returntime: "2020-03-15"
          },
          {
            applyid: "100004",
            toolid: "10009",
            toolname: "工具 10009",
            applicantid: "80006",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-03-01 18:28:00",
            returntime: "2020-03-21"
          },
          {
            applyid: "100003",
            toolid: "10011",
            toolname: "工具 10011",
            applicantid: "80003",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-02-19 18:28:00",
            returntime: "2020-03-21"
          },
          {
            applyid: "100002",
            toolid: "10008",
            toolname: "工具 10008",
            applicantid: "80006",
            warehouse: "校内仓库",
            state: "未归还",
            applytime: "2020-02-18 17:02:00",
            returntime: "2020-03-18"
          },
          {
            applyid: "100001",
            toolid: "10015",
            toolname: "工具 10013",
            applicantid: "80001",
            warehouse: "校外仓库",
            state: "未归还",
            applytime: "2020-02-17 14:27:40",
            returntime: "2020-03-17"
          }
        ];
        window.localStorage.setItem(
          "toolListCookies",
          JSON.stringify(this.totaltoollist)
        );
        return;
      } else {
        this.totaltoollist = JSON.parse(
          window.localStorage.getItem("toolListCookies")
        );
      }
    },
    getToolList() {
      // 修改这里以从后端调取信息
      this.toollist = this.totaltoollist.slice(
        (this.pagenum - 1) * 5,
        (this.pagenum - 1) * 5 + 5
      );
      this.total = this.totaltoollist.length;
    },
    judgeType(warehouse) {
      if (warehouse == "校外仓库") return "success";
      if (warehouse == "校内仓库") return "primary";
      if (warehouse == "未归还") return "danger";
      if (warehouse == "已归还") return "info";
      else return "info";
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getToolList();
    },
    cancelApplyTool() {
      this.dialogVisible = false;
      this.$refs.applyToolFormRef.resetFields();
    },
    completeApplyTool() {
      this.$refs.applyToolFormRef.validate(async valid => {
        if (!valid) return false;
        // 在这里添加后端交互，下面是前端层面的新增操作
        if (window.localStorage.getItem("toolInfoCookies") != null) {
          var toolinfolist = JSON.parse(
            window.localStorage.getItem("toolInfoCookies")
          );
          for (var i = 0; i < toolinfolist.length; i++) {
            if (toolinfolist[i].toolid == this.applyToolForm.toolid) {
              if (toolinfolist[i].available == "不可用") {
                this.$message.error("此工具不可用，请重新选择");
                return false;
              }
              toolinfolist[i].available = "不可用";
              window.localStorage.setItem(
                "toolInfoCookies",
                JSON.stringify(toolinfolist)
              );
              break;
            }
          }
        }
        this.totaltoollist.unshift({
          applyid: this.getNewApplyid().toString(),
          toolid: this.applyToolForm.toolid,
          toolname: "工具 " + this.applyToolForm.toolid,
          applicantid: this.applyToolForm.applicantid,
          warehouse: this.getNewWareHouse(),
          applytime:
            new Date().getFullYear() +
            "-" +
            (new Date().getMonth() + 1) +
            "-" +
            new Date().getDate() +
            " " +
            new Date().getHours() +
            ":" +
            new Date().getMinutes() +
            ":" +
            new Date().getSeconds(),
          returntime: this.applyToolForm.returntime,
          state: "未归还"
        });
        window.localStorage.setItem(
          "toolListCookies",
          JSON.stringify(this.totaltoollist)
        );
        this.getToolList();
        // 上面是前端层面的新增操作，添加后端代码后删除上述代码并添加刷新页面操作
        this.dialogVisible = false;
        this.$refs.applyToolFormRef.resetFields();
        this.$message.success("成功提交了工具申请");
      });
    },
    getNewWareHouse() {
      if (Number(this.applyToolForm.toolid) % 2 == 1) return "校外仓库";
      else return "校内仓库";
    },
    getNewApplyid() {
      if (this.totaltoollist.length > 0)
        return Number(this.totaltoollist[0].applyid) + 1;
      else return "100001";
    },
    startApply() {
      this.dialogVisible = true;
      this.toolinfo = JSON.parse(
        window.localStorage.getItem("toolInfoCookies")
      );
    },
    judgeAvailable(available) {
      if (available == "不可用") return true;
      return false;
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.applyTool-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.el-pagination {
  margin-top: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.toollist-expand {
  font-size: 0;
}
.toollist-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
<style>
/* <style>与<style scoped>的区别是前者会影响所有页面的样式，后者scoped属性会限制 */
/* 该组件的style的作用域，无法作用于其他element组件。通常情况，使用<style scoped> */
.toollist-expand label {
  width: 120px;
  font-weight: bold;
  color: #99a9bf;
}
</style>



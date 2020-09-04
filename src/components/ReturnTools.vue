<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Tool Crib System 管理中枢</el-breadcrumb-item>
      <el-breadcrumb-item>工具归还</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="returnTools-card" shadow="hover">
      <el-alert title="点击下方按钮搜索需归还的工具" center type="info" show-icon></el-alert>
      <el-row :gutter="20">
        <el-col :span="24">
          <el-button
            type="primary"
            style="width:100%"
            @click="dialogVisible = true"
            icon="el-icon-thumb"
          >点击这里搜索工具借出记录</el-button>
        </el-col>
      </el-row>
      <el-dialog
        title="工具归还"
        :visible.sync="dialogVisible"
        width="75%"
        @closed="cancelReturnTool"
      >
        <el-form
          ref="searchFormRef"
          :model="searchForm"
          :rules="searchFormRules"
          style="padding-left:50px;"
        >
          <el-row :gutter="20">
            <el-col :span="18">
              <el-form-item prop="searchid">
                <el-input
                  v-model="searchForm.searchid"
                  prefix-icon="el-icon-setting"
                  placeholder="请输入工具 ID"
                  label-width="100px"
                  @keyup.enter="searchTool"
                  clearable
                ></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="5">
              <el-button @click="searchTool" style="width: 100%;" type="primary">搜索</el-button>
            </el-col>
          </el-row>
          <el-table stripe :data="searchResult">
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
            <el-table-column label="状态">
              <template slot-scope="scope">
                <el-tag :type="judgeType(scope.row.state)" effect="dark">{{scope.row.state}}</el-tag>
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  size="small"
                  type="primary"
                  @click="addReturn(scope.$index,scope.row.applyid,scope.row.toolid)"
                >归还工具</el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-form>
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
              <el-form-item label="归还时间 ">
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
      totaltoollist: [],
      toollist: [],
      pagenum: 1,
      total: 0,
      searchForm: { searchid: "" },
      searchResult: [],
      searchFormRules: {
        searchid: [
          {
            required: true,
            message: "请输入工具 ID",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.initial();
    this.getToolList();
    this.getSearchResult();
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
        this.totaltoollist = JSON.parse(window.localStorage.getItem("toolListCookies"));
      }
    },
    getToolList() {
      this.toollist = this.totaltoollist.slice(
        (this.pagenum - 1) * 5,
        (this.pagenum - 1) * 5 + 5
      );
      this.total = this.totaltoollist.length;
    },
    getSearchResult() {
      this.searchResult = this.totaltoollist;
    },
    searchTool() {
      this.$refs.searchFormRef.validate(async valid => {
        if (!valid) {
          this.searchResult = this.totaltoollist;
          return false;
        }
        this.searchResult = [];
        for (var i = 0; i < this.totaltoollist.length; i++) {
          if (this.totaltoollist[i].toolid.includes(this.searchForm.searchid)) {
            this.searchResult.push(this.totaltoollist[i]);
          }
        }
      });
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
    cancelReturnTool() {
      this.dialogVisible = false;
      this.$refs.searchFormRef.resetFields();
      this.getSearchResult();
    },
    addReturn(index, theapplyid, thetoolid) {
      // 在这里添加后端交互，下面是前端层面的删除操作
      this.searchResult[index].state = "已归还";
      for (var i = 0; i < this.totaltoollist.length; i++) {
        if (this.totaltoollist[i].applyid == theapplyid) {
          this.totaltoollist[i].state = "已归还"; 
          window.localStorage.setItem("toolListCookies", JSON.stringify(this.totaltoollist));
          break;
        }
      }
      if (window.localStorage.getItem("toolInfoCookies") != null) {
          var toolinfolist = JSON.parse(window.localStorage.getItem("toolInfoCookies"));
          for (i = 0; i < toolinfolist.length; i++) {
            if (toolinfolist[i].toolid == thetoolid) {
              toolinfolist[i].available = "可用";
              window.localStorage.setItem(
                "toolInfoCookies",
                JSON.stringify(toolinfolist)
              );
              break;
            }
          }
        }
      this.getToolList();
      // 上面是前端层面的新增操作，添加后端代码后删除上述代码并添加刷新页面操作
      this.$message.success("成功归还了工具");
    }
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.returnTools-card {
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



<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>Tool Crib System 管理中枢</el-breadcrumb-item>
      <el-breadcrumb-item>采购信息</el-breadcrumb-item>
    </el-breadcrumb>

    <el-card class="Purchaser-card" shadow="hover">
      <el-table stripe :data="purchaserlist">
        <el-table-column label="采购商名称" prop="purchasername" width="300"></el-table-column>
        <el-table-column label="工具名称" prop="toolname" width="300"></el-table-column>
        <el-table-column label="工具数量" prop="toolnum"></el-table-column>
        <el-table-column label="信息更新时间" prop="upsettime"></el-table-column>
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
      purchaserlist: [],
      pagenum: 1,
      total: 0,
    };
  },
  created() {
    this.getPurchaserList();
  },
  methods: {
    getPurchaserList() {
      // 修改这里以从后端调取信息
      if (this.pagenum == 1) {
        this.purchaserlist = [
          { 
            purchasername: "SATA世达",
            toolname: "工具 10008",
            toolnum: "12",
            upsettime: "2020-03-15 16:18:31"
          },
          {
            purchasername: "史丹利STANLEY",
            toolname: "工具 10007",
            toolnum: "25",
            upsettime: "2020-02-10 15:26:31"
          },
          {
            purchasername: "YATO易尔拓",
            toolname: "工具 10006",
            toolnum: "21",
            upsettime: "2020-04-15 16:24:31"
          },
          {
            purchasername: "JETECH捷科",
            toolname: "工具 10005",
            toolnum: "16",
            upsettime: "2020-03-17 13:25:31"
          },
          {
            purchasername: "长城精工",
            toolname: "工具 10004",
            toolnum: "17",
            upsettime: "2020-03-16 16:27:31"
          }
        ];
      }
      if (this.pagenum == 2) {
        this.purchaserlist = [
          {
            purchasername: "Sheffield钢盾",
            toolname: "工具 10003",
            toolnum: "18",
            upsettime: "2020-03-18 18:25:31"
          },
          {
            purchasername: "Pro'skit宝工",
            toolname: "工具 10002",
            toolnum: "21",
            upsettime: "2020-05-13 16:58:31"
          },
          {
            purchasername: "TAJIMA田岛",
            toolname: "工具 10001",
            toolnum: "5",
            upsettime: "2020-05-09 14:48:31"
          }
        ];
      }
      this.total = 8;
      this.$message.success("获取采购商列表成功");
    },
    judgeType(warehouse) {
      if (warehouse == "校外仓库") return "success";
      if (warehouse == "校内仓库") return "primary";
      else return "info";
    },
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.getPurchaserList();
    },
    cancelPurchaser() {
      this.dialogVisible = false;
      this.$refs.PurchaserFormRef.resetFields();
    },
  }
};
</script>

<style scoped>
.el-breadcrumb {
  margin-bottom: 15px;
}
.Purchaser-card {
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.15);
  margin: 0 auto;
}
.el-pagination {
  margin-top: 15px;
}
.el-alert {
  margin-bottom: 15px;
}
.purchaserlist-expand {
  font-size: 0;
}
.purchaserlist-expand .el-form-item {
  margin-right: 0;
  margin-bottom: 0;
  width: 100%;
}
</style>
<style>
/* <style>与<style scoped>的区别是前者会影响所有页面的样式，后者scoped属性会限制 */
/* 该组件的style的作用域，无法作用于其他element组件。通常情况，使用<style scoped> */
.purchaserlist-expand label {
  width: 120px;
  font-weight: bold;
  color: #99a9bf;
}
</style>



<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item>餐厅管理系统</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card class="box-card" shadow="hover">
      <el-alert title="目前仅 admin 拥有用户管理权限" type="warning" center show-icon></el-alert>
      <div style="margin-top: 12px;">
        <el-button type="primary" style="width: 100%;" @click="dialogVisible = true">新增用户账户</el-button>
      </div>
      <el-dialog
        title="新增用户账户"
        :visible.sync="dialogVisible"
        width="50vw"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="addStaffFormRef"
          :model="addStaffForm"
          :rules="addStaffFormRules"
          label-width="10vw"
          style="padding-right:2vw;"
        >
          <el-form-item label="用户ID" prop="userid">
            <el-input
              v-model="addStaffForm.userid"
              prefix-icon="el-icon-key"
              placeholder="请输入用户ID"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户账户" prop="account">
            <el-input
              v-model="addStaffForm.account"
              prefix-icon="el-icon-user"
              placeholder="请输入用户账户名"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户密码" prop="password">
            <el-input
              v-model="addStaffForm.password"
              prefix-icon="el-icon-lock"
              placeholder="请输入用户密码"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户昵称" prop="nickname">
            <el-input
              v-model="addStaffForm.nickname"
              prefix-icon="el-icon-user"
              placeholder="请输入用户昵称"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户性别" prop="sex">
            <el-input
              v-model="addStaffForm.sex"
              prefix-icon="el-icon-male"
              placeholder="请输入用户性别"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户电话" prop="phone">
            <el-input
              v-model="addStaffForm.phone"
              prefix-icon="el-icon-phone"
              placeholder="请输入用户电话"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="用户地址" prop="address">
            <el-input
              v-model="addStaffForm.address"
              prefix-icon="el-icon-location"
              placeholder="请输入用户住址"
              clearable
            ></el-input>
          </el-form-item>
        </el-form>
        <span slot="footer">
          <div>
            <el-button @click="cancelAddStaff">取消</el-button>
            <el-button type="success" @click="completeAddStaff" :loading="modifyLoading">完成</el-button>
          </div>
        </span>
      </el-dialog>
      <div class="staff-card" v-loading="staffLoading">
        <el-table stripe :data="currentStaffinfo">
          <el-table-column prop="account" label="用户账户名" align="center"></el-table-column>
          <el-table-column prop="userid" label="用户ID" align="center"></el-table-column>
          <el-table-column prop="sex" label="用户性别" align="center"></el-table-column>
          <el-table-column prop="nickname" label="用户昵称" align="center"></el-table-column>
          <el-table-column prop="phone" label="用户电话" align="center"></el-table-column>
          <el-table-column prop="address" label="用户住址" align="center"></el-table-column>
          <el-table-column prop="state" label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                size="medium"
                type="primary"
                @click="modifyPassword(scope.row.account)"
                :loading="modifyLoading"
              >修改密码</el-button>
              <el-button
                size="medium"
                type="danger"
                :loading="modifyLoading"
                @click="deleteAccount(scope.row.account)"
              >删除账户</el-button>
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
.staff-card {
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
      totalStaffinfo: [],
      currentStaffinfo: [],
      totalPage: 0,
      staffLoading: true,
      modifyLoading: false,
      dialogVisible: false,
      addStaffForm: {
        account: "",
        password: "",
        userid: "",
        nickname: "",
        sex: "",
        phone: "",
        address: "",
        token: ""
      },
      addStaffFormRules: {
        account: [
          {
            required: true,
            message: "请输入用户账户名",
            trigger: "blur",
          },
          {
            min: 3,
            max: 20,
            message: "长度为 3 到 20 个字符",
            trigger: "blur",
          },
        ],
        password: [
          {
            required: true,
            message: "请输入用户密码",
            trigger: "blur",
          },
          {
            min: 5,
            max: 20,
            message: "长度为 5 到 20 个字符",
            trigger: "blur",
          },
        ],
      },
    };
  },
  created() {
    this.$axios
      .get("https://cdn.guoshaocong.cn/getuser")
      .then((response) => {
        this.totalStaffinfo = response.data.result;
        this.totalPage = this.totalStaffinfo.length;
        this.currentStaffinfo = this.totalStaffinfo.slice(
          (this.pagenum - 1) * 5,
          this.pagenum * 5
        );
        this.staffLoading = false;
        console.log(this.totalStaffinfo);
      })
      .catch(function (error) {
        console.log(error);
      });
  },
  beforeDestroy() {},
  methods: {
    handleCurrentChange(newPage) {
      this.pagenum = newPage;
      this.currentStaffinfo = this.totalStaffinfo.slice(
        (newPage - 1) * 5,
        newPage * 5
      );
    },
    modifyPassword(account) {
      this.modifyLoading = true;
      if (account == "admin") {
        setTimeout(() => {
          this.modifyLoading = false;
        }, 500);
        return this.$message.error("禁止修改 admin 账户");
      }
      this.$prompt("请输入 " + account + " 账户的新密码", "敏感操作", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        inputPattern: /^[a-zA-Z0-9-*/+.~!@#$%^&*()]{5,20}$/,
        inputErrorMessage: "请输入5至20位密码，仅限数字、字母与符号",
        inputPlaceholder: "请输入5至20位密码，仅限数字、字母与符号",
        inputType: "password",
      })
        .then(({ value }) => {
          this.$axios
            .post("https://cdn.guoshaocong.cn/modifyuser", {
              token: window.sessionStorage.getItem("token"),
              account: account,
              password: this.$sha224(value),
            })
            .then((response) => {
              if (response.data.state == 200) {
                this.$message.success("修改成功");
                this.modifyLoading = false;
              } else if (response.data.state == 400) {
                this.$message.error("无修改权限");
                this.modifyLoading = false;
              } else {
                this.modifyLoading = false;
                this.$message.error("修改失败，请重试");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(() => {
          this.modifyLoading = false;
        });
    },
    deleteAccount(account) {
      this.modifyLoading = true;
      if (account == "admin") {
        setTimeout(() => {
          this.modifyLoading = false;
        }, 500);
        return this.$message.error("禁止删除 admin 账户");
      }
      this.$confirm(
        "此操作将永久删除 " + account + " 账户, 是否继续？",
        "敏感操作",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "error",
        }
      )
        .then(() => {
          this.$axios
            .post("https://cdn.guoshaocong.cn/deleteuser", {
              token: window.sessionStorage.getItem("token"),
              account: account,
            })
            .then((response) => {
              if (response.data.state == 200) {
                this.$message.success("删除成功");
                this.modifyLoading = false;
                this.modifyAccountLocal(account);
              } else if (response.data.state == 400) {
                this.$message.error("无删除权限");
                this.modifyLoading = false;
              } else {
                this.modifyLoading = false;
                this.$message.error("删除失败，请重试");
              }
            })
            .catch(function (error) {
              console.log(error);
            });
        })
        .catch(() => {
          this.modifyLoading = false;
        });
    },
    modifyAccountLocal(account) {
      for (let index = 0; index < this.totalStaffinfo.length; index++) {
        if (this.totalStaffinfo[index].account == account) {
          this.totalStaffinfo.splice(index, 1);
          break;
        }
      }
      this.handleCurrentChange(this.pagenum);
    },
    cancelAddStaff() {
      this.dialogVisible = false;
      this.$refs.addStaffFormRef.resetFields();
    },
    completeAddStaff() {
      this.modifyLoading = true;
      this.$refs.addStaffFormRef.validate(async (valid) => {
        if (!valid) {
          this.modifyLoading = false;
          return false;
        }
        this.$axios
          .post("https://cdn.guoshaocong.cn/adduser", {
            token: window.sessionStorage.getItem("token"),
            account: this.addStaffForm.account,
            password: this.$sha224(this.addStaffForm.password),
            userid: this.addStaffForm.userid, 
            sex: this.addStaffForm.sex,
            phone: this.addStaffForm.phone,
            address: this.addStaffForm.address,
            nickname: this.addStaffForm.nickname,
          })
          .then((response) => {
            if (response.data.state == 200) {
              this.$message.success("成功新增用户账户");
              this.totalStaffinfo.unshift({
                account: this.addStaffForm.account,
              });
              this.handleCurrentChange(this.pagenum);
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addStaffFormRef.resetFields();
            } else if (response.data.state == 400) {
              this.$message.error("无操作权限");
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addStaffFormRef.resetFields();
            } else {
              this.dialogVisible = false;
              this.modifyLoading = false;
              this.$refs.addStaffFormRef.resetFields();
              this.$message.error("操作失败，请重试");
            }
          })
          .catch(function (error) {
            console.log(error);
            this.modifyLoading = false;
          });
      });
    },
  },
};
</script>

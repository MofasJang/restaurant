<template>
  <div class="home-container" :style="{height:carouselHeight+'px'}">
    <el-container style="height: 100%">
      <el-header>
        <div class="header-box">
          <img height="35px" width="35px" src="../assets/color.png" alt />
          <span class="title-box">餐厅管理系统</span>
        </div>
        <div class="avatar-box">
          <el-popover placement="bottom-end" width="150" close-delay="500" trigger="hover">
            <el-avatar slot="reference" shape="square" size="large" :src="avatarpic" @error="true">
              <img src="../assets/errorimg.png" />
            </el-avatar>
            <p style="text-align:center; margin: 10px">
              感谢您选择
              <br />餐厅管理系统 !
            </p>
            <div style="text-align: center; margin: 5px">
              <el-button type="primary" size="medium" @click="changeAvatarVisible = true">更换头像</el-button>
            </div>
            <div style="text-align: center; margin: 5px">
              <el-button type="danger" size="medium" @click="logout">安全登出</el-button>
            </div>
          </el-popover>
        </div>
      </el-header>
      <el-dialog
        title="更换头像"
        :visible.sync="changeAvatarVisible"
        width="50vw"
        :show-close="false"
        :close-on-click-modal="false"
        :close-on-press-escape="false"
      >
        <el-form
          ref="changeAvatarFormRef"
          :model="changeAvatarForm"
          :rules="changeAvatarFormRules"
          label-width="10vw"
          style="padding-right:2vw;"
        >
          <el-form-item label="选择头像" prop="avatar">
            <el-select
              v-model="changeAvatarForm.avatar"
              @change="chooseavatar(changeAvatarForm.avatar)"
              placeholder="请选择您想要更换的头像"
            >
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
        <i style="padding-left:10vw"></i>
        <el-avatar shape="square" :size="100" fit="fill" :src="avatarchosen"></el-avatar>
        <span slot="footer">
          <div>
            <el-button @click="cancelModifyAvatar">取消</el-button>
            <el-button type="success" @click="completeModifyAvatar" :loading="modifyAvatar">完成</el-button>
          </div>
        </span>
      </el-dialog>
      <el-container>
        <el-aside
          @mouseenter.native="enterAside()"
          @mouseleave.native="leaveAside()"
          :width="isCollapse ? '65px' : '200px' "
        >
          <div
            :style="isCollapse ? 'visibility:' : 'visibility:hidden' "
            class="toggle-button"
          >{{collapsetext}}</div>
          <!-- 侧边栏菜单区域 -->
          <el-menu
            background-color="whitesmoke"
            unique-opened
            :collapse="isCollapse"
            :collapse-transition="false"
            router
            :default-active="activePath"
          >
            <el-menu-item index="Welcome" @click="saveNavState('Welcome')">
              <i class="el-icon-house"></i>
              <span slot="title">主页</span>
            </el-menu-item>
            <el-submenu index="Reception">
              <template slot="title">
                <i class="el-icon-monitor"></i>
                <span>前台管理</span>
              </template>
              <el-menu-item index="TableManagement" @click="saveNavState('TableManagement')">开台管理</el-menu-item>
              <el-menu-item index="Payment" @click="saveNavState('Payment')">客人买单</el-menu-item>
              <el-menu-item index="DataAnalysis" @click="saveNavState('DataAnalysis')">结账数据分析</el-menu-item>
            </el-submenu>
            <el-submenu index="BasicInfo">
              <template slot="title">
                <i class="el-icon-files"></i>
                <span>基础信息管理</span>
              </template>
              <el-menu-item index="Menu" @click="saveNavState('Menu')">菜谱管理</el-menu-item>
              <el-menu-item index="TableNumber" @click="saveNavState('TableNumber')">餐桌号管理</el-menu-item>
              <el-menu-item index="AddDish" @click="saveNavState('AddDish')">添加菜品</el-menu-item>
            </el-submenu>
            <el-submenu index="Service">
              <template slot="title">
                <i class="el-icon-coffee-cup"></i>
                <span>服务管理</span>
              </template>
              <el-menu-item index="Order" @click="saveNavState('Order')">点菜</el-menu-item>
              <el-menu-item index="Bill" @click="saveNavState('Bill')">开单</el-menu-item>
              <el-menu-item index="Sign" @click="saveNavState('Sign')">签单</el-menu-item>
              
           
            </el-submenu>
            <el-submenu index="People" >
              <template slot="title">
                <i class="el-icon-user"></i>
                <span >人员管理</span>
              </template>

              <el-menu-item index="Staff" @click="saveNavState('Staff')">员工管理</el-menu-item>
              <el-menu-item index="User" @click="saveNavState('User')">用户管理</el-menu-item>
            </el-submenu>

            <el-divider></el-divider>
            
          </el-menu>
        </el-aside>
        <el-main v-loading.lock="componentLoading">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isCollapse: true,
      activePath: "Welcome",
      collapsetext: ">>>",
      changeAvatarForm: {
        avatar: "0"
      },
      avatarpic: require("../assets/avatar/0.png"),
      avatarchosen: require("../assets/avatar/0.png"),
      componentLoading: false,
      changeAvatarVisible: false,
      modifyAvatar: false,
      carouselHeight: "",
      options: [
        {
          value: "0",
          label: "默认头像"
        },
        {
          value: "1",
          label: "牵牛花"
        },
        {
          value: "2",
          label: "薰衣草"
        },
        {
          value: "3",
          label: "向日葵"
        },
        {
          value: "4",
          label: "秋海棠"
        },
        {
          value: "5",
          label: "碧螺春"
        },
        {
          value: "6",
          label: "淡蔷薇"
        }
      ],
      changeAvatarFormRules: {
        avatar: [
          {
            required: true,
            message: "请选择头像",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.carouselHeight = window.innerHeight;
    if (window.sessionStorage.getItem("token") == null) {
      this.$message.error("权限错误，请重新登录");
      return this.$router.push("/Login");
    }
    if (window.sessionStorage.getItem("avatar") != null) {
      this.avatarpic = require("../assets/avatar/" +
        window.sessionStorage.getItem("avatar") +
        ".png");
      this.changeAvatarForm.avatar = window.sessionStorage.getItem("avatar");
    }
    this.avatarchosen = this.avatarpic;
    this.activePath = window.sessionStorage.getItem("activePath");
    const loading = this.$loading({
      lock: true
    });
    setTimeout(() => {
      loading.close();
    }, 500);
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$message.success("安全登出成功");
      this.$router.push("/");
    },
    enterAside() {
      this.isCollapse = false;
    },
    leaveAside() {
      this.isCollapse = true;
    },
    saveNavState(activePath) {
      this.componentLoading = true;
      window.sessionStorage.setItem("activePath", activePath);
      this.activePath = activePath;
      setTimeout(() => {
        this.componentLoading = false;
      }, 500);
    },
    cancelModifyAvatar() {
      this.changeAvatarVisible = false;
    },
    completeModifyAvatar() {
      this.changeAvatarVisible = false;
      this.modifyAvatar = true;
      this.$refs.changeAvatarFormRef.validate(async valid => {
        if (!valid) return false;
        this.$axios
          .post("https://cdn.guoshaocong.cn/avatar", {
            token: window.sessionStorage.getItem("token"),
            avatar: this.changeAvatarForm.avatar
          })
          .then(response => {
            if (response.data.state == 200) {
              this.$message.success("修改成功");
              this.avatarpic = this.avatarchosen;
              window.sessionStorage.setItem(
                "avatar",
                this.changeAvatarForm.avatar
              );
              this.modifyAvatar = false;
            } else if (response.data.state == 401) {
              this.$message.error("Token失效，请重新登陆");
              this.modifyAvatar = false;
            } else {
              this.$message.error("操作失败，请重试");
              this.modifyAvatar = false;
            }
          })
          .catch(function(error) {
            console.log(error);
          });
      });
    },
    chooseavatar(avatar) {
      this.avatarchosen = require("../assets/avatar/" + avatar + ".png");
    }
  }
};
</script>

<style scoped>
.home-container {
  height: 100%;
}
.el-header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: black;
  font-size: 20px;
}
.header-box {
  display: flex;
  align-items: center;
}
.el-aside {
  background-color: whitesmoke;
}
.el-main {
  background-color: #eee;
  color: #333;
  text-align: center;
  line-height: 40px;
}
.title-box {
  margin-left: 12px;
}
.toggle-button {
  background-color: #ccc;
  font-size: 10px;
  line-height: 24px;
  color: white;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;
}
.avatar-box {
  padding-top: 5px;
  padding-right: 10px;
}
</style>
<style>
.el-avatar {
  background-color: transparent;
  border-style: outset;
  border-color: #f5f5f5;
  border-width: 1px;
  border-radius: 10px;
}
</style>


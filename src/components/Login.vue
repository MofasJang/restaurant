<template>
  <div class="login_container" style="height: 100vh">
    <el-header>
      <div class="header_box">
        <img width="40px" height="40px" src="../assets/color.png" />
        <span class="title_box">餐厅管理系统</span>
      </div>
      <el-button type="primary" @click="goToMainPage">首页</el-button>
    </el-header>
    <div>
      <div class="login_box">
        <div class="avatar_box">
          <div class="sign_box">
            <img
              height="70px"
              width="70px"
              border-radius="50%"
              background-color="#eee"
              src="../assets/color.png"
              alt
            />
          </div>
        </div>
        <h1 class="word_box">登录</h1>
        <el-form
          ref="loginFormRef"
          :model="loginForm"
          :rules="loginFormRules"
          label-width="100px"
          class="login_form"
        >
          <el-form-item label="帐户名" prop="username">
            <el-input
              style="width:100%"
              v-model="loginForm.username"
              prefix-icon="el-icon-user"
              placeholder="请输入帐户名 ( 默认为: admin )"
              @keyup.enter.native="enterEvent()"
              clearable
            ></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input
              style="width:100%"
              v-model="loginForm.password"
              prefix-icon="el-icon-lock"
              placeholder="请输入密码 ( 默认为: admin )"
              show-password
              clearable
            ></el-input>
          </el-form-item>
          <div class="captcha_word">
            <i style="padding-left:100px;"></i>
            <el-link
              :underline="false"
              type="info"
              href="https://cloud.tencent.com/product/captcha"
              target="_blank"
            >安全验证服务由 腾讯云 提供技术支持</el-link>
          </div>
          <el-form-item class="btns">
            <el-button type="primary" @click="login" :loading="loginloading">安全登录</el-button>
            <el-button type="info" @click="resetLoginForm">重置</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      nodification: null,
      loginloading: false,
      loginForm: {
        username: "",
        password: ""
      },
      loginFormRules: {
        username: [
          {
            required: true,
            message: "请输入帐户名",
            trigger: "blur"
          }
        ],
        password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur"
          },
          {
            min: 5,
            max: 20,
            message: "密码长度应为 5 至 20 位 ",
            trigger: "blur"
          }
        ]
      }
    };
  },
  created() {
    this.nodification = this.$notify.info({
      title: "快速登录",
      message: "您可在输入框连续输入回车以自动填充帐户密码并登录",
      offset: 50,
      duration: 0
    });
  },
  destroyed() {
    this.nodification.close();
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields();
    },
    goToMainPage() {
      return this.$router.push("/MainPage");
    },
    login() {
      this.$refs.loginFormRef.validate(async valid => {
        if (!valid) return;
        this.loginloading = true;
        let appid = "2025155554";
        let captcha = new window.TencentCaptcha(appid, res => {
          if (res.ret === 0) {
            this.$axios
              .post("https://cdn.guoshaocong.cn/login", {
                account: this.loginForm.username,
                password: this.$sha224(this.loginForm.password)
              })
              .then(response => {
                if (response.data.state == 200) {
                  this.$message.success("登录成功");
                  window.sessionStorage.setItem("token", response.data.token);
                  window.sessionStorage.setItem("avatar", response.data.avatar);
                  this.loginloading = false;
                  return this.$router.push({ path: "/Home" });
                } else if (response.data.state == 301) {
                  this.loginloading = false;
                  return this.$message.error("帐号密码不匹配，请检查后重试");
                } else {
                  this.loginloading = false;
                  return this.$message.error("登录失败，请重试");
                }
              })
              .catch(function(error) {
                console.log(error);
              });
          } else {
            this.loginloading = false;
            return this.$message.error("安全验证失败，请重试");
          }
        });
        captcha.show();
      });
    },
    enterEvent() {
      if (this.loginForm.username == "" || this.loginForm.password == "") {
        this.loginForm.username = "admin";
        this.loginForm.password = "admin";
      } else {
        this.login();
      }
    }
  }
};
</script>

<style scoped>
.login_container {
  background: -webkit-linear-gradient(
    180deg,
    #191970,
    #078f99
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #191970, #078f99); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #191970, #078f99); /* IE10 */
  background: -o-linear-gradient(180deg, #191970, #078f99); /* Opera 11.10+ */
  background: linear-gradient(180deg, #191970, #078f99); /* W3C */
}
.login_box {
  width: 650px;
  max-width: 60vw;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.avatar_box {
  height: 100px;
  width: 100px;
  border: 1px solid #eee;
  border-radius: 50%;
  padding: 10px;
  box-shadow: 0 0 10px #ddd;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
  background-color: #fcfcfc;
}
.sign_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
}
.login_form {
  position: relative;
  margin-left: 35px;
  margin-right: 35px;
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.header_box {
  display: flex;
  align-items: center;
}
.title_box {
  margin-left: 12px;
}
.el-header {
  background-color: white;
  display: flex;
  justify-content: space-between;
  padding-left: 20px;
  align-items: center;
  color: black;
  font-size: 20px;
  filter: alpha(Opacity=95);
  -moz-opacity: 0.95;
  opacity: 0.95;
}
.word_box {
  text-align: center;
  line-height: 30px;
  margin-top: 85px;
  margin-bottom: 25px;
}
.captcha_word {
  margin-bottom: 22px;
}
</style>
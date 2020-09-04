<template>
  <el-carousel
    arrow="never"
    direction="vertical"
    indicator-position="none"
    :interval="5000"
    height="100vh"
  >
    <div class="main_container">
      <el-carousel-item v-for="item in 4" :key="item" style="width:100%;"></el-carousel-item>
      <el-header>
        <div class="header_box">
          <img width="40px" height="40px" src="../assets/color.png" />
          <span class="title_box">餐厅管理系统</span>
        </div>
        <div class="login_box">
          <el-button plain @click="OpenDoc">后端 API</el-button>
          <el-button type="primary" @click="Login">登录</el-button>
        </div>
      </el-header>
      <div>
        <div class="maininfo_box">
          <h1 class="maininfo_title_box">
            <img class="img_box" width="60px" height="60px" src="../assets/color.png" />餐厅管理系统
          </h1>
          <div class="word_box">
            <h3>高效 · 快捷 · 智能</h3>
            <span>右上角的登录是智能化体验的起点</span>
          </div>
        </div>
      </div>
    </div>
  </el-carousel>
</template>

<script>
export default {
  data() {
    return {};
  },
  created() {
    const loading = this.$loading({
      lock: true
    });
    setTimeout(() => {
      loading.close();
    }, 500);
  },
  methods: {
    Login() {
      window.sessionStorage.clear();
      this.$router.push("/Login");
    },
    OpenDoc() {
      window.open("https://www.yuque.com/docs/share/f596a980-3e42-44aa-ab23-bbde9420665e","_blank");
    },
    goToMainPage() {
      window.sessionStorage.clear();
      this.$router.push("/MainPage");
    },
    detectBlock() {
      var e = document.createElement("div");
      e.className = "adsbox";
      document.body.appendChild(e);
      var t = "none" === getComputedStyle(e).display;
      document.body.removeChild(e);
      return t;
    }
  }
};
</script>

<style scoped>
.main_container {
  height: 100%;
  overflow: hidden;
}
.maininfo_box {
  width: 650px;
  max-width: 60vw;
  background-color: #ffffff;
  border-radius: 5px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  filter: alpha(Opacity=95);
  -moz-opacity: 0.95;
  opacity: 0.95;
}
.maininfo_title_box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}
.word_box {
  text-align: center;
  line-height: 35px;
  margin-bottom: 40px;
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
.login_box {
  float: right;
}
.header_box {
  display: flex;
  align-items: center;
}
.title_box {
  margin-left: 12px;
}
.img_box {
  margin-right: 18px;
}
.el-carousel__item:nth-child(1) {
  background: -webkit-linear-gradient(
    180deg,
    #078f99,
    #0484da
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #078f99, #0484da); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #078f99, #0484da); /* IE10 */
  background: -o-linear-gradient(180deg, #078f99, #0484da); /* Opera 11.10+ */
  background: linear-gradient(180deg, #078f99, #0484da); /* W3C */
  z-index: -1;
}
.el-carousel__item:nth-child(2) {
  background: -webkit-linear-gradient(
    180deg,
    #0484da,
    #003366
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #0484da, #003366); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #0484da, #003366); /* IE10 */
  background: -o-linear-gradient(180deg, #0484da, #003366); /* Opera 11.10+ */
  background: linear-gradient(180deg, #0484da, #003366); /* W3C */
  z-index: -1;
}
.el-carousel__item:nth-child(3) {
  background: -webkit-linear-gradient(
    180deg,
    #003366,
    #191970
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #003366, #191970); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #003366, #191970); /* IE10 */
  background: -o-linear-gradient(180deg, #003366, #191970); /* Opera 11.10+ */
  background: linear-gradient(180deg, #003366, #191970); /* W3C */
  z-index: -1;
}
.el-carousel__item:nth-child(4) {
  background: -webkit-linear-gradient(
    180deg,
    #191970,
    #078f99
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #191970, #078f99); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #191970, #078f99); /* IE10 */
  background: -o-linear-gradient(180deg, #191970, #078f99); /* Opera 11.10+ */
  background: linear-gradient(180deg, #191970, #078f99); /* W3C */
  z-index: -1;
}
</style>
<style>
.adsbox {
  background-color: transparent;
  height: 1px;
  width: 1px;
}
</style>

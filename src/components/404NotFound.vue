<template>
  <div class="login_container" :style="{height:carouselHeight+'px'}">
    <el-header>
      <div class="header_box">
        <img width="40px" height="40px" src="../assets/color.png" />
        <span class="title_box">餐厅管理系统</span>
      </div>
      <el-button type="primary" @click="goToMainPage">首页</el-button>
    </el-header>
    <div>
      <div class="maininfo_box">
        <h1 class="maininfo_title_box">
          <img class="img_box" width="60px" height="60px" src="../assets/color.png" />404 NOT FOUND
        </h1>
        <div class="word_box">
          <p>
            很抱歉，您访问的页面不存在。
            <br />这可能是因为您输入了一个错误的网址。
            <br />如果您有任何问题，请与网站管理员联系。
          </p>
        </div>
        <div class="btns">
          <el-button type="plain" @click="goBack">返回上一页</el-button>
          <el-button type="primary" @click="goToMainPage">首页</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return { carouselHeight: "" };
  },
  created() {
    this.carouselHeight = window.innerHeight;
  },
  methods: {
    goToMainPage() {
      return this.$router.push("/MainPage");
    },
    goBack() {
      const loading = this.$loading({
        lock: true
      });
      this.$router.back(-1);
      setTimeout(() => {
        loading.close();
      }, 500);
    }
  }
};
</script>

<style scoped>
.login_container {
  background: -webkit-linear-gradient(
    180deg,
    #ff6262,
    #ff7b23
  ); /* Chrome 10+, Saf5.1+ */
  background: -moz-linear-gradient(180deg, #ff6262, #ff7b23); /* FF3.6+ */
  background: -ms-linear-gradient(180deg, #ff6262, #ff7b23); /* IE10 */
  background: -o-linear-gradient(180deg, #ff6262, #ff7b23); /* Opera 11.10+ */
  background: linear-gradient(180deg, #ff6262, #ff7b23); /* W3C */
  z-index: -1;
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
.btns {
  display: flex;
  margin-top: 20px;
  padding-right: 35px;
  justify-content: flex-end;
  margin-bottom: 40px;
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
.maininfo_title_box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 40px;
}
.img_box {
  margin-right: 18px;
}
.word_box {
  text-align: center;
  line-height: 30px;
}
</style>
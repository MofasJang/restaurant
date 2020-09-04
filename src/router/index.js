import Vue from 'vue'
import VueRouter from 'vue-router'
import MainPage from '../components/MainPage.vue'
import Home from '../components/Home.vue'
import Login from '../components/Login.vue'
import NotFound from '../components/404NotFound.vue'
import Welcome from '../components/Welcome.vue'


import OpenTable from '../components/OpenTable.vue'
import Payment from '../components/Payment.vue'
import DataAnalysis from '../components/DataAnalysis.vue'


import Recipe from '../components/RecipeManagement.vue'
import TableNumber from '../components/TableNumber.vue'


import Order from '../components/Order.vue'
import Bill from '../components/Bill.vue'
import Sign from '../components/Sign.vue'

import Staff from '../components/Staff.vue'
import User from '../components/User.vue'

Vue.use(VueRouter)

const routes = [
  { path: '/', redirect: '/MainPage', meta: { title: "首页 - 餐厅管理系统" } },
  { path: '/MainPage', component: MainPage, meta: { title: "首页 - 餐厅管理系统" } },
  { path: '/Login', component: Login, meta: { title: "登录 - 餐厅管理系统" } },
  {
    path: '/Home',
    component: Home,
    redirect: '/Home/Welcome',
    meta: { title: "主页 - 餐厅管理系统" },
    children: [
      { path: '/Home/Welcome', component: Welcome, meta: { title: "主页 - 餐厅管理系统" } },

      { path: '/Home/TableManagement', component: OpenTable, meta: { title: "开台管理 - 餐厅管理系统" } },
      { path: '/Home/Payment', component: Payment, meta: { title: "客人买单 - 餐厅管理系统" } },
      { path: '/Home/DataAnalysis', component: DataAnalysis, meta: { title: "结账数据分析 - 餐厅管理系统" } },
      
      { path: '/Home/Menu', component: Recipe, meta: { title: "菜谱管理 - 餐厅管理系统" } },
      { path: '/Home/TableNumber', component: TableNumber, meta: { title: "餐桌号管理 - 餐厅管理系统" }},

      { path: '/Home/Order', component: Order, meta: { title: "点菜 - 餐厅管理系统" } },
      { path: '/Home/Bill', component: Bill, meta: { title: "开单 - 餐厅管理系统" } },
      { path: '/Home/Sign', component: Sign, meta: { title: "签单 - 餐厅管理系统" } },



      { path: '/Home/Staff', component: Staff, meta: { title: "员工管理 - 餐厅管理系统" } },
      { path: '/Home/User', component: User, meta: { title: "用户管理 - 餐厅管理系统" } }
    ]
  },
  { path: '*', component: NotFound, meta: { title: "404 NOT FOUND" } }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  if (to.meta.title) {
    document.title = to.meta.title
  }
  next()
})

export default router

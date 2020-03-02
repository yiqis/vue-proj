import Vue from 'vue'
import VueRouter from 'vue-router'
// import Login from ''
const Login = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Login.vue')
// import Home from '../components/Home.vue'
const Home = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Home.vue')
// import Welcome from '../components/Welcome.vue'
const Welcome = () => import(/* webpackChunkName:"login_home_welcome" */ '../components/Welcome.vue')
// import Users from '../components/user/Users.vue'
const Users = () => import(/* webpackChunkName:"users_rights_roles" */ '../components/user/Users.vue')
// import Rights from '../components/power/Rights.vue'
const Rights = () => import(/* webpackChunkName:"users_rights_roles" */ '../components/power/Rights.vue')
// import Roles from '../components/power/Roles.vue'
const Roles = () => import(/* webpackChunkName:"users_rights_roles" */ '../components/power/Roles.vue')
// import Cate from '../components/goods/Cate.vue'
const Cate = () => import(/* webpackChunkName:"cate" */ '../components/goods/Cate.vue')
// import goodsParams from '../components/goods/Params.vue'
const goodsParams = () => import(/* webpackChunkName:"goods" */ '../components/goods/Params.vue')
// import goodsList from '../components/goods/List.vue'
const goodsList = () => import(/* webpackChunkName:"goods" */ '../components/goods/List.vue')
// import goodsAdd from '../components/goods/Add.vue'
const goodsAdd = () => import(/* webpackChunkName:"goods" */ '../components/goods/Add.vue')
// import Order from '../components/order/Order.vue'
const Order = () => import(/* webpackChunkName:"goods" */ '../components/order/Order.vue')
// import Report from '../components/report/Report.vue'
const Report = () => import(/* webpackChunkName:"goods" */ '../components/report/Report.vue')

Vue.use(VueRouter)

const routes = [{
  path: '/',
  redirect: '/login'
}, {
  path: '/login',
  component: Login
}, {
  path: '/home',
  component: Home,
  children: [{
    path: '/home',
    redirect: '/welcome'
  }, {
    path: '/welcome',
    component: Welcome
  }, {
    path: '/users',
    component: Users
  }, {
    path: '/rights',
    component: Rights
  }, {
    path: '/roles',
    component: Roles
  }, {
    path: '/categories',
    component: Cate
  }, {
    path: '/params',
    component: goodsParams
  }, {
    path: '/goods',
    component: goodsList
  }, {
    path: '/goods/add',
    component: goodsAdd
  }, {
    path: '/orders',
    component: Order
  }, {
    path: '/reports',
    component: Report
  }]
}
]

const router = new VueRouter({
  routes
})
// 挂载路由导航守卫
router.beforeEach((to, from, next) => {
  // to代表将要访问的路径
  // from代表从哪个路径跳转而来
  // next表示一个函数,放行
  // next()放行  next('/login)强制跳转
  if (to.path === '/login') return next()
  // 获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router

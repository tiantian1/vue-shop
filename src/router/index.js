import Vue from 'vue'
import VueRouter from 'vue-router'
const Login = () => import('../views/Login')
const Home = () => import('../views/Home')

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home
  }
]

const router = new VueRouter({
  routes
})

router.beforeEach((to, from, next) => {
  //如果用户访问登录页
  if (to.path == '/login') return next();
  //用户访问其他页面
  const token = window.sessionStorage.getItem("token");
  if (!token) return next('/login');
  next();



})
export default router

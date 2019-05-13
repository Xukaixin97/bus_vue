// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
// import './assets/iconfont.css'
import './assets/animate.css'
import store from './store/store.js';


Vue.use(ElementUI);
//组织启动生产消息
Vue.config.productionTip = false

router.beforeEach((to, from, next) => {
  console.log("判断");
  if (to.matched.some(record => record.meta.requireAuth)){  // 判断该路由是否需要登录权限
    if (localStorage.token) {  // 判断当前的token是否存在 ； 登录存入的token
      console.log("需要登陆");
      next();
    }
    else {
      next({
        path: '/',
        query: {redirect: to.fullPath}  // 将跳转的路由path作为参数，登录成功后跳转到该路由
      })
    }
  }
  else {
    next();
  }
});
/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  render: c => c(App)

})



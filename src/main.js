// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App'; //根组件
import router from './router/index.js';
import lazyload from 'vue-lazyload';
import store from './store';
import global from 'common/js/requestConfig.js';
import promptBox from './common/js/promptBox.js'
import enlargeImg from './common/js/enlargeImg.js';

Vue.use(lazyload, {
  loading: './common/image/default.png'
})

Vue.directive('focus', {
  inserted: function (el) {
    el.focus();
  }
})

Vue.prototype.relogin = function () {
  this.$router.push({
    name: 'login'
  })
}
Vue.prototype.promptBox = promptBox;

Vue.prototype.GLOBAL = global;

Vue.config.productionTip = false;

// 定义一个‘信息vue’，在页面图片src返回成功后发射事件，来通知main.js收集图片
Vue.prototype.eventHub = new Vue();
Vue.prototype.eventHub.$on('imgsrcgot', () => {
  setTimeout(() => {
    // 清空查看器中的图片，再取图片
    document.getElementById('slider-group').innerHTML = '';
    Vue.prototype.allNeededGrowImg = enlargeImg.changeImgArr(enlargeImg.getAllneededImgs());
    // console.log(Vue.prototype.allNeededGrowImg);
    // 如果要处理的图片很多的话，500ms就不够了
  }, 500);
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})

import 'element-ui/lib/theme-chalk/index.css';
import Vue from 'vue';
import ElementUI from 'element-ui';
import App from './App.vue';
import './assets/style.css';

Vue.use(ElementUI, { size: 'small' });
new Vue({
  render: h => h(App),
}).$mount('#app');

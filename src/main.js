import Vue from 'vue';
import App from './App';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css'
import '@/assets/font-awesome/css/font-awesome.min.css'
import '../static/style.css';
Vue.use(ElementUI,{size:'small'});
new Vue({
    'render': h => h(App)
}).$mount('#app');

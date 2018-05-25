import Vue from 'vue'
import Router from 'vue-router'
import CasinoDapp from '@/components/casino-dapp'
import BootstrapVue from 'bootstrap-vue'
Vue.use(Router);
Vue.use(BootstrapVue);
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import 'font-awesome/css/font-awesome.css';
export default new Router({
  routes: [{
    path: '/',
    name: 'casino-dapp',
    component: CasinoDapp
  }]
})

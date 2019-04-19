import Vue from 'vue'
import App from './App.vue'
import router from './router'

import VueFlex from '@seregpie/vueflex';
import Utils from './plugins/utils';


Vue.use(VueFlex);
Vue.use(Utils);

Vue.config.productionTip = false;

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')

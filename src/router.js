import Vue from 'vue'
import Router from 'vue-router'

import Tracker from './views/Tracker.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'tracker',
      component: Tracker
    }
  ]
})

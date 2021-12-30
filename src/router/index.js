import { createRouter, createWebHashHistory } from 'vue-router';

import Main from '../components/Main.vue';
import Almanac from '../components/Almanac.vue';
import Campaigns from '../components/Campaigns.vue'

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      component: Main,
    },
    {
      path: '/almanac',
      component: Almanac,
    },
    {
      path: '/campaigns',
      component: Campaigns,
    },
  ],
});

export default router;

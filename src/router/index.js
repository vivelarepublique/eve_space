import { createRouter, createWebHashHistory } from 'vue-router';

import Main from '../home/Main.vue';
import Almanac from '../pages/Almanac.vue';
import Campaigns from '../pages/Campaigns.vue';
import Market from '../pages/Market.vue';
import StarMap from '../pages/StarMap.vue';

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
    {
      path: '/market',
      component: Market,
    },
    {
      path: '/starmap',
      component: StarMap,
    },
  ],
});

export default router;

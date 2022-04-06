import { createRouter, createWebHashHistory } from 'vue-router';

import Main from '../components/Main.vue';
import Almanac from '../pages/Almanac.vue';
import Campaigns from '../pages/Campaigns.vue';
import Market from '../pages/Market.vue';
import Map from '../pages/Map.vue';

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
      path: '/map',
      component: Map,
    },
  ],
});

export default router;

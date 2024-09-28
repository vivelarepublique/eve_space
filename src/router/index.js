import { createRouter, createWebHashHistory } from 'vue-router';

import Main from '../home/Main.vue';
import Almanac from '../pages/Almanac.vue';
import Campaigns from '../pages/Campaigns.vue';
import Market from '../pages/Market.vue';
import StarMap from '../pages/StarMap.vue';
import Mineral from '../pages/Mineral.vue';
import Ice from '../pages/Ice.vue';
import Moon from '../pages/Moon.vue';
import Planet from '../pages/Planet.vue';

export default createRouter({
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
        {
            path: '/mineral',
            component: Mineral,
        },
        {
            path: '/ice',
            component: Ice,
        },
        {
            path: '/moon',
            component: Moon,
        },
        {
            path: '/planet',
            component: Planet,
        },
    ],
});

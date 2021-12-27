import { createApp } from 'vue';
import App from './App.vue';

import router from './router';

// import './assets/css/bootstrap.css'

import { Plugin } from 'vue-responsive-video-background-player';

const app = createApp(App);
app.use(Plugin);
app.use(router);

app.mount('#app');

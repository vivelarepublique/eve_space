<template>
  <div>
    <router-link to="/main">
      <n-button type="primary">Main</n-button>
    </router-link>
    <router-link to="/almanac">
      <n-button type="primary">Almanac</n-button>
    </router-link>

    <router-view></router-view>
  </div>
</template>

<script>
import { defineComponent } from 'vue';
import { NButton } from 'naive-ui';

export default defineComponent({
  name: 'App',
  components: {
    NButton,
  },
});
</script>

<style module>
@import './assets/css/bootstrap.css';
</style>

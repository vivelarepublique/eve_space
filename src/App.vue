<template>
  <div>
    <router-link to="/">
      <n-button color="#00918a">主页</n-button>
    </router-link>
    <router-link to="/almanac">
      <n-button color="#00918a">老黄历</n-button>
    </router-link>
    <router-link to="/campaigns">
      <n-button color="#00918a">增强信息</n-button>
    </router-link>
    <router-link to="/Market">
      <n-button color="#00918a">市场</n-button>
    </router-link>
    <router-link to="/Map">
      <n-button color="#00918a">星图</n-button>
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

<style scoped>
button {
  margin: 15px;
}
</style>

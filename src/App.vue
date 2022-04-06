<template>
  <div>
    <router-link to="/">
      <n-button color="#EE5252">主页</n-button>
    </router-link>
    <router-link to="/almanac">
      <n-button color="#EEB300">老黄历</n-button>
    </router-link>
    <router-link to="/campaigns">
      <n-button color="#DDDD00">增强信息</n-button>
    </router-link>
    <router-link to="/Market">
      <n-button color="#52DDDD">市场</n-button>
    </router-link>
    <router-link to="/StarMap">
      <n-button color="#ADEEDD">星图</n-button>
    </router-link>

    <router-view></router-view>
    <img :src="require('./assets/image/page' + number + '.jpg')" id="bgimg" />
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { NButton } from "naive-ui";

export default defineComponent({
  name: "App",
  components: {
    NButton,
  },
  setup() {
    let number = 4;
    if (Math.floor(Math.random() * 10) <= 4) {
      number = 4;
    } else {
      number = 5;
    }
    return { number };
  },
});
</script>

<style scoped>
button {
  margin: 15px;
  color: black;
}
#bgimg {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: hidden;
  z-index: -1000;
}
</style>

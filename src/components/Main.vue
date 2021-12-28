<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2">晨曦服务器玩家在线数量: {{ playerCN }}</div>
      <div class="col-md-2">宁静服务器玩家在线数量: {{ playerG }}</div>
    </div>
  </div>

  <video-background :src="require(`@/assets/video/AmarrSpace.mp4`)" id="video_background" :playbackRate="1"> </video-background>
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
export default {
  name: 'Main',
  setup() {
    let playerCN = ref(0);
    let playerG = ref(0);
    onMounted(() => {
      checkServerinformation();
      setInterval(() => {
        checkServerinformation();
      }, 3e4);
    });

    function checkServerinformation() {
      axios
        .get('https://esi.evepc.163.com/dev/status/')
        .then((res) => (playerCN.value = res.data.players))
        .catch((error) => console.log(error));
      axios
        .get('https://esi.evetech.net/dev/status/')
        .then((res) => (playerG.value = res.data.players))
        .catch((error) => console.log(error));
    }
    return { playerCN, playerG };
  },
};
</script>

<style scoped>
@import '../assets/css/bootstrap.css';
#video_background {
  position: fixed;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: hidden;
  z-index: -1000;
  opacity: 0.8;
}
div {
  color: #fff;
}
</style>

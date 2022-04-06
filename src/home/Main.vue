<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-2">晨曦服务器玩家在线数量: {{ playerCN }}</div>
      <div class="col-md-2">宁静服务器玩家在线数量: {{ playerG }}</div>
    </div>
  </div>
  <video autoplay loop id="bgvid">
    <source src="../assets/video/Space.mp4" type="video/mp4" />
  </video>
</template>

<script>
import axios from "axios";
import { onMounted, ref } from "vue";
export default {
  name: "Main",
  setup() {
    let playerCN = ref(0);
    let playerG = ref(0);
    onMounted(async () => {
      let checkResult = await checkServerinformation();
      playerCN.value = checkResult.playerCN;
      playerG.value = checkResult.playerG;
      setInterval(async () => {
        let checkResult = await checkServerinformation();
        playerCN.value = checkResult.playerCN;
        playerG.value = checkResult.playerG;
      }, 3e4);
    });

    async function checkServerinformation() {
      let playerCN = 0;
      let playerG = 0;
      try {
        let response = await axios.get("https://esi.evepc.163.com/dev/status/");
        let data = await response.data;
        playerCN = data.players;
      } catch (error) {
        console.log(error);
      }
      try {
        let response = await axios.get("https://esi.evetech.net/dev/status/");
        let data = await response.data;
        playerG = data.players;
      } catch (error) {
        console.log(error);
      }
      return {
        playerCN,
        playerG,
      };
    }
    return { playerCN, playerG };
  },
};
</script>

<style scoped>
@import "../assets/css/bootstrap.css";
#bgvid {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: hidden;
  z-index: -1;
  opacity: 1;
}
div {
  color: #fff;
}
</style>

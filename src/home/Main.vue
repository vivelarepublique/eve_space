<template>
  <div class="container-fluid">
    <div class="row">
      <n-gradient-text class="col-md-3" type="success" size="24px"> 晨曦在线: {{ serenityOnline }} </n-gradient-text>
      <n-gradient-text class="col-md-3" type="error" size="24px"> 宁静在线: {{ tranquilityOnline }} </n-gradient-text>
    </div>
  </div>
  <h1 id="map_title">EVE市场</h1>
  <IndexMarket></IndexMarket>
  <video autoplay loop id="bgvid">
    <source src="../assets/video/Space.mp4" type="video/mp4" />
  </video>
  <!-- <img src="../assets/image/Space.gif" id="bgiid" /> -->
</template>

<script>
import axios from 'axios';
import { onMounted, ref } from 'vue';
import IndexMarket from '../components/IndexMarket.vue';
import { NGradientText } from 'naive-ui';

export default {
  name: 'Main',
  components: {
    IndexMarket,
    NGradientText,
  },
  setup() {
    let serenityOnline = ref(0);
    let tranquilityOnline = ref(0);
    onMounted(async () => {
      const checkResult = await checkServerInformation();
      serenityOnline.value = checkResult.serenityOnline;
      tranquilityOnline.value = checkResult.tranquilityOnline;
      setInterval(async () => {
        const checkResult = await checkServerInformation();
        serenityOnline.value = checkResult.serenityOnline;
        tranquilityOnline.value = checkResult.tranquilityOnline;
      }, 3e4);
    });

    async function checkServerInformation() {
      let serenityOnline = 0;
      let tranquilityOnline = 0;
      try {
        const response = await axios.get('https://esi.evepc.163.com/dev/status/');
        const data = await response.data;
        ({ players: serenityOnline } = data);
      } catch (error) {
        console.log(error);
      }
      try {
        const response = await axios.get('https://esi.evetech.net/dev/status/');
        const data = await response.data;
        ({ players: tranquilityOnline } = data);
      } catch (error) {
        console.log(error);
      }
      return {
        serenityOnline,
        tranquilityOnline,
      };
    }
    return { serenityOnline, tranquilityOnline };
  },
};
</script>

<style scoped>
/* @import "../assets/css/bootstrap.css"; */
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

#bgiid {
  position: absolute;
  right: 0;
  bottom: 0;
  min-width: 100%;
  min-height: 100%;
  height: auto;
  width: auto;
  overflow: hidden;
  z-index: -10;
}

div {
  color: #fff;
}

#map_title {
  margin-left: 10%;
  color: #fff;
  font-size: 36px;
}
.n-gradient-text {
  font-weight: bold;
}
</style>

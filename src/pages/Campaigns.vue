<template>
  <div class="container">
    <div style="width: 100%; height: 130px; border-bottom: solid 1px white">
      <div style="height: 130px; float: left; font-size: 40px; line-height: 130px; overflow: hidden" class="shfont">科学的手电筒</div>
      <div style="width: 200px; height: 130px; float: right" class="xdnum">
        <div style="padding-top: 25px" class="shfont">EVE标准时刻</div>
        <div style="font-size: 30px">
          <span id="clock">{{ now }}</span
          ><small id="clockmisc">.{{ ms }}</small>
        </div>
      </div>
    </div>
    <div class="clearfloat"></div>
    <div class="row">
      <div class="col-md-3" v-for="data in processedData" :key="data.campaignID">
        <div class="blockcontent">
          <div class="mainblock forceyellow" style="display: block">
            <div class="block-header">
              <div class="header-sysname shfont">{{ data.solarSystem }}</div>
              <div class="header-info shfont">
                <span>{{ data.region }}</span
                ><br /><span>{{ data.defender }}</span>
              </div>
            </div>
            <div class="block-body">
              <div class="block-body-left" style="position: relative">
                <div class="block-body-left-text shfont" style="position: absolute" v-if="!data.inTime">增强</div>
                <div class="block-body-left-text shfont blink_white blink_red" style="position: absolute" v-if="data.inTime">争夺</div>
              </div>
              <div class="block-body-info-main" v-if="!data.inTime">
                <div class="block-body-info">
                  <div class="block-body-suct">{{ data.type }}</div>
                  <div class="block-body-timer xdnum main_timer">
                    <span>{{ data.remainingTime }}</span
                    ><small>.{{ msNegative }}</small>
                  </div>
                  <div class="block-body-info-plus shfont">剩余</div>
                </div>
                <div class="block-body-info blue">
                  <div class="block-body-suct">{{ data.type }}</div>
                  <div class="block-body-timer xdnum"><span>00:00:00</span><small>.000</small></div>
                  <div class="block-body-info-plus shfont">防守进度</div>
                </div>
              </div>
              <div class="block-body-info-main" v-if="data.inTime">
                <div class="block-body-info">
                  <div class="block-body-suct">{{ data.type }}</div>
                  <div class="block-body-timer xdnum main_timer" def="1">{{ data.defenderScore }}</div>
                  <div class="block-body-info-plus shfont">防守进度</div>
                </div>
                <div class="block-body-info blue" :style="{ display: 'block', clip: 'rect(0px,' + data.defenderScore * 200 + 'px, 105px, 0px)' }">
                  <div class="block-body-suct">{{ data.type }}</div>
                  <div class="block-body-timer xdnum" def="1">{{ data.defenderScore * 100 + '%' }}</div>
                  <div class="block-body-info-plus shfont">防守进度</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration';
import regions from '@/data/regions.js';
import axios from 'axios';
import { onMounted, onUnmounted, reactive, ref } from 'vue';
export default {
  name: 'Campaigns',
  setup() {
    dayjs.extend(duration);
    let campaignsData = [];
    let processedData = reactive([]);
    let remainingTime = ref();

    let now = ref(dayjs().format('HH:mm:ss'));
    let ms = ref(dayjs().format('SSS'));
    let msNegative = ref();

    let nowTimer;
    let msTimer;

    onMounted(() => {
      getCampaigns();
      nowTimer = setInterval(() => {
        ms.value = dayjs().format('SSS');
        msNegative.value = 999 - Number(ms.value) < 100 ? (999 - Number(ms.value) < 10 ? '00' + (999 - Number(ms.value)).toString() : '0' + (999 - Number(ms.value)).toString()) : (999 - Number(ms.value)).toString();
      }, 1);

      msTimer = setInterval(() => {
        now.value = dayjs().format('HH:mm:ss');
        dynamicTimer();
      }, 1e3);
    });

    onUnmounted(() => {
      clearInterval(nowTimer);
      clearInterval(msTimer);
    });

    async function getCampaigns() {
      try {
        const res = await axios.get('https://esi.evepc.163.com/latest/sovereignty/campaigns/?datasource=serenity');
        const data = res.data;
        campaignsData.push(...data);
        dataProcess();
      } catch (e) {
        console.log(e);
      }
    }

    async function dataProcess() {
      for (let data of campaignsData) {
        let recivedName = [];
        let id;
        let pendingData = [data.defender_id, data.solar_system_id];
        try {
          const res = await axios.post('https://esi.evepc.163.com/latest/universe/names/?datasource=serenity', pendingData);
          recivedName = res.data;
          const res2 = await axios.get(`https://esi.evepc.163.com/latest/universe/constellations/${data.constellation_id}/?datasource=serenity&language=zh`);
          id = res2.data.region_id;
        } catch (e) {
          console.log(e);
        }
        let regionName;
        for (let region of regions) {
          if (region.id === id) {
            regionName = region.name;
          }
        }

        let times = dayjs.duration(dayjs(data.start_time).diff(dayjs())).format('HH:mm:ss');
        if (dayjs.duration(dayjs(data.start_time).diff(dayjs())).get('days') === 0) {
          remainingTime.value = times;
        } else {
          remainingTime.value = times.replace(/^\d{2}(?=:)/, Number(times.slice(0, 2)) + dayjs.duration(dayjs(data.start_time).diff(dayjs())).get('days') * 24);
        }

        processedData.push({
          campaignID: data.campaign_id,
          solarSystem: recivedName[1].name,
          defender: recivedName[0].name,
          region: regionName,
          type: data.event_type === 'tcu_defense' ? '主权' : '设施',
          inTime: dayjs().isAfter(dayjs(data.start_time)),
          defenderScore: data.defender_score,
          remainingTime: remainingTime.value,
          startTime: data.start_time,
        });
      }
    }

    function dynamicTimer() {
      for (let data of processedData) {
        let times = dayjs.duration(dayjs(data.startTime).diff(dayjs())).format('HH:mm:ss');
        if (dayjs.duration(dayjs(data.startTime).diff(dayjs())).get('days') === 0) {
          data.remainingTime = times;
        } else {
          data.remainingTime = times.replace(/^\d{2}(?=:)/, Number(times.slice(0, 2)) + dayjs.duration(dayjs(data.startTime).diff(dayjs())).get('days') * 24);
        }
        if (dayjs().isBefore(dayjs(data.start_time))) {
          data.inTime = true;
        }
      }
    }
    return { processedData, now, ms, msNegative };
  },
};
</script>

<style scoped>
body {
  background-color: black;
  margin: 0;
  color: white;
}

.xdnum {
  font-family: 'XDNUM1', monospace;
}

.clearfloat {
  clear: both;
}

.shfont {
  font-family: 'ChakraPetch', 'MAGIC', sans-serif;
}

.blockcontent {
  width: 256px;
  height: 166px;
  padding: 2px;
  border: solid 1px;
  margin-top: -1px;
  margin-left: -1px;
  transform: translateZ(0px);
}

.mainblock {
  width: 250px;
  height: 160px;
  border: solid 3px;
  display: none;
}

.block-header {
  width: 250px;
  height: 50px;
  border-bottom: solid 1px;
  vertical-align: middle;
  display: flex;
  white-space: nowrap;
  justify-content: space-between;
  overflow: hidden;
}

.header-sysname {
  font-size: 25px;
  line-height: 50px;
  float: left;
  margin-left: 10px;
}

.header-info {
  font-size: 15px;
  line-height: 20px;
  float: right;
  margin-top: 5px;
  margin-right: 10px;
  margin-left: 10px;
}

.block-body {
  width: 250px;
  height: 110px;
}

.block-body-left {
  width: 49px;
  height: 110px;
  border-right: solid 1px;
  text-align: center;
  vertical-align: middle;
  display: inline-block;
}

.block-body-left-text {
  padding-top: 15px;
  text-align: center;
  width: 49px;
  height: 105px;
  line-height: 40px;
  font-size: 30px;
}

.block-body-info {
  float: right;
  width: 200px;
  height: 110px;
  position: relative;
}

.block-body-timer {
  width: 200px;
  height: 110px;
  line-height: 110px;
  text-align: center;
  font-size: 30px;
}
.block-body-info-main {
  position: relative;
  float: right;
  width: 200px;
  height: 110px;
}

.blink_white {
  -webkit-animation-name: b_white;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;

  -moz-animation-name: b_white;
  -moz-animation-duration: 0.5s;
  -moz-animation-timing-function: linear;
  -moz-animation-iteration-count: infinite;

  animation-name: b_white;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.blink_yellow {
  -webkit-animation-name: b_yellow;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;

  -moz-animation-name: b_yellow;
  -moz-animation-duration: 0.5s;
  -moz-animation-timing-function: linear;
  -moz-animation-iteration-count: infinite;

  animation-name: b_yellow;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

.blink_red {
  -webkit-animation-name: b_red;
  -webkit-animation-duration: 0.5s;
  -webkit-animation-timing-function: linear;
  -webkit-animation-iteration-count: infinite;

  -moz-animation-name: b_red;
  -moz-animation-duration: 0.5s;
  -moz-animation-timing-function: linear;
  -moz-animation-iteration-count: infinite;

  animation-name: b_red;
  animation-duration: 0.5s;
  animation-timing-function: linear;
  animation-iteration-count: infinite;
}

@keyframes b_white {
  0% {
    background-color: white;
    color: black;
  }
  99% {
    background-color: black;
    color: white;
  }
  100% {
    background-color: white;
    color: black;
  }
}

@keyframes b_yellow {
  0% {
    background-color: #00918a;
    color: black;
  }
  99% {
    background-color: black;
    color: #00918a;
  }
  100% {
    background-color: #00918a;
    color: black;
  }
}
@keyframes b_red {
  0% {
    background-color: red;
    color: black;
  }
  99% {
    background-color: black;
    color: red;
  }
  100% {
    background-color: red;
    color: black;
  }
}

@-moz-keyframes b_white {
  0% {
    background-color: white;
    color: black;
  }
  99% {
    background-color: black;
    color: white;
  }
  100% {
    background-color: white;
    color: black;
  }
}

@-moz-keyframes b_yellow {
  0% {
    background-color: #00918a;
    color: black;
  }
  99% {
    background-color: black;
    color: #00918a;
  }
  100% {
    background-color: #00918a;
    color: black;
  }
}
@-moz-keyframes b_red {
  0% {
    background-color: red;
    color: black;
  }
  99% {
    background-color: black;
    color: red;
  }
  100% {
    background-color: red;
    color: black;
  }
}

@-webkit-keyframes b_white {
  0% {
    background-color: white;
    color: black;
  }
  99% {
    background-color: black;
    color: white;
  }
  100% {
    background-color: white;
    color: black;
  }
}

@-webkit-keyframes b_yellow {
  0% {
    background-color: #00918a;
    color: black;
  }
  99% {
    background-color: black;
    color: #00918a;
  }
  100% {
    background-color: #00918a;
    color: black;
  }
}
@-webkit-keyframes b_red {
  0% {
    background-color: red;
    color: black;
  }
  99% {
    background-color: black;
    color: red;
  }
  100% {
    background-color: red;
    color: black;
  }
}

.block-body-info-plus {
  position: absolute;
  bottom: 20px;
  right: 15px;
  font-size: 15px;
}
.forcered {
  color: red;
}
.forceyellow {
  color: #00918a;
}
small {
  font-size: 70%;
}

.contain {
  flex-direction: row;
  flex-wrap: wrap;
  display: flex;
  justify-content: center;
}

.block-body-suct {
  position: absolute;
  top: 10px;
  left: 10px;
  font-family: 'MAGIC', sans-serif;
  font-size: 20px;
}

.block-body-timer {
  position: absolute;
}
.blue {
  background-color: #00ffff;
  color: black;
  position: absolute;
  display: none;
}
</style>

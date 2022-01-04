<template>
  <div class="contain">
    <div class="row">
      <div class="col-md-3">
        <div id="evt_26259" class="blockcontent">
          <div class="mainblock forceyellow" style="display: block">
            <div class="block-header">
              <div class="header-sysname shfont">YWS0-Z</div>
              <div class="header-info shfont"><span>普罗维登斯</span><br /><span>北方联盟</span></div>
            </div>
            <div class="block-body">
              <div class="block-body-left" style="position: relative">
                <div class="block-body-left-text shfont" style="position: absolute">增强</div>
              </div>
              <div class="block-body-info-main">
                <div class="block-body-info">
                  <div class="block-body-suct">主权</div>
                  <div class="block-body-timer xdnum main_timer" tm="2021-12-30T08:44:48.149+00:00"><span>16:35:11</span><small>.946</small></div>
                  <div class="block-body-info-plus shfont">剩余</div>
                </div>
                <div class="block-body-info blue">
                  <div class="block-body-suct">主权</div>
                  <div class="block-body-timer xdnum" tm="2021-12-30T08:44:48.149+00:00"><span>00:00:00</span><small>.000</small></div>
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
import axios from 'axios';
import { onMounted, reactive } from 'vue';
export default {
  name: 'Campaigns',
  setup() {
    let campaignsData = [];
    let processedData = reactive([]);

    onMounted(() => {
      getCampaigns();
      console.log(campaignsData);
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

    function dataProcess(){
      for(let data of campaignsData){
        console.log(data);
        processedData.push({
          
        });
      }
    }
    return { processedData };
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
  height: 94px;
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

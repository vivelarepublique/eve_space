<template>
    <div class="container-fluid">
        <div class="row">
            <n-gradient-text class="col-md-3" type="success" size="24px"> （国服）晨曦在线: {{ online1 }} </n-gradient-text>
            <n-gradient-text class="col-md-3" type="warning" size="24px">（国服）曙光在线: {{ online2 }} </n-gradient-text>
            <n-gradient-text class="col-md-3" type="error" size="24px"> （国际服） 宁静在线: {{ online3 }} </n-gradient-text>
        </div>
    </div>
    <h1 id="map_title">EVE市场</h1>
    <div class="main">
        <MarketCanvas></MarketCanvas>
        <div>
            <img src="https://images.ceve-market.org/status/status.png" />
        </div>
    </div>

    <video autoplay loop id="bgvid">
        <source src="../assets/video/Space.mp4" type="video/mp4" />
    </video>
    <!-- <img src="../assets/image/Space.gif" id="bgiid" /> -->
</template>

<script setup>
    import { onMounted, ref } from 'vue';
    // import IndexMarket from '../components/IndexMarket.vue';
    import MarketCanvas from '../components/MarketCanvas.vue';
    import { NGradientText } from 'naive-ui';

    const online1 = ref(0);
    const online2 = ref(0);
    const online3 = ref(0);

    onMounted(async () => {
        const result = await checkServerStatus();
        online1.value = result.sr;
        online2.value = result.inf;
        online3.value = result.tq;
        setInterval(async () => {
            const result = await checkServerStatus();
            online1.value = result.sr;
            online2.value = result.inf;
            online3.value = result.tq;
        }, 15 * 1000);
    });

    async function checkServerStatus() {
        return new Promise(async resolve => {
            const response = await fetch('https://www.ceve-market.org/serverStatus');
            if (response.status !== 200) return;
            const data = await response.text();
            const obj = data.match(/\{.*\}/)?.[0];
            if (obj) {
                resolve(JSON.parse(obj));
            } else {
                resolve({ tq: 0, sr: 0, inf: 0 });
            }
        });
    }
</script>

<style scoped>
    .main > div {
        margin-top: 2%;
        margin-left: 10%;
        margin-right: 10%;
    }

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

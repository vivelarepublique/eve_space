<template>
    <div id="noVNC_container">
        <div id="noVNC_canvas"></div>
    </div>
</template>

<script setup>
    import { onMounted } from 'vue';
    import RFB from '../assets/js/rfb';
    onMounted(() => {
        const rfb = new RFB(document.querySelector('#noVNC_canvas'), 'wss://www.ceve-market.org/websockify', {
            credentials: { password: 'passw0rd' },
        });
        rfb.viewOnly = true;
        rfb.compressionLevel = 9;
        rfb.qualityLevel = 0;
    });
</script>

<style scoped>
    #noVNC_container {
        position: relative;
        width: 640px;
        height: 480px;
    }
</style>

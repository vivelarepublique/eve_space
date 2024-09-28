<template>
    <div>
        <img src="https://www.ceve-market.org/app/influence.png" alt="加载中..." id="map" />
    </div>
</template>

<script setup></script>

<style scoped>
    #map {
        position: static;
        right: 0;
        bottom: 0;
        min-width: 100%;
        min-height: 100%;
        height: auto;
        width: 0;
        overflow: hidden;
        z-index: -100;
    }
</style>

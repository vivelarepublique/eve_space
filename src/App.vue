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
        <router-link to="/market">
            <n-button color="#52DDDD">市场</n-button>
        </router-link>
        <router-link to="/starmap">
            <n-button color="#ADEEDD">星图</n-button>
        </router-link>
        <router-link to="/mineral">
            <n-button color="#DD5252">矿物</n-button>
        </router-link>
        <router-link to="/ice">
            <n-button color="#1976D2">冰矿</n-button>
        </router-link>
        <router-link to="/moon">
            <n-button color="#EE9800">月矿</n-button>
        </router-link>
        <router-link to="/planet">
            <n-button color="#00BFA5">行星材料</n-button>
        </router-link>

        <router-view></router-view>
        <img :src="'./assets/image/page' + number + '.jpg'" id="bgimg" />
    </div>
</template>

<script setup>
import { NButton } from 'naive-ui';

import { useMarketStore } from './shared/marketStore';
const store = useMarketStore();
const { update } = store;
update();

const number = Math.floor(Math.random() * 10) <= 4 ? 4 : 5;
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

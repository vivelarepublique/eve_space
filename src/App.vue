<template>
    <div>
        <router-link to="/">
            <v-btn color="#EE5252">主页</v-btn>
        </router-link>
        <router-link to="/almanac">
            <v-btn color="#EEB300">老黄历</v-btn>
        </router-link>
        <router-link to="/campaigns">
            <v-btn color="#DDDD00">增强信息</v-btn>
        </router-link>
        <router-link to="/market">
            <v-btn color="#52DDDD">市场</v-btn>
        </router-link>
        <router-link to="/starmap">
            <v-btn color="#ADEEDD">星图</v-btn>
        </router-link>
        <router-link to="/mineral">
            <v-btn color="#DD5252">矿物</v-btn>
        </router-link>
        <router-link to="/ice">
            <v-btn color="#1976D2">冰矿</v-btn>
        </router-link>
        <router-link to="/moon">
            <v-btn color="#EE9800">月矿</v-btn>
        </router-link>
        <router-link to="/planet">
            <v-btn color="#00BFA5">行星材料</v-btn>
        </router-link>

        <router-view></router-view>
        <img :src="'src/assets/image/page' + number + '.jpg'" id="bgimg" />
    </div>
</template>

<script setup>
    import { ref } from 'vue';

    import { useMarketStore } from './shared/marketStore';
    const store = useMarketStore();
    const { update } = store;
    update();

    const number = ref(Math.floor(Math.random() * 10) <= 4 ? 4 : 5);
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

import { defineStore } from 'pinia';
import { reactive } from 'vue';

export const useMarketStore = defineStore('market', () => {
    const data = reactive([]);
    async function update() {
        try {
            const response = await fetch('https://esi.evepc.163.com/latest/markets/prices/?datasource=serenity');
            if (response.status !== 200) return;
            const res = await response.data;
            data.splice(0, data.length);
            data.push(...res);
        } catch (error) {
            console.log(error);
        }
    }

    return { data, update };
});

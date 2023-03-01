import { defineStore } from 'pinia';
import { reactive } from 'vue';
import axios from 'axios';

export const useMarketStore = defineStore('market', () => {
  const data = reactive([]);
  async function update() {
    try {
      const response = await axios.get('https://esi.evepc.163.com/latest/markets/prices/?datasource=serenity');
      const res = await response.data;
      data.splice(0, data.length);
      data.push(...res);
    } catch (error) {
      console.log(error);
    }
  }

  return { data, update };
});

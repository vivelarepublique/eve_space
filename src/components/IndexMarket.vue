<template>
  <div class="row">
    <n-data-table
      v-if="flag"
      :columns="columns"
      :data="data"
      :pagination="pagination"
      :bordered="false"
    />
  </div>
</template>

<script>
import axios from "axios";
import { defineComponent, reactive, ref } from "vue";
import { NDataTable } from "naive-ui";
import item from "../data/item.js";

const createColumns = () => {
  return [
    {
      title: "名称",
      key: "name",
    },
    {
      title: "晨曦",
      key: "priceCN",
    },
    {
      title: "宁静",
      key: "priceG",
    },
  ];
};

export default defineComponent({
  name: "indexmap",
  components: { NDataTable },
  setup() {
    let flag = ref(false);
    let data = [];
    getMarketData();
    async function getMarketData() {
      try {
        let response = await axios.get(
          "https://esi.evepc.163.com/latest/markets/prices/?datasource=serenity"
        );
        let res = await response.data;
        for (let i of item) {
          for (let r of res) {
            if (i.typeID === r.type_id) {
              data.push({
                name: i.name,
                priceCN: r.average_price,
                priceG: "NA",
              });
              break;
            }
          }
          flag.value = true;
        }
      } catch (error) {
        console.log(error);
      }
    }

    const paginationReactive = reactive({
      page: 1,
      pageSize: 8,
      onChange: (page) => {
        paginationReactive.page = page;
      },
      onUpdatePageSize: (pageSize) => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
      },
    });
    return {
      flag,
      data,
      columns: createColumns(),
      pagination: paginationReactive,
    };
  },
});
</script>

<style scoped>
.row {
  width: 80%;
  margin-left: auto;
  margin-right: auto;
  opacity: 0.85;
}
</style>
<template>
  <div class="row">
    <n-data-table v-if="flag" :columns="columns" :data="data" :pagination="pagination" :bordered="false" :max-height="400" :row-class-name="rowClassName" size="large" />
  </div>
</template>

<script>
import axios from 'axios';
import { h, defineComponent, reactive, ref } from 'vue';
import { NDataTable, NGradientText } from 'naive-ui';
import item from '../data/item.js';

const createColumns = () => {
  return [
    {
      key: 'name',
      title() {
        return h(
          NGradientText,
          {
            size: '24',
            type: 'info',
          },
          { default: () => '名称' }
        );
      },
      className: 'type',
    },
    {
      title() {
        return h(
          NGradientText,
          {
            size: '24',
            type: 'info',
          },
          { default: () => '晨曦' }
        );
      },
      key: 'priceCN',
    },
    {
      title() {
        return h(
          NGradientText,
          {
            size: '24',
            type: 'info',
          },
          { default: () => '宁静' }
        );
      },
      key: 'priceG',
    },
  ];
};

export default defineComponent({
  name: 'indexmap',
  components: { NDataTable },
  setup() {
    let flag = ref(false);
    let data = [];
    getMarketData();
    async function getMarketData() {
      try {
        let response = await axios.get('https://esi.evepc.163.com/latest/markets/prices/?datasource=serenity');
        let res = await response.data;
        for (let i of item) {
          for (let r of res) {
            if (i.typeID === r.type_id) {
              data.push({
                name: i.name,
                priceCN: r.average_price >= 1e8 ? (r.average_price / 1e8).toFixed(2) + ' 亿' : r.average_price >= 1e4 ? (r.average_price / 1e4).toFixed(2) + ' 万' : r.average_price,
                priceG: 'NA',
                type: i.type,
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
      onChange: page => {
        paginationReactive.page = page;
      },
      onUpdatePageSize: pageSize => {
        paginationReactive.pageSize = pageSize;
        paginationReactive.page = 1;
      },
    });
    return {
      flag,
      data,
      columns: createColumns(),
      pagination: paginationReactive,
      rowClassName(row) {
        if (row.type === '矿物') {
          return 'mineral';
        } else if (row.type === '冰矿产物') {
          return 'ice';
        } else if (row.type === '卫星原材料') {
          return 'moon';
        } else if (row.type === '行星材料') {
          return 'planet';
        } else {
          return '';
        }
      },
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

:deep(td) {
  color: rgba(0, 0, 0, 0.75) !important;
}
:deep(.type) {
  color: rgba(128, 0, 128, 0.75) !important;
}
:deep(.mineral .type) {
  color: rgba(128, 0, 0, 0.75) !important;
}
:deep(.ice .type) {
  color: rgba(0, 0, 128, 0.75) !important;
}
:deep(.moon .type) {
  color: rgba(128, 128, 0, 0.75) !important;
}
:deep(.planet .type) {
  color: rgba(0, 128, 0, 0.75) !important;
}
</style>

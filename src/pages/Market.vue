<template>
  <div class="container-fluid">
    <div class="row">
      <div class="col-md-12">
        <table style="width: 100%">
          <tbody>
            <tr>
              <td>
                <h1 id="region">当前星系: {{ galaxy }}星系</h1>
              </td>
              <td style="vertical-align: middle">
                <form class="form-inline" role="form">
                  <label for="regionselect">选择星系或星域 : </label>
                  <select class="form-control input-sm" style="width: 100px">
                    <option value="0" selected="selected">吉他</option>
                    <option v-for="r in regions" :key="r.id" :value="r.id">
                      {{ r.name }}
                    </option>
                  </select>
                  <label for="search">物品名称</label><input type="text" id="search" class="form-control input-sm" style="width: 100px" />
                  <button id="searchbtn" class="btn btn-default btn-sm">搜索</button>
                </form>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="row">
      <n-space vertical size="large">
        <n-layout has-sider>
          <n-layout-sider content-style="padding: auto;">
            <n-tree block-line :data="data" />
          </n-layout-sider>
          <n-layout>
            <n-layout-content content-style="padding: auto;">
              <div>请选择物品类别</div>
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { NTree, NSpace, NLayout, NLayoutSider, NLayoutContent } from 'naive-ui';
import marketTree from '../data/marketTree.json';
import regions from '@/data/regions.js';

export default defineComponent({
  name: 'market',
  components: {
    NTree,
    NSpace,
    NLayout,
    NLayoutSider,
    NLayoutContent,
  },
  setup() {
    let galaxy = ref('吉他');
    return {
      data: marketTree,
      regions,
      galaxy,
    };
  },
});
</script>

<style>
.n-layout-sider {
  background-color: black;
  opacity: 0.8;
  color: white;
}

.n-layout-content {
  background-color: black;
  opacity: 0.8;
  color: white;
  height: 100%;
  border-left: 2px solid gray;
  padding-left: 5px;
}
.n-space {
  opacity: 0.8;
}
</style>

<template>
  <div>
    <div>
      <div class="row">
        <div class="col-md-12">
          <table style="width: 100%">
            <tbody>
              <tr>
                <td><h1 id="region">当前星系: 吉他星系</h1></td>
                <td style="vertical-align: middle">
                  <form class="form-inline" role="form">
                    <label for="regionselect">选择星系或星域 : </label>
                    <select
                      name="regionselect"
                      id="regionselect"
                      class="form-control input-sm"
                      style="width: 100px"
                    >
                      <option value="0" selected="selected">吉他</option>
                      <option value="11000031">席拉</option>
                      <option value="10000001">德里克</option>
                      <option value="10000002">伏尔戈</option>
                      <option value="10000003">静寂谷</option>
                      <option value="10000004">UUA-F4</option>
                      <option value="10000005">底特里德</option>
                      <option value="10000006">邪恶湾流</option>
                      <option value="10000007">地窖</option>
                      <option value="10000008">灼热之径</option>
                      <option value="10000009">因斯姆尔</option>
                      <option value="10000010">特布特</option>
                      <option value="10000011">大荒野</option>
                      <option value="10000012">柯尔斯</option>
                      <option value="10000013">糟粕之域</option>
                      <option value="10000014">卡彻</option>
                      <option value="10000015">维纳尔</option>
                      <option value="10000016">长征</option>
                      <option value="10000017">J7HZ-F</option>
                      <option value="10000018">螺旋之域</option>
                      <option value="10000019">A821-A</option>
                      <option value="10000020">塔什蒙贡</option>
                      <option value="10000021">域外走廊</option>
                      <option value="10000022">混浊</option>
                      <option value="10000023">黑渊</option>
                      <option value="10000025">伊梅瑟亚</option>
                      <option value="10000027">琉蓝之穹</option>
                      <option value="10000028">摩登赫斯</option>
                      <option value="10000029">对舞之域</option>
                      <option value="10000030">西玛特尔</option>
                      <option value="10000031">绝径</option>
                      <option value="10000032">金纳泽</option>
                      <option value="10000033">赛塔德洱</option>
                      <option value="10000034">卡勒瓦拉阔地</option>
                      <option value="10000035">德克廉</option>
                      <option value="10000036">破碎</option>
                      <option value="10000037">埃维希尔</option>
                      <option value="10000038">幽暗之域</option>
                      <option value="10000039">埃索特亚</option>
                      <option value="10000040">欧莎</option>
                      <option value="10000041">辛迪加</option>
                      <option value="10000042">美特伯里斯</option>
                      <option value="10000043">多美</option>
                      <option value="10000044">孤独之域</option>
                      <option value="10000045">特纳</option>
                      <option value="10000046">斐德</option>
                      <option value="10000047">普罗维登斯</option>
                      <option value="10000048">宁静之域</option>
                      <option value="10000049">卡尼迪</option>
                      <option value="10000050">逑瑞斯</option>
                      <option value="10000051">云环</option>
                      <option value="10000052">卡多尔</option>
                      <option value="10000053">钴蓝边域</option>
                      <option value="10000054">艾里迪亚</option>
                      <option value="10000055">血脉</option>
                      <option value="10000056">非塔波利斯</option>
                      <option value="10000057">外环</option>
                      <option value="10000058">源泉之域</option>
                      <option value="10000059">摄魂之域</option>
                      <option value="10000060">绝地之域</option>
                      <option value="10000061">特里菲斯</option>
                      <option value="10000062">欧米斯特</option>
                      <option value="10000063">贝斯</option>
                      <option value="10000064">精华之域</option>
                      <option value="10000065">柯埃佐</option>
                      <option value="10000066">佩利根弗</option>
                      <option value="10000067">吉勒西斯</option>
                      <option value="10000068">维格温铎</option>
                      <option value="10000069">暗涌之域</option>
                      <option value="10000070">故土</option>
                      <option value="11000001">A-R00001</option>
                      <option value="11000002">A-R00002</option>
                      <option value="11000003">A-R00003</option>
                      <option value="11000004">B-R00004</option>
                      <option value="11000005">B-R00005</option>
                      <option value="11000006">B-R00006</option>
                      <option value="11000007">B-R00007</option>
                      <option value="11000008">B-R00008</option>
                      <option value="11000009">C-R00009</option>
                      <option value="11000010">C-R00010</option>
                      <option value="11000011">C-R00011</option>
                      <option value="11000012">C-R00012</option>
                      <option value="11000013">C-R00013</option>
                      <option value="11000014">C-R00014</option>
                      <option value="11000015">C-R00015</option>
                      <option value="11000016">D-R00016</option>
                      <option value="11000017">D-R00017</option>
                      <option value="11000018">D-R00018</option>
                      <option value="11000019">D-R00019</option>
                      <option value="11000020">D-R00020</option>
                      <option value="11000021">D-R00021</option>
                      <option value="11000022">D-R00022</option>
                      <option value="11000023">D-R00023</option>
                      <option value="11000024">E-R00024</option>
                      <option value="11000025">E-R00025</option>
                      <option value="11000026">E-R00026</option>
                      <option value="11000027">E-R00027</option>
                      <option value="11000028">E-R00028</option>
                      <option value="11000029">E-R00029</option>
                      <option value="11000030">F-R00030</option>
                      <option value="11000030">H-R00032</option>
                    </select>
                    <label for="search">物品名称</label
                    ><input
                      type="text"
                      id="search"
                      class="form-control input-sm"
                      style="width: 100px"
                    />
                    <button id="searchbtn" class="btn btn-default btn-sm">
                      搜索
                    </button>
                  </form>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
    <div>
      <n-space vertical size="large">
        <n-layout has-sider>
          <n-layout-sider content-style="padding: auto;">
            <n-tree block-line :data="data" />
          </n-layout-sider>
          <n-layout>
            <n-layout-content content-style="padding: auto;">
              xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx
              <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx
              <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx
              <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />xxx <br />
            </n-layout-content>
          </n-layout>
        </n-layout>
      </n-space>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { NTree, NSpace, NLayout, NLayoutSider, NLayoutContent } from "naive-ui";
import marketTree from "../data/marketTree.json";

export default defineComponent({
  name: "market",
  components: {
    NTree,
    NSpace,
    NLayout,
    NLayoutSider,
    NLayoutContent,
  },
  setup() {
    return {
      data: marketTree,
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
}
</style>

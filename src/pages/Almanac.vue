<template>
  <div>
    <div class="container">
      <div class="title">
        EVE老黄历<sup>BETA</sup>
        <div style="float: right; font-size: 10px">
          提供: EVE国服 - 莉亚苟萨<br />
          <a href="https://www.linodas.com/" title="一个操作简单方便快捷的角色扮演与卡片收集对战网页游戏" target="_blank">莉诺达斯 www.linodas.com</a>
        </div>
      </div>
      <div class="date">{{ todayString }}</div>
      <div class="good">
        <div class="title">
          <table>
            <tbody>
              <tr>
                <td>宜</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content">
          <ul v-for="goods in goodList" :key="goods.name">
            <li>
              <div class="name">{{ goods.name }}</div>
              <div class="description">{{ goods.good }}</div>
            </li>
          </ul>
        </div>
        <div class="clear"></div>
      </div>
      <div class="split"></div>
      <div class="bad">
        <div class="title">
          <table>
            <tbody>
              <tr>
                <td>不宜</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="content">
          <ul v-for="bads in badList" :key="bads.name">
            <li>
              <div class="name">{{ bads.name }}</div>
              <div class="description">{{ bads.bad }}</div>
            </li>
          </ul>
        </div>
        <div class="clear"></div>
      </div>
      <div class="split"></div>
      <div class="line-tip">
        <strong>适宜会战地点: </strong>EVE宇宙<span class="direction_value">{{ direction }}</span>
      </div>
      <div class="line-tip">
        <strong>今日幸运舰船: </strong><span class="ships_value">{{ ship }}</span>
      </div>
      <div class="line-tip">
        <strong>今日幸运星域: </strong><span class="spaces">{{ space }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import {} from 'vue';
export default {
  name: 'Almanac',
  setup() {
    const today = new Date();
    const weeks = ['日', '一', '二', '三', '四', '五', '六'];
    const todayString = `今天是${today.getFullYear()}年${today.getMonth() + 1}月${today.getDate()}日 星期${weeks[today.getDay()]}`;

    const iday = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

    function random(dayseed, indexseed) {
      let n = dayseed % 11117;
      for (let i = 0; i < 100 + indexseed; i++) {
        n = (n * n) % 11113;
      }
      return n;
    }

    // 生成今日运势
    let activities = [
      { name: '高安任务', good: '全出腹背受敌', bad: '拉暴动被反跳掉线' },
      { name: '刷异常', good: '传说一跳破5k', bad: '刚拉暴动就断网' },
      { name: '蹲站', good: '今天WoW更新版本', bad: '错过羊神发福利' },
      { name: '挖矿', good: '矿涨价比房价还快', bad: '红星蹲驻地星门了' },
      { name: '挖冰', good: '小鲸鱼高安挂机，突出一个安逸', bad: '啥？怎么又被三哥打成低安了？' },
      { name: '打入侵', good: '统合部LP又涨价了', bad: '后勤又断传电了' },
      { name: '虫洞', good: '闭着眼睛数钱', bad: '宝船赠与有缘人' },
      { name: '翻合同', good: '有人填错数字，赚到了', bad: '手一抖买了个金鹏子系统书' },
      { name: '探索', good: '路上捡了个空堡', bad: '你蛋没了' },
      { name: '多开', good: '横扫5级不解释', bad: '不小心打到自己被筒子部端了' },
      { name: 'T1制造', good: '卖给新人赚一个是一个', bad: '真当新人不会玩制造啊' },
      { name: '会战', good: '怒抓一条泰坦', bad: '互蹲星门到半夜下线' },
      { name: '堵门', good: '有人运一船PLEX自动导航', bad: '蹲一晚上秒睡了然后损了' },
      { name: '吃肉', good: '又有金鹏秒睡了', bad: '那个噩梦是永动装肉' },
      { name: '考古', good: '挖了一船势力图', bad: '碳，碳，又TM是碳' },
      { name: 'KFC', good: '全家桶网上订餐有优惠', bad: '总监要查账' },
      { name: '低安任务', good: '本地就一人简直开心', bad: '遇一隐轰，船蛋双飞' },
      { name: '跑货', good: '这个时间没人抓你', bad: '出门就被堵死了' },
      { name: '刷死亡', good: '小B大C潜龙图', bad: '不好意思，双子妥妥的' },
      { name: 'T2制造', good: '知道啥叫出货战争吗', bad: '制造毁一生' },
      { name: '拆迁', good: '壮哉我多炮塔神教', bad: '别人早就跳旗舰回来守家了' },
      { name: '守官员', good: 'AMM全抗妥妥的', bad: '双子，你懂的' },
      { name: '偷运', good: '学好吉他秒跳红减堵门也不怕', bad: '居然有秒锁重拦不科学啊' },
      { name: '收割', good: '异常秒睡党数不胜数', bad: 'N跳外就被发现了' },
      { name: '打捞', good: '就是要捞出一艘泰坦的男人啊', bad: '突然刷个怪没看见，损' },
      { name: '低安观光', good: '海盗都没起床', bad: '这还用问？' },
      { name: '00观光', good: '吓得刷子都蹲站了', bad: '跳进去就撞泡泡了' },
      { name: '高安宣战', good: '又有新鲜的肉啦', bad: '被疯狂的新人围剿' },
      { name: '带路', good: '王师，这边走！', bad: '被王师爆了' },
      { name: '行星开发', good: '一片茫茫白色区', bad: '辛苦半天不如别人一顿KFC' },
      { name: '发明', good: '10条线红了9条，还都是N流程的', bad: '熊老师上线了' },
      { name: '1024', good: '你懂的', bad: '强撸船飞蛋灭' },
      { name: '挖气云', good: '低调的暴利行业', bad: '没人买药' },
      { name: '深渊', good: '一趟十亿不是梦', bad: '“毒蜥，我的毒蜥”' },
      { name: '装备突变', good: '一号官员有我强？', bad: '醒醒，工头叫你搬砖了' },
      { name: '深渊竞技场', good: '大吉大利，今晚吃鸡', bad: '我在哪儿？谁在打我？我怎么死了' },
      { name: '绕杆子', good: '闷声发大财', bad: '卫队LP被压成这样还绕个蛋' },
      { name: '泡YY', good: '哟，萌妹子', bad: '给新人讲解了半天对方表示刚睡着了' },
      { name: 'DOTA2', good: '妹子放一边，基友围一圈', bad: '注定孤独一生' },
      { name: 'FF14', good: '坐骑队，进组，ROLL点，99', bad: '为什么中间有激光扫过啊啊啊啊啊啊啊' },
      { name: '坦克世界', good: '我们击穿了对方装甲', bad: '误国' },
      { name: '挺针队', good: '什么保护伞，老子打的就是保护伞', bad: '鱼儿子捡不了只能含泪打爆残骸' },
      { name: '扫货', good: '版本千里眼财富密码', bad: '一不小心又当韭菜了' },
      { name: '刷微博', good: '新闻八卦不容错过', bad: '你获得了50点负能量' },
      { name: '贴吧', good: '贴吧才是本体', bad: '别水了，再水结构都要没了' },
      //{name:"EFT", good:"EFT是EVE的一部分为什么就是不明白",bad:"忘记上线换技能"},
      { name: '炒货', good: '水硼砂我会乱说？', bad: '还轮得到你么' },
      { name: 'B站', good: '专注新番三十年', bad: '切回来就只剩蛋了' },
      { name: '手游', good: '单抽出奇迹', bad: '还搁这摸鱼呢，今天三刀出了吗' },
      { name: '水新频', good: '水也是一门艺术', bad: '又忘了把本地拉出来了' },
      //{name:"刷ECF", good:"主席夸我政工强！",bad:"切回来就只剩蛋了"}
    ];
    const goodList = [];
    const badList = [];
    const numGood = (random(iday, 98) % 3) + 2; //”宜“个数
    const numBad = (random(iday, 87) % 3) + 2; //”不宜“个数
    const eventArr = pickRandom(activities, numGood + numBad);
    for (let i = 0; i < numGood; i++) {
      goodList.push(eventArr[i]);
    }
    for (let i = 0; i < numBad; i++) {
      badList.push(eventArr[numGood + i]);
    }
    // 从数组中随机挑选 size 个
    function pickRandom(array, size) {
      const result = [...array];

      for (let arr = 0; arr < array.length - size; arr++) {
        const index = random(iday, arr) % result.length;
        result.splice(index, 1);
      }

      return result;
    }

    const directions = ['北方', '东北方', '东方', '东南方', '南方', '西南方', '西方', '西北方'];
    const direction = directions[random(iday, 2) % directions.length];

    const ships = ['分裂者级', '爆发级', '探索级', '裂谷级', '伐木者级', '守夜者级', '阿特龙级', '伊米卡斯级', '因卡萨斯级', '毛鲁斯级', '纳维达斯级', '特里斯坦级', '磨难级', '刽子手级', '检察官级', '惩罚者级', '巨神兵级', '矮脚鸡级', '秃鹫级', '狮鹫级', '苍鹭级', '茶隼级', '小鹰级', '利爪级', '短剑级', '阿瑞斯级', '塔纳尼斯级', '十字军级', '咒灭级', '黑鸦级', '猛禽级', '美洲虎级', '猎狼级', '恩尤级', '伊什库尔级', '审判者级', '复仇级', '女妖级', '战鹰级', '猎豹级', '猎犬级', '太阳神级', '纳美西斯级', '咒逐级', '净化级', '秃鹰级', '蝎尾怪级', '土狼级', '克勒斯级', '哨兵级', '斯芬尼克斯级', '长尾鲛级', '促进级', '强制者级', '海燕级', '剑齿虎级', '厄里斯级', '异端级', '飞燕级', '挑战级', '断崖级', '镰刀级', '刺客级', '星空级', '送葬者级', '托勒克斯级', '狂怒者级', '主宰级', '奥格诺级', '林荫级', '启示级', '黑鸟级', '狞獾级', '巨鸟级', '鱼鹰级', '休津级', '长剑级', '埃拉兹级', '拉克希斯级', '诅咒级', '朝圣级', '战隼级', '白嘴鸦级', '阔刀级', '伏波斯级', '奉献级', '奥尼克斯级', '缪宁级', '流浪级', '戴默斯级', '伊什塔级', '渎圣级', '狂热级', '希尔博拉斯级', '银鹰级', '曲剑级', '奥内罗斯级', '守卫级', '皇冠蜥级', '飓风级', '暴风级', '布鲁提克斯级', '弥洱米顿级', '先知级', '先驱者级', '猛鲑级', '幼龙级', '月刃级', '斯雷普尼级', '阿施塔特级', '曙光女神级', '救赎级', '永灭级', '夜鹰级', '兀鹫级', '狂暴级', '台风级', '死亡漩涡级', '多米尼克斯级', '万王宝座级', '亥伯龙神级', '灾难级', '末日沙场级', '地狱天使级', '乌鸦级', '毒蝎级', '鹏鲲级', '黑豹级', '罪恶级', '救世级', '寡妇级', '恶狼级', '克洛诺斯级', '帕拉丁级', '魔像级', '拉格纳洛克级', '俄洛巴斯级', '神使级', '勒维亚坦级', '纳迦法级', '莫洛级', '神示级', '凤凰级', '冥府级', '尼铎格尔级', '夜神级', '绝念级', '万古级', '执政官级', '奇美拉级', '飞龙级', '巨象级', '徘徊者级', '奥卡托级', '旅行者级', '激进级', '分裂级', '大鸨级', '天鹤级', '阿斯特罗级', '斯特修斯级', '涅斯托级', '加姆级', '奥苏斯级', '巴盖斯级', '达玛维克级', '奇奇莫拉级', '维德马克级', '德雷卡瓦级', '勒沙克级'];
    const ship = pickRandom(ships, 3).join();

    const spaces = ['血脉星域', '德克廉星域', '斐德星域', '对舞之域', '黑渊星域', '特纳', '特布特星域', '静寂谷星域', '维纳尔星域', '地窖星域', '卡彻星域', '柯尔斯星域', '底特里德', '埃索特亚', '非塔波利斯', '大荒野星域', '伊梅瑟亚', '绝径星域', '因斯姆尔', '欧米斯特', '摄魂之域', '普罗维登斯', '灼热之径', '混浊星域', '特里菲斯', '邪恶湾流', '云环星域', '绝地之域', '源泉之域', '外环星域', '贝斯星域', '逑瑞斯星域', '辛迪加', '域外走廊', '琉蓝之穹', '卡勒瓦拉阔地', '欧莎', '钴蓝边域', '糟粕之域', '佩利根弗', '螺旋之域'];
    const space = pickRandom(spaces, 2).join();

    return { todayString, goodList, badList, direction, ship, space };
  },
};
</script>

<style lang="less" scoped>
body {
  background: white;
  margin: 0;
  padding: 0;
  * {
    font-family: 'Consolas', 'Microsoft Yahei', Arial, sans-serif;
  }
}

.container {
  width: 320px;
  margin: 0 auto 50px;
  > .title {
    color: #bbb;
    font-weight: bold;
    font-size: 16px;
    margin-bottom: 10px;
    background: #555;
    padding: 5px 15px;
    height: 40px;
    a {
      color: #bbb;
      &:hover {
        color: #00ccff;
      }
    }
  }
}

.date {
  font-size: 15pt;
  font-weight: bold;
  line-height: 30pt;
  text-align: center;
}

.split,
.clear {
  clear: both;
  height: 1px;
  overflow-y: hidden;
}

.good,
.bad {
  clear: both;
  position: relative;
  .content {
    margin-left: 115px;
    padding-right: 10px;
    padding-top: 1px;
    font-size: 15pt;
  }
  .title {
    float: left;
    width: 100px;
    font-weight: bold;
    text-align: center;
    font-size: 30pt;
    position: absolute;
    top: 0;
    bottom: 0;
    > table {
      position: absolute;
      width: 100%;
      height: 100%;
      border: none;
    }
  }
}

.good {
  background: #ffffaa;
  .title {
    background: #ffee44;
  }
}

.bad {
  background: #ffddd3;
  .title {
    background: #ff4444;
    color: #fff;
  }
}

.content ul {
  list-style: none;
  margin: 10px 0 0;
  padding: 0;
  li {
    line-height: 150%;
    font-size: 15pt;
    font-weight: bold;
    color: #444;
    div.description {
      font-size: 10pt;
      font-weight: normal;
      color: #777;
      line-height: 110%;
      margin-bottom: 10px;
    }
  }
}

.line-tip {
  font-size: 11pt;
  margin-top: 10px;
  margin-left: 10px;
}

.direction_value {
  color: #4a4;
  font-weight: bold;
}

.ships_value {
  color: #44a;
  font-weight: bold;
}

.comment {
  margin-top: 50px;
  font-size: 11pt;
  margin-left: 10px;
  ul {
    margin-left: 0;
    padding-left: 20px;
    color: #999;
  }
}
</style>

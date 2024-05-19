const fs = require('fs');
const items = require('../json/items.json');

let result = [
    {
        label: '舰船装备',
        key: '舰船装备',
        children: [],
    },
    {
        label: '军火和弹药',
        key: '军火和弹药',
        children: [],
    },
    {
        label: '贸易货物',
        key: '贸易货物',
        children: [],
    },
    {
        label: '植入体和增效剂',
        key: '植入体和增效剂',
        children: [],
    },
    {
        label: '服饰',
        key: '服饰',
        children: [],
    },
    {
        label: '制造和研究',
        key: '制造和研究',
        children: [],
    },
    {
        label: '建筑',
        key: '建筑',
        children: [],
    },
    {
        label: '蓝图和反应',
        key: '蓝图和反应',
        children: [],
    },
    {
        label: '行星基础设施',
        key: '行星基础设施',
        children: [],
    },
    {
        label: '舰船涂装',
        key: '舰船涂装',
        children: [],
    },
    {
        label: '舰船和装备改装件',
        key: '舰船和装备改装件',
        children: [],
    },
    {
        label: '飞行员服务',
        key: '飞行员服务',
        children: [],
    },
    {
        label: '特别版用品',
        key: '特别版用品',
        children: [],
    },
    {
        label: '舰船',
        key: '舰船',
        children: [],
    },
    {
        label: '技能',
        key: '技能',
        children: [],
    },
    {
        label: '无人机',
        key: '无人机',
        children: [],
    },
    {
        label: '建筑装备',
        key: '建筑装备',
        children: [],
    },
    {
        label: '建筑改装件',
        key: '建筑改装件',
        children: [],
    },
];

for (let i of items.item) {
    checkData(i, 1);
}

function checkData(item, level) {
    if (Object.hasOwn(item, `classification${level}`)) {
        checkData(item, level + 1);
    } else {
        if (level !== 1) {
            for (let r of result) {
                checkArray(r, item, 1);
            }
        }
    }
}

function checkArray(r, item, level) {
    if (r && Object.hasOwn(r, 'key')) {
        if (r.label === item[`classification${level}`]) {
            if (Object.hasOwn(r, 'children')) {
                let flag = false;
                if (r.children.length !== 0) {
                    for (let c of r.children) {
                        if (c.label === item[`classification${level + 1}`]) {
                            flag = true;
                            break;
                        }
                    }
                }
                if (!flag) {
                    if (Object.hasOwn(item, `classification${level + 1}`)) {
                        let keyid = '';
                        for (let l = level; l--; l > 2) {
                            keyid += '-' + item[`classification${l + 1}`];
                        }
                        r.children.push({
                            label: item[`classification${level + 1}`],
                            key: item[`classification${level + 1}`] + keyid,
                        });
                    } else {
                        r.children.push({
                            label: item.name,
                            key: item.typeID,
                        });
                    }
                }
            } else {
                if (Object.hasOwn(item, `classification${level + 1}`)) {
                    let keyid = '';
                    for (let l = level; l--; l > 2) {
                        keyid += '-' + item[`classification${l + 1}`];
                    }
                    r.children = [];
                    r.children.push({
                        label: item[`classification${level + 1}`],
                        key: item[`classification${level + 1}`] + keyid,
                    });
                } else {
                    r.children = [];
                    r.children.push({
                        label: item.name,
                        key: item.typeID,
                    });
                }
            }
        } else {
            return;
        }
    }
    if (level <= 5 && r && r.children) {
        let child;
        let flag = false;
        for (let c of r.children) {
            if (c.label === item[`classification${level + 1}`]) {
                child = c;
                flag = true;
                break;
            }
        }
        if (flag) {
            checkArray(child, item, level + 1);
        }
    }
}

fs.writeFile('result.json', JSON.stringify(result), function (err) {
    if (err) {
        return console.log(err);
    }
    console.log('The file was saved!');
});

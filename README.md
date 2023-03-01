# EVE Space

## What is it?

****EVE space**** is an information gathering tool and game aid for CEVE (EVE Serenity).

## Release version

No yet.

## Manually build and install

```bash
git clone https://github.com/vivelarepublique/eve_space
cd eve_space
npm install
npm run electron:serve
```

If you get an `electron` installation error during the `npm install` process, please refer to the following command:

```bash
cd node_modules\electron
node install.js
```

This should alleviate problems with electron's package downloads.

## API

### Data interface

<https://esi.evepc.163.com/ui/>

### API document

<https://www.ceve-market.org/api/>

### Simple example

<https://shimo.im/docs/DhCG9tWHtjVyTqwc/read>

### Development Dependency

1. [Vue3](https://v3.cn.vuejs.org/)
2. [Naive-UI](https://www.naiveui.com/zh-CN/)
3. [Electron](https://www.electronjs.org/)
4. [Less](https://less.bootcss.com/)
5. [bootstrap3](https://v3.bootcss.com/css/)

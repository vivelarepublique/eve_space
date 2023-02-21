module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {},
    },
  },
  chainWebpack: config => {
    config.plugin('html').tap(args => {
      args[0].title = 'EVE Space';
      return args;
    });
  },
};

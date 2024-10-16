module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    // plugins: [
    //   [
    //     {
    //       moduleName: '@env',
    //       path: '.env',
    //     },
    //   ],
    // ],
  };
};

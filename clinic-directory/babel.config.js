module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@': './src',
            '@constants': './src/constants',
            '@screens': './src/screens',
            '@components': './src/components',
            '@navigation': './src/navigation',
            '@context': './src/context',
            '@data': './src/data',
            '@i18n': './src/i18n',
          },
        },
      ],
    ],
  };
};

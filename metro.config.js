const { getDefaultConfig } = require('@react-native/metro-config');

module.exports = (async () => {
  const defaultConfig = await getDefaultConfig(__dirname);

  return {
    resolver: {
      sourceExts: [...defaultConfig.resolver.sourceExts, 'cjs'],
      platforms: [...defaultConfig.resolver.platforms, 'macos'],
      extraNodeModules: require('node-libs-react-native'),
    },
  };
})();

const path = require('path');
const webpack = require('webpack');

module.exports = {
  webpack: {
    configure: (config, { env, paths }) => {
      config.resolve.fallback = {
        "path": require.resolve("path-browserify"),
        "fs": false,
        "buffer": require.resolve("buffer/")
      };
      config.plugins = (config.plugins || []).concat([
        new webpack.ProvidePlugin({
          Buffer: ['buffer', 'Buffer'],
        }),
      ]);

      return config;
    },
  },
};


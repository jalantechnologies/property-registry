const webpack = require('webpack');
const config = require('config');

module.exports = {
  plugins: [
    new webpack.DefinePlugin({
      CONFIG: JSON.stringify(config.get('public')),
    }),
  ],
};

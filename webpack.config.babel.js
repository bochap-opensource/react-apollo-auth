/* global process __dirname */
import path from 'path';
import webpack from 'webpack';

const config = {
  devtool: 'source-map'
  , entry: ['babel-polyfill', './src/client/index.js']
  , output: {
    path: path.resolve(__dirname, './src/client/assets')
    , filename: 'bundle.js'
    , sourceMapFilename: 'bundle.map'
  }
  , module: {
    rules: [
      {
        test: /\.js$/
        , include: path.resolve(__dirname, 'src')
        , use: ['babel-loader']
      }
    ]
  }
};

if (process.env.NODE_ENV === 'production') {
  config.plugins.push(
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify(process.env.NODE_ENV)
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: true
      , minimize: true
      , warnings: false
      , mangle: true
    })
  );
}

export default config;

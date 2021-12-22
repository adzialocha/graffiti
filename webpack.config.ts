import * as path from 'path';

import CopyPlugin from 'copy-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';

import type { Configuration } from 'webpack';

const DIR_DIST = 'build';
const DIR_SRC = 'src';

function getPath(...args: Array<string>): string {
  return path.join(__dirname, ...args);
}

const config: Configuration = {
  entry: {
    background: getPath(DIR_SRC, 'background'),
    index: getPath(DIR_SRC, 'index'),
  },
  output: {
    path: getPath(DIR_DIST),
    filename: '[name].js',
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      '~': getPath(DIR_SRC),
    },
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        loader: 'ts-loader',
      },
    ],
  },
  plugins: [
    new CopyPlugin({
      patterns: [
        {
          from: '**/*',
          context: DIR_SRC,
          globOptions: {
            ignore: ['*.ts'],
          },
        },
        {
          from: getPath(
            'node_modules',
            'webextension-polyfill',
            'dist',
            'browser-polyfill.min.js',
          ),
        },
      ],
    }),
    new WebExtPlugin({ sourceDir: getPath(DIR_DIST) }),
  ],
  devtool: 'source-map',
  stats: 'minimal',
};

export default config;

import * as path from 'path';

import CopyPlugin from 'copy-webpack-plugin';
import HtmlPlugin from 'html-webpack-plugin';
import WebExtPlugin from 'web-ext-plugin';

import type { Configuration } from 'webpack';

const DIR_DIST = 'build';
const DIR_SRC = 'src';

function getPath(...args: Array<string>): string {
  return path.join(__dirname, ...args);
}

const config: Configuration = {
  entry: {
    'content-script': getPath(DIR_SRC, 'content-script'),
    background: getPath(DIR_SRC, 'background'),
    popup: getPath(DIR_SRC, 'popup'),
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
          from: '**/*.{png,json}',
          context: DIR_SRC,
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
    new HtmlPlugin({
      template: getPath(DIR_SRC, 'popup.html'),
      filename: 'popup.html',
      chunks: ['popup'],
    }),
    new WebExtPlugin({ sourceDir: getPath(DIR_DIST) }),
  ],
  devtool: 'source-map',
  stats: 'minimal',
};

export default config;

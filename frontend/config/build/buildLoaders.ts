import webpack from 'webpack';

import { buildCssLoader } from './loaders/buildCssLoader';
import { buildSvgLoader } from './loaders/buildSvgLoader';
import { BuildOptions } from './types/config';

export function buildLoaders({ isDev } : BuildOptions): webpack.RuleSetRule[] {
  const babelLoader = {
    test: /\.(js|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        presets: ['@babel/preset-env'],
      },
    },
  };

  const fileLoader = {
    test: /\.(png|jpg|gif|ico|woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
    dependency: { not: ['url'] },
  };

  const svgLoader = buildSvgLoader();

  const typescriptLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  };

  const cssLoader = buildCssLoader(isDev);

  return [
    babelLoader,
    fileLoader,
    svgLoader,
    typescriptLoader,
    cssLoader
  ];
}

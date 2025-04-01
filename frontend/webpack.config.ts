import path from 'path';
import webpack from 'webpack';

import { buildWebpackConfig } from './config/build/buildWebpackConfig';
import { BuildEnv, BuildMode, BuildPaths } from './config/build/types/config';

export default (env: BuildEnv) => {
  const paths: BuildPaths = {
    entry: path.resolve(__dirname, 'src', 'main.tsx'),
    build: path.resolve(__dirname, 'dist'),
    html: path.resolve(__dirname, 'index.html'),
    src: path.resolve(__dirname, 'src'),
    publicPath: env.publicPath ?? '/',
  };

  const mode: BuildMode = env.mode || 'development';
  const isDev = mode === 'development';
  const isBuild = env.build || false;
  const port = env.port || 3000;

  const config: webpack.Configuration = buildWebpackConfig({
    mode,
    paths,
    isDev,
    isBuild,
    port,
  });
  return config;
};

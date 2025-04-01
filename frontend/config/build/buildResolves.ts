import path from 'path';
import webpack from 'webpack';

import { BuildOptions } from './types/config';

export function buildResolves({ paths }: BuildOptions): webpack.ResolveOptions {
  return {
    extensions: ['.tsx', '.ts', '.js', '.jsx'],
    preferAbsolute: true,
    modules: [paths.src, 'node_modules'],
    mainFiles: ['index'],
    alias: {
      '@app': path.resolve(__dirname, paths.src, 'app'),
      '@pages': path.resolve(__dirname, paths.src, 'pages'),
      '@widgets': path.resolve(__dirname, paths.src, 'widgets'),
      '@entities': path.resolve(__dirname, paths.src, 'entities'),
      '@shared': path.resolve(__dirname, paths.src, 'shared'),
    },
  };
}

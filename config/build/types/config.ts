export type BuildMode = 'production' | 'development'

export interface BuildPaths {
  entry: string
  build: string
  html: string
  src: string
  publicPath: string
}

export interface BuildOptions {
  mode: BuildMode;
  paths: BuildPaths;
  isDev: boolean
  port: number
}

export interface BuildEnv {
  mode: BuildMode;
  port: number
  publicPath: string
}

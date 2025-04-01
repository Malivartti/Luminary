export function buildSvgLoader() {
  return {
    test: /\.svg$/,
    use: [{ 
      loader: '@svgr/webpack',
      options: { icon: true },
    }],
  };
}

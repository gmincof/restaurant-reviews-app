const HtmlWebpackPlugin = options => new (require('html-webpack-plugin'))({
  template: './src/template',
  minify: {
    removeAttributeQuotes: true,
    collapseWhitespace: true,
    removeComments: true,
    removeEmptyAttributes: true,
    minifyCSS: true,
  },
  ...options
})

module.exports = mode => ({
  module: {
    rules: [
      { test: /\.html$/, use: 'html-loader' },
      { test: /\.css$/, use: [ 'style-loader', 'css-loader', 'postcss-loader' ] },
      { test: /\.png$/, use: 'file-loader' },
    ]
  },
  plugins: [
    new (require('clean-webpack-plugin'))('./dist'),
    HtmlWebpackPlugin({ filename: 'index.html', templateParameters: { template: 'restaurants' } }),
    HtmlWebpackPlugin({ filename: 'restaurant.html', templateParameters: { template: 'restaurant' } }),
    new (require('workbox-webpack-plugin')).InjectManifest({ swSrc: './src/sw.js' }),
  ]
})

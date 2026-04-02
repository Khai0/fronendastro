const path = require('path')
const glob = require('glob')
const {
  VueLoaderPlugin
} = require('vue-loader')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ESLintPlugin = require('eslint-webpack-plugin')

module.exports = {
  entry: glob.sync('./src/js/entries/**.js').reduce(function (obj, el) {
    obj[path.parse(el).name] = el
    return obj
  }, {}),
  output: {
    path: path.resolve(__dirname, 'assets')
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    alias: {
      '@': path.resolve('./src'),
      vue$: path.resolve('./node_modules/vue/dist/vue.esm.js')
    }
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: /\.vue$/,
        loader: 'vue-loader'
      },
      {
        test: /\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              importLoaders: 2
            }
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: [
                  ['tailwindcss', {}],
                  ['autoprefixer', {}]
                ]
              }
            }
          },
          'sass-loader'
        ]
      },
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          'css-loader'
        ]
      }
    ]
  },
  plugins: [
    new VueLoaderPlugin(),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
    new ESLintPlugin({
      files: 'src/**/*.{js,vue}'
    })
  ],
  watchOptions: {
    ignored: '!src'
  },
  optimization: {
    splitChunks: {
      cacheGroups: {
        themeVendors: {
          test: /[\\/]node_modules[\\/]/,
          name: 'theme.vendors',
          chunks (chunk) {
            return chunk.name === 'theme'
          }
        }
        // checkoutVendors: {
        //     test: /[\\/]node_modules[\\/]/
        //     name: 'checkout.vendors',
        //     chunks(chunk) {
        //         return chunk.name === 'checkout';
        //     },
        // }
      }
    }
  }
}

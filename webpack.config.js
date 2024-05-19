const path = require('path');
const { VueLoaderPlugin } = require('vue-loader');

const config = {
    entry: './src/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'renderer.js',
        pathinfo: false,
    },
    module: {
        rules: [
            {
                test: /\.vue$/,
                loader: 'vue-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/,
                use: ['vue-style-loader', 'css-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.less$/,
                use: ['vue-style-loader', 'css-loader', 'less-loader'],
                exclude: /node_modules/,
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2|png|jpg|gif|mp4)$/i,
                type: 'asset',
            },
        ],
    },
    resolve: {
        extensions: ['.js', '.vue', '.less'],
    },
    mode: 'production',
    optimization: {
        minimize: false,
    },
    performance: {
        maxAssetSize: 1024 * 1024 * 16,
        maxEntrypointSize: 1024 * 1024 * 16,
    },
    plugins: [new VueLoaderPlugin()],
};

module.exports = config;

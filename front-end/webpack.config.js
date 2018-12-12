const path = require('path');

module.exports = (env) => {
    const isProduction = env === 'production';
    console.log('env : ',env);
    console.log('isProduction : ',isProduction);
    return {
        entry: './src/App.js',
        output: {
            path: path.join(__dirname, 'public'),
            filename: 'dist/bundle.js'
        },
        module: {
            rules: [
                {
                    test: /\.(js)?$/,
                    exclude: path.join(__dirname, './node_modules'),
                    use: [
                        {
                            loader: 'babel-loader',
                            options: {
                                cacheDirectory: true,
                            },
                        }
                    ]
                },
                {
                    test: /\.s?css$/,
                    use: [
                        'style-loader',
                        'css-loader',
                        'sass-loader'
                    ]
                },
                {
                    test: /\.(png|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                    include: path.join(__dirname, './public'),
                    use: [{
                        loader: 'file-loader'
                    }]
                }
            ]
        },
        devtool: isProduction ? 'source-map':'cheap-module-eval-source-map',
        devServer: {
            contentBase: path.join(__dirname, 'public'),
            historyApiFallback: true
        }
    };
};

var path = require('path');
module.exports = {
    mode: "development",
    entry: './client.js',
    output: {
        filename: 'bundle.js'
    },
    module: {
        rules: [{
            test: /\.es$/,
            loader: "babel-loader",
            options: {
                "presets": ['es2015', 'stage-0'],
                "plugins": ['transform-runtime']
            },
            exclude: path.resolve(__dirname, "../node_modules")
        }]
    }
}

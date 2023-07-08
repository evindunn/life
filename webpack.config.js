const path = require('path');

const env = process.env["NODE_ENV"] || "production";

module.exports = {
    entry: './src/index.js',
    mode: env,
    output: {
        filename: 'bundle.js',
        path: path.resolve(__dirname, 'dist'),
        library: {
            type: "var",
            name: "Life"
        }
    },
};
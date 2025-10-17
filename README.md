# Game of Life

[![Build Status](https://github.com/evindunn/life/actions/workflows/publish.yml/badge.svg)](https://github.com/evindunn/life/actions/workflows/publish.yml)

This is the source for my version of Conway's Game of Life running
at [gol.evindunn.com](https://gol.evindunn.com).

I built it to learn more about [webpack](https://webpack.js.org) and 
because I wanted to write something for the web that didn't use a 
preexisting framework.

I use [Two.js](https://two.js.org) for 2D rendering & it's awesome.

I use the following webpack plugins
* [CssMinimizerWebpackPlugin](https://webpack.js.org/plugins/css-minimizer-webpack-plugin/)
* [HTMLWebpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)
* [MiniCssExtractPlugin](https://webpack.js.org/plugins/mini-css-extract-plugin/)

## Tools

```
npm run dev
```

will start a dev server on `http://127.0.0.1:8080`.

```
npm run build
```

will build the minified site in `dist/`.

## Continuous Deploy

The [publish.yml](./.github/workflows/publish.yml) workflow builds
the transpiled web page and pushes it to an S3 bucket using credentials 
stored in the `PUBLISHING_ACCESS_KEY` and `PUBLISHING_SECRET_KEY` 
secrets every time a tag is pushed to `main`.

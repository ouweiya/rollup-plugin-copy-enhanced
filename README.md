### Rollup plugin to copy and minify files during build.

## Install

```console
npm i rollup-plugin-copy-enhanced -D
```

## Usage


**`rollup.config.js`**

```js
import copy from 'rollup-plugin-copy-enhanced';

export default {
  ...
  plugins: [copy(['src/assets/**/*', 'src/index.html'], true)],
};
```
## Options

```js
copy(src: string | string[], shouldMinify?: boolean)
```

`src`: Configured using [glob](https://github.com/isaacs/node-glob) pattern

`shouldMinify`: Enable minification. Supports HTML, CSS, and JSON.


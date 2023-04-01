## Install

```console
npm i rollup-plugin-json-minify -D
```

## Usage

**`rollup.config.js`**

```js
import jsonMinify from 'rollup-plugin-json-minify';

export default {
  ...
  plugins: [jsonMinify({rootDir: 'src', patterns: ['assets/**/*.json', 'a.json'] })],
};
```

## Configuration

```js
jsonMinify({
  rootDir: 'src',
  patterns: ['assets/**/*.json', 'a.json'],
});
```

**`rootDir`**

Type: `string`

default: `Root directory`

**`patterns`**

Type: `string[]`

find files using [glob](https://github.com/isaacs/node-glob)

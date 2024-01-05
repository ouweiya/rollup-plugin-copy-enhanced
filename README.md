### Rollup plugin to copy, minify files, and dynamically generate HTML.

## Install

```console
npm i rollup-plugin-copy-enhanced -D
```

## Usage

**`rollup.config.js`**

```js
import copy from 'rollup-plugin-copy-enhanced';

export default {
    plugins: [copy(['src/assets/**/*', 'src/index.html'], { minify: true, context: { jsurl: '/index.js' } })],
};
```

## Options

`copy(src: string | string[], opts?: { minify?: boolean, context?: any })`

`src`: Configured using [glob](https://github.com/isaacs/node-glob) pattern

`opts`: An optional object with the following properties:

-   `minify`: Enable minification. Supports HTML, CSS, and JSON.
-   `context`: The context to be used when compiling [Handlebars](https://github.com/handlebars-lang/handlebars.js) templates.

## Dynamically Generate HTML

Compile HTML templates using Handlebars.

```html
<html lang="en">
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
        <script src="{{jsurl}}"></script>
    </body>
</html>
```

```js
copy(['src/index.html'], { context: { jsurl: '/index.js' } });
```

`{{jsurl}}`: Placeholder

`context`: Context object, where the key values are used to replace placeholders in the HTML.

**Compilation Result**

```html
<html lang="en">
    <head>
        <meta charset="UTF-8" />
    </head>
    <body>
        <script src="/index.js"></script>
    </body>
</html>
```

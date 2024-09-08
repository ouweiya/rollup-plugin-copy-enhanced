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

Compile HTML templates using [Handlebars](https://github.com/handlebars-lang/handlebars.js).

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

## Handlebars Usage Example

```js
const htmlText = `
<div>
    <h1>{{title}}</h1>
    <p>{{body}}</p>
</div>
`;

const template = Handlebars.compile(htmlText);

const html = template({ title: 'New Article', body: 'My first article' });

console.log(html);

<div>
    <h1>New Article</h1>
    <p>My first article</p>
</div>
```

## More about Handlebars

Handlebars is a popular templating engine that allows you to use templates and input objects to generate HTML or other text formats. Handlebars templates look like regular HTML, with dynamic content surrounded by double braces `{{}}`.

If you want to learn more about Handlebars, you can visit its official documentation:

[Handlebars Official Documentation](https://handlebarsjs.com/)

.
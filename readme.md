# vite-plugin-marked

A minimalist Vite plugin for converting Markdown to HTML with [marked](https://github.com/markedjs/marked). No other dependencies.

```
pnpm add vite-plugin-marked -D
```

## Usage

```ts
import markedPlugin from 'vite-plugin-marked'

export default defineConfig({
  plugins: [
    // Default options
    markedPlugin({
      htmlQuery: false,
      // Marked options
      async: false,
      breaks: false,
      extensions: null,
      gfm: true,
      hooks: null,
      pedantic: false,
      renderer: null,
      silent: false,
      tokenizer: null,
      walkTokens: null,
    }),
  ],
})
```

The options for `marked` are documented [here](https://marked.js.org/using_advanced#options).

By default, any `.md` import will be processed into a default export containing the HTML string.

```ts
import htmlString from './example.md'

console.log(htmlString)
```

Note that any `.md` imports with `?raw` or other query params won't get processed by this plugin.

### `?html` query

You can set the `htmlQuery` option to `true` to only process `.md` imports with the `?html` query.

```ts
import htmlString from './example.md?html'
```

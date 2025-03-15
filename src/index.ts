import { marked, MarkedOptions } from 'marked'
import type { Plugin } from 'vite'

export interface MarkedPluginOptions extends MarkedOptions {
  /**
   * If true, the plugin will only process `.md` imports with the `?html` query.
   *
   * @default false
   */
  htmlQuery?: boolean
}

export default function markedPlugin({
  htmlQuery,
  ...options
}: MarkedPluginOptions = {}): Plugin {
  const filter: (id: string) => boolean = htmlQuery
    ? id => id.endsWith('.md?html')
    : id => id.endsWith('.md')

  return {
    name: 'vite-plugin-marked',

    async transform(code, id) {
      if (!filter(id)) {
        return null
      }

      // Convert markdown to HTML using marked
      const html = await marked.parse(code, options)

      // Return as a module that exports the HTML string
      return `export default ${JSON.stringify(html)}`
    },
  }
}

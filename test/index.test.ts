import { mkdirSync, rmSync, writeFileSync } from 'fs'
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url'
import * as vite from 'vite'
import markedPlugin, { MarkedPluginOptions } from '../src/index'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const tempDir = resolve(__dirname, '.tmp')

test('default behavior', async () => {
  const filePath = resolve(tempDir, 'test.md')
  writeFileSync(filePath, '# Hello World')

  await build(filePath)

  const output = await uncachedImport(resolve(tempDir, 'dist/main.js'))
  expect(output).toMatchInlineSnapshot(`
    {
      "default": "<h1>Hello World</h1>
    ",
    }
  `)
})

test('htmlQuery option', async () => {
  const filePath = resolve(tempDir, 'test.md')
  writeFileSync(filePath, '# Hello World')

  const entry = resolve(tempDir, 'main.js')
  writeFileSync(entry, 'export { default } from "./test.md?html"')

  await build(entry, { htmlQuery: true })

  const output = await uncachedImport(resolve(tempDir, 'dist/main.js'))
  expect(output).toMatchInlineSnapshot(`
    {
      "default": "<h1>Hello World</h1>
    ",
    }
  `)
})

test('raw query', async () => {
  const filePath = resolve(tempDir, 'test.md')
  writeFileSync(filePath, '# Hello World')

  const entry = resolve(tempDir, 'main.js')
  writeFileSync(entry, 'export { default } from "./test.md?raw"')

  await build(entry)

  const output = await uncachedImport(resolve(tempDir, 'dist/main.js'))
  expect(output).toMatchInlineSnapshot(`
    {
      "default": "# Hello World",
    }
  `)
})

function build(entry: string, options?: MarkedPluginOptions) {
  return vite.build({
    root: tempDir,
    logLevel: 'silent',
    plugins: [markedPlugin(options)],
    build: {
      minify: false,
      lib: {
        entry,
        fileName: 'main',
        formats: ['es'],
      },
    },
  })
}

let nextImportId = 1

function uncachedImport(path: string) {
  return import(path + '?id=' + nextImportId++)
}

beforeAll(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

beforeEach(() => {
  mkdirSync(tempDir, { recursive: true })
})

afterEach(() => {
  rmSync(tempDir, { recursive: true, force: true })
})

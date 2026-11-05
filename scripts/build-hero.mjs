import { build } from 'esbuild'
import { createHash } from 'node:crypto'
import { createRequire } from 'node:module'
import { readFile, writeFile, mkdir, readdir, unlink } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const root = process.cwd()
const out = path.join(root, 'public/sobremesas-de-travessa')
await mkdir('.cache', { recursive: true })
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12)
const client = await build({ entryPoints: ['hero/client.tsx'], bundle: true, minify: true, write: false, format: 'esm', target: 'es2022', tsconfig: 'tsconfig.json', define: { 'process.env.NODE_ENV': '"production"' } })
const js = client.outputFiles[0].contents
const jsName = `hero10-${digest(js)}.js`
await writeFile(path.join(out, 'assets', jsName), js)
const cssBuild = spawnSync(process.execPath, ['node_modules/@tailwindcss/cli/dist/index.mjs', '-i', 'hero/styles.css', '-o', '.cache/hero10.css', '--minify'], { cwd: root, stdio: 'inherit' })
if (cssBuild.status !== 0) throw new Error('Tailwind build failed')
const css = await readFile('.cache/hero10.css')
const cssName = `hero10-${digest(css)}.css`
await writeFile(path.join(out, 'assets', cssName), css)
await build({ entryPoints: ['hero/server.tsx'], outfile: '.cache/hero10-server.cjs', bundle: true, external: ['react', 'react-dom', 'react-dom/*'], platform: 'node', format: 'cjs', tsconfig: 'tsconfig.json', define: { 'process.env.NODE_ENV': '"production"' } })
const require = createRequire(import.meta.url)
const { renderHero } = require(path.join(root, '.cache/hero10-server.cjs'))
const markup = renderHero()
let html = await readFile(path.join(out, 'index.html'), 'utf8')
html = html.replace(/<!-- hero10:head -->[\s\S]*?<!-- \/hero10:head -->\s*/g, '')
html = html.replace(/<!-- hero10:island -->[\s\S]*?<!-- \/hero10:island -->/g, '')
html = html.replace('</head>', `<!-- hero10:head --><link rel="stylesheet" href="/sobremesas-de-travessa/assets/${cssName}"><script type="module" src="/sobremesas-de-travessa/assets/${jsName}"></script><noscript><style>#hero10-root [style*="opacity"]{opacity:1!important;filter:none!important}</style></noscript><!-- /hero10:head -->\n</head>`)
html = html.replace('<body>', `<body><!-- hero10:island --><div id="hero10-root">${markup}</div><!-- /hero10:island -->`)
await writeFile(path.join(out, 'index.html'), html)
// Only remove this builder's obsolete, content-addressed output files.
for (const name of await readdir(path.join(out, 'assets'))) {
  if (/^hero10-[a-f0-9]{12}\.(js|css)$/.test(name) && name !== jsName && name !== cssName) {
    await unlink(path.join(out, 'assets', name))
  }
}
await writeFile('.cache/hero10-build.json', JSON.stringify({ js: jsName, css: cssName, builtAt: new Date().toISOString() }, null, 2))
console.log(`Hero10 ready: ${jsName}, ${cssName}. Existing React root preserved.`)

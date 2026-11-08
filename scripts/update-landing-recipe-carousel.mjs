import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { RecipeCarousel } from '../hero/recipe-carousel.mjs'

const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')
const entry = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!entry) throw new Error('Landing entry not found')
const oldPath = path.join(root, 'assets', entry[1])
let bundle = await fs.readFile(oldPath, 'utf8')
const anchor = bundle.indexOf('function HowItWorks(){')
const previous = bundle.indexOf('function RecipeCarousel(')
if (anchor < 0) throw new Error('Component insertion point not found')
bundle = bundle.slice(0, previous < 0 ? anchor : previous) + RecipeCarousel.toString() + bundle.slice(anchor)
const before = '(0,D.jsx)(`div`,{className:`recipe-grid`,children:Ve.recipes.map'
const after = '(0,D.jsx)(RecipeCarousel,{children:Ve.recipes.map'
if (!bundle.includes(before) && !bundle.includes(after)) throw new Error('Recipe gallery not found')
bundle = bundle.replace(before, after)

// Wrap the existing server-rendered cards without changing any recipe or image.
if (!html.includes('class="recipe-carousel"')) {
  const start = html.indexOf('<div class="recipe-grid">')
  if (start < 0) throw new Error('Gallery markup not found')
  const tags = /<div\b[^>]*>|<\/div>/g
  tags.lastIndex = start
  let depth = 0, end = -1, match
  while ((match = tags.exec(html))) {
    depth += match[0].startsWith('</') ? -1 : 1
    if (!depth) { end = tags.lastIndex; break }
  }
  if (end < 0) throw new Error('Gallery markup incomplete')
  const gallery = html.slice(start, end).replace('<div class="recipe-grid">', '<div class="recipe-grid" tabindex="0" aria-label="Receitas: deslize ou use as setas para navegar">')
  const count = (gallery.match(/class="recipe-card"/g) || []).length
  if (!count) throw new Error('Empty recipe gallery')
  const controls = `<div class="recipe-carousel-controls"><button type="button" class="recipe-carousel-arrow" aria-label="Receita anterior" disabled="">‹</button><div class="recipe-carousel-status"><span>Deslize para ver todas</span><span aria-live="polite" aria-atomic="true">1<!-- --> de <!-- -->${count}</span></div><button type="button" class="recipe-carousel-arrow" aria-label="Próxima receita">›</button></div>`
  html = html.slice(0, start) + '<div class="recipe-carousel" role="region" aria-roledescription="carrossel" aria-label="Receitas de sobremesas">' + gallery + controls + '</div>' + html.slice(end)
}
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12)
const css = await fs.readFile(path.join(root, 'assets/recipe-carousel.css'))
html = html.replace(/<link rel="stylesheet" href="\/sobremesas-de-travessa\/assets\/recipe-carousel\.css[^\"]*">\s*/g, '')
html = html.replace('</head>', `<link rel="stylesheet" href="/sobremesas-de-travessa/assets/recipe-carousel.css?v=${digest(css)}">\n</head>`)
const name = `index-${digest(bundle)}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${entry[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (name !== entry[1]) await fs.unlink(oldPath)
console.log(`Local recipe carousel ready: ${name}. All existing cards preserved.`)

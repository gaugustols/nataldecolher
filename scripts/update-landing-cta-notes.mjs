import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')
const entry = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!entry) throw new Error('Landing entry not found')
const oldPath = path.join(root, 'assets', entry[1])
let bundle = await fs.readFile(oldPath, 'utf8')
const text = 'Acesso ao material digital • 30 dias de garantia'
if (!bundle.includes('function PurchaseNote(){')) {
  const anchor = 'function RecipeCarousel('
  if (!bundle.includes(anchor)) throw new Error('Component insertion point not found')
  bundle = bundle.replace(anchor, `function PurchaseNote(){return(0,D.jsx)("p",{className:"cta-access-note",children:${JSON.stringify(text)}})}` + anchor)
  const original = 'function qe({children:e=`QUERO CONHECER O KIT`,...t}){return(0,D.jsxs)(`a`,{className:`btn`,href:`#oferta`,...t,children:[e,(0,D.jsx)(ve,{size:19,"aria-hidden":`true`})]})}'
  const revised = 'function qe({children:e=`QUERO CONHECER O KIT`,...t}){return(0,D.jsxs)(D.Fragment,{children:[(0,D.jsxs)(`a`,{className:`btn`,href:`#oferta`,...t,children:[e,(0,D.jsx)(ve,{size:19,"aria-hidden":`true`})]}),(0,D.jsx)(PurchaseNote,{})]})}'
  if (!bundle.includes(original)) throw new Error('Primary CTA component not found')
  bundle = bundle.replace(original, revised)
  for (const marker of ['(0,D.jsxs)(`div`,{className:`offer-trust`', '(0,D.jsxs)(`a`,{className:`upgrade-decline`']) {
    if (!bundle.includes(marker)) throw new Error('CTA location not found')
    bundle = bundle.replace(marker, '(0,D.jsx)(PurchaseNote,{}),' + marker)
  }
  // Primary purchase links only. Basic-plan links keep their original conditions.
  html = html.replace(/(<a\b[^>]*class="btn"[^>]*>[\s\S]*?<\/a>)/g, `$1<p class="cta-access-note">${text}</p>`)
}
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12)
const css = await fs.readFile(path.join(root, 'assets/cta-access-note.css'))
html = html.replace(/<link rel="stylesheet" href="\/sobremesas-de-travessa\/assets\/cta-access-note\.css[^\"]*">\s*/g, '')
html = html.replace('</head>', `<link rel="stylesheet" href="/sobremesas-de-travessa/assets/cta-access-note.css?v=${digest(css)}">\n</head>`)
const name = `index-${digest(bundle)}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${entry[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (name !== entry[1]) await fs.unlink(oldPath)
console.log(`Primary CTA notes added locally: ${name}`)

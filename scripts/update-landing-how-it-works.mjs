import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { mockupHtml, mockupReact } from '../hero/offer-mockup.mjs'
import { howItWorks } from '../hero/how-it-works.mjs'

const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')
const entry = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!entry) throw new Error('Landing entry not found')
const oldPath = path.join(root, 'assets', entry[1])
let bundle = await fs.readFile(oldPath, 'utf8')
const start = bundle.indexOf('function HowItWorks(){')
const end = bundle.indexOf('function OfferDeviceMockup(){')
if (end < 0) throw new Error('Insertion point not found')
bundle = bundle.slice(0, start < 0 ? end : start) + 'function HowItWorks(){return ' + mockupReact(howItWorks) + '}' + bundle.slice(end)
const showcase = '(0,D.jsx)(`section`,{className:`section showcase`'
const call = '(0,D.jsx)(HowItWorks,{}),'
if (!bundle.includes(showcase)) throw new Error('Showcase section not found')
if (!bundle.includes(call + showcase)) bundle = bundle.replace(showcase, call + showcase)
const section = '<section class="section showcase"'
if (!html.includes(section)) throw new Error('Showcase markup not found')
html = html.replace(/<!-- how-it-works:start -->[\s\S]*?<!-- how-it-works:end -->/g, '')
html = html.replace(section, '<!-- how-it-works:start -->' + mockupHtml(howItWorks) + '<!-- how-it-works:end -->' + section)
const digest = bytes => createHash('sha256').update(bytes).digest('hex').slice(0, 12)
const css = await fs.readFile(path.join(root, 'assets/how-it-works.css'))
const link = `<link rel="stylesheet" href="/sobremesas-de-travessa/assets/how-it-works.css?v=${digest(css)}">`
html = html.replace(/<link rel="stylesheet" href="\/sobremesas-de-travessa\/assets\/how-it-works\.css[^\"]*">\s*/g, '')
html = html.replace('</head>', link + '\n</head>')
const name = `index-${digest(bundle)}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${entry[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (name !== entry[1]) await fs.unlink(oldPath)
console.log(`How it works added locally: ${name}. No checkout or tracking changes.`)

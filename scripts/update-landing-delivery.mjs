import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

// Keep server markup and the recovered React bundle's copy in agreement.
// No DOM replacements: the existing gallery, checkout and FAQ retain their state.
const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')
const script = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!script) throw new Error('Recovered application entry not found')
const bundlePath = path.join(root, 'assets', script[1])
let bundle = await fs.readFile(bundlePath, 'utf8')
const replacements = [
  ['Receba por e-mail e consulte no celular, tablet ou impresso.', 'Receba o acesso por e-mail e consulte as receitas no web app pelo celular.'],
  ['PDF para consultar no celular ou imprimir', 'Receitas no web app para consultar pelo celular'],
  ['Baixe os PDFs e consulte quando precisar.', 'Acesse as receitas pelo web app e consulte quando precisar.'],
  ['O material será enviado por e-mail.', 'Você receberá por e-mail o acesso ao web app.'],
  ['Quais categorias estão no livro?', 'Quais categorias estão no app?'],
  ['Uma das 30 receitas do livro', 'Uma das 30 receitas do app'],
  ['Veja dois exemplos completos do livro: Bombom de Uva e Cheesecake, dos ingredientes aos cuidados finais.', 'Conheça o conteúdo de duas receitas disponíveis no app: Bombom de Uva e Cheesecake, dos ingredientes aos cuidados finais.'],
  ['Receita completa em cinco páginas', 'Ingredientes, preparo, montagem e cuidados'],
  ['Página real do livro:', 'Prévia do conteúdo:'],
  ['Páginas reais do material', 'Conteúdo das receitas'],
  ['Acesso vitalício ao kit completo', 'Acesso vitalício ao web app completo'],
]
for (const [before, after] of replacements) {
  if (!bundle.includes(before) && !bundle.includes(after)) throw new Error('Missing copy: ' + before)
  bundle = bundle.replaceAll(before, after)
  html = html.replaceAll(before, after)
}
// The active hero preloads its own app screen. Drop the obsolete cover preload.
html = html.replace(/<link rel="preload" href="\.\/assets\/capa-480.webp"[^>]*\/>/, '')
const digest = createHash('sha256').update(bundle).digest('hex').slice(0, 12)
const name = `index-${digest}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${script[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (script[1] !== name) await fs.unlink(bundlePath)
console.log('Landing delivery copy updated:', name)

import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'
import { mockupHtml, mockupReact } from '../hero/offer-mockup.mjs'

// Keep server markup and the recovered React bundle's copy in agreement.
// No DOM replacements: the existing gallery, checkout and FAQ retain their state.
const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = (await fs.readFile(htmlPath, 'utf8')).replace(/\r\n/g, '\n')
const script = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!script) throw new Error('Recovered application entry not found')
const bundlePath = path.join(root, 'assets', script[1])
let bundle = (await fs.readFile(bundlePath, 'utf8')).replace(/\r\n/g, '\n')
// Normalize the previous product wording in both render paths.
const applicationCopy = text => text.replace(/\bweb app\b/gi, value => value === value.toUpperCase() ? 'APLICATIVO' : /^[A-Z]/.test(value) ? 'Aplicativo' : 'aplicativo')
html = applicationCopy(html)
bundle = applicationCopy(bundle)
const replacements = [
  ['Receba por e-mail e consulte no celular, tablet ou impresso.', 'Receba o acesso por e-mail e consulte as receitas no aplicativo pelo celular.'],
  ['PDF para consultar no celular ou imprimir', 'Receitas no aplicativo para consultar pelo celular'],
  ['Baixe os PDFs e consulte quando precisar.', 'Acesse as receitas pelo aplicativo e consulte quando precisar.'],
  ['O material será enviado por e-mail.', 'Você receberá por e-mail o acesso ao aplicativo.'],
  ['Quais categorias estão no livro?', 'Quais categorias estão no app?'],
  ['Uma das 30 receitas do livro', 'Uma das 30 receitas do app'],
  ['Veja dois exemplos completos do livro: Bombom de Uva e Cheesecake, dos ingredientes aos cuidados finais.', 'Conheça o conteúdo de duas receitas disponíveis no app: Bombom de Uva e Cheesecake, dos ingredientes aos cuidados finais.'],
  ['Receita completa em cinco páginas', 'Ingredientes, preparo, montagem e cuidados'],
  ['Página real do livro:', 'Prévia do conteúdo:'],
  ['Páginas reais do material', 'Conteúdo das receitas'],
  ['Acesso vitalício ao kit completo', 'Acesso vitalício ao aplicativo completo'],
]
for (const [before, after] of replacements) {
  if (!bundle.includes(before) && !bundle.includes(after)) throw new Error('Missing copy: ' + before)
  bundle = bundle.replaceAll(before, after)
  html = html.replaceAll(before, after)
}
// Current checkout offers supplied by the product owner.
const offers = {
  complete: { price: 19.90, checkout: 'https://pay.cakto.com.br/343dcvj_1286047' },
  basic: { price: 6.99, checkout: 'https://pay.cakto.com.br/oar8h9a' },
  upgrade: { price: 9.99, checkout: 'https://pay.cakto.com.br/qfmb2md' },
}
const pricePatterns = {
  complete: /(complete:\{name:`Plano completo`,price:)[\d.]+(,originalPrice:[\d.]+,checkout:`)[^`]+(`\})/,
  basic: /(basic:\{name:`Plano básico`,price:)[\d.]+(,checkout:`)[^`]+(`,description:)/,
  upgrade: /(upgrade:\{price:)[\d.]+(,checkout:`)[^`]+(`\})/,
}
for (const [key, offer] of Object.entries(offers)) {
  if (!pricePatterns[key].test(bundle)) throw new Error('Offer not found: ' + key)
  bundle = bundle.replace(pricePatterns[key], (_, prefix, middle, suffix) => prefix + offer.price + middle + offer.checkout + suffix)
}
const brl = value => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value)
const htmlOffers = [
  [/(<div class="offer-price">[\s\S]*?<strong>)[^<]+(<\/strong>)/, (_, prefix, suffix) => prefix + brl(offers.complete.price) + suffix],
  [/(<strong class="basic-price">)[^<]+(<\/strong>)/, (_, prefix, suffix) => prefix + brl(offers.basic.price) + suffix],
  [/(<a class="btn" href=")[^"]+("[^>]*>QUERO O PLANO COMPLETO)/, (_, prefix, suffix) => prefix + offers.complete.checkout + suffix],
]
for (const [pattern, replace] of htmlOffers) {
  if (!pattern.test(html)) throw new Error('Static offer markup not found')
  html = html.replace(pattern, replace)
}
// Shared device presentation. Change only the bundle component, preserving the
// plan's features, prices, checkout and surrounding layout.
const previousMockup = bundle.indexOf('function OfferDeviceMockup(){')
const componentEnd = bundle.indexOf('function Xe(')
if (componentEnd < 0) throw new Error('Offer component insertion point not found')
const componentStart = previousMockup < 0 ? componentEnd : previousMockup
bundle = bundle.slice(0, componentStart) + 'function OfferDeviceMockup(){return ' + mockupReact() + '}' + bundle.slice(componentEnd)
const oldOfferCall = 'children:`Plano completo`}),(0,D.jsx)(Ye,{})'
const newOfferCall = 'children:`Plano completo`}),(0,D.jsx)(OfferDeviceMockup,{})'
if (!bundle.includes(oldOfferCall) && !bundle.includes(newOfferCall)) throw new Error('Complete-plan component call not found')
bundle = bundle.replace(oldOfferCall, newOfferCall)
const markupStart = html.indexOf('<div class="bundle')
if (markupStart < 0) throw new Error('Offer markup not found')
const divs = /<div\b[^>]*>|<\/div>/g
divs.lastIndex = markupStart
let depth = 0, markupEnd = -1, match
while ((match = divs.exec(html))) {
  depth += match[0].startsWith('</') ? -1 : 1
  if (!depth) { markupEnd = divs.lastIndex; break }
}
if (markupEnd < 0) throw new Error('Incomplete offer markup')
html = html.slice(0, markupStart) + mockupHtml() + html.slice(markupEnd)
if (!html.includes('/assets/offer-devices.css')) {
  html = html.replace('</head>', '<link rel="stylesheet" href="/sobremesas-de-travessa/assets/offer-devices.css">\n</head>')
}
// The active hero preloads its own app screen. Drop the obsolete cover preload.
html = html.replace(/<link rel="preload" href="\.\/assets\/capa-480.webp"[^>]*\/>/, '')
// Remove the retired support contact from both server markup and React output.
const supportArticle = ',(0,D.jsxs)(`article`,{children:[(0,D.jsx)(Ee,{size:25,"aria-hidden":`true`}),(0,D.jsxs)(`div`,{children:[(0,D.jsx)(`h3`,{children:`Atendimento sobre a compra`}),(0,D.jsxs)(`p`,{children:[`Fale com a equipe pelo e-mail `,(0,D.jsx)(`a`,{href:`mailto:${k.supportEmail}`,children:k.supportEmail}),`.`]})]})]})'
const supportFooter = ',(0,D.jsx)(`p`,{children:(0,D.jsx)(`a`,{href:`mailto:${k.supportEmail}`,children:k.supportEmail})})'
bundle = bundle.replace(supportArticle, '').replace(supportFooter, '').replace(/,supportEmail:`[^`]*`/, '')
if (bundle.includes('supportEmail')) throw new Error('Retired support contact is still referenced')
html = html.replace(/<article\b[^>]*>[\s\S]*?<\/article>/g, article => article.includes('Atendimento sobre a compra') ? '' : article)
html = html.replace(/<p><a href="mailto:[^"]*">[^<]*<\/a><\/p>/g, '')
const digest = createHash('sha256').update(bundle).digest('hex').slice(0, 12)
const name = `index-${digest}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${script[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (script[1] !== name) await fs.unlink(bundlePath)
console.log('Landing delivery copy updated:', name)

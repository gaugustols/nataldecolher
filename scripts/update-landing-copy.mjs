import fs from 'node:fs/promises'
import path from 'node:path'
import { createHash } from 'node:crypto'

// Local copy-only migration: keep recovered React strings and server markup in
// agreement without changing offers, event handlers, images or section markup.
const root = path.resolve('public/sobremesas-de-travessa')
const htmlPath = path.join(root, 'index.html')
let html = await fs.readFile(htmlPath, 'utf8')
const entry = html.match(/src="\/sobremesas-de-travessa\/assets\/(index-[\w-]+\.js)"/)
if (!entry) throw new Error('Landing entry not found')
const oldPath = path.join(root, 'assets', entry[1])
let bundle = await fs.readFile(oldPath, 'utf8')
const replacements = [
  ['Já trabalha com confeitaria e quer ampliar seu cardápio de Natal.', 'Quer fazer uma renda extra neste Natal, mas ainda não sabe o que preparar para vender.'],
  ['Quer aproveitar as encomendas de fim de ano para fazer uma renda extra.', 'Não tem experiência com confeitaria e procura receitas fáceis de acompanhar, mesmo começando do zero.'],
  ['Busca sobremesas práticas para produzir em quantidade.', 'Quer começar a vender sobremesas, mas tem dúvidas sobre quanto cobrar para ter lucro.'],
  ['Quer oferecer travessas bonitas que chamem a atenção na mesa da ceia.', 'Gostaria de receber encomendas de Natal, mas não sabe como divulgar seus doces para atrair clientes.'],
  ['Deseja encantar seus clientes e ter seu trabalho lembrado nas próximas encomendas.', 'Quer aproveitar sua própria cozinha para preparar sobremesas e criar uma oportunidade de renda extra.'],
  ['Conheça o conteúdo de duas receitas disponíveis no app: Bombom de Uva e Cheesecake, dos ingredientes aos cuidados finais.', 'Veja como as receitas estão organizadas para ajudar você a preparar suas sobremesas, escolher o que vender e começar a montar seu cardápio de Natal.'],
  ['Três bônus para você ', 'Além das receitas, descubra como preparar seu cardápio para '],
  ['acelerar sua produção e lucrar mais rápido', 'começar a vender neste Natal!'],
  ['Aprenda quanto cobrar pelas travessas com base nos seus custos, usando exemplos e fichas simples.', 'Aprenda a calcular os custos das suas sobremesas, definir seus preços e entender quanto pode lucrar em cada venda.'],
  ['Copie e adapte mensagens prontas para divulgar suas sobremesas, responder clientes e fechar pedidos.', 'Descubra maneiras práticas de divulgar suas sobremesas, apresentar seu cardápio e atrair potenciais clientes para as encomendas de Natal.'],
  ['Veja como aproveitar ingredientes que sobraram, com fichas que explicam quando e como usar.', 'Aprenda a aproveitar melhor os ingredientes, reduzir desperdícios e organizar sua produção com mais economia.'],
]
for (const [before, after] of replacements) {
  for (const [label, content] of [['HTML', html], ['React', bundle]]) {
    if (!content.includes(before) && !content.includes(after)) throw new Error(`${label}: missing copy ${before}`)
  }
  html = html.replaceAll(before, after)
  bundle = bundle.replaceAll(before, after)
}
const name = `index-${createHash('sha256').update(bundle).digest('hex').slice(0, 12)}.js`
await fs.writeFile(path.join(root, 'assets', name), bundle)
html = html.replace(`/assets/${entry[1]}`, `/assets/${name}`)
await fs.writeFile(htmlPath, html)
if (name !== entry[1]) await fs.unlink(oldPath)
console.log(`Local landing copy updated: ${name}. No prices or checkout links changed.`)

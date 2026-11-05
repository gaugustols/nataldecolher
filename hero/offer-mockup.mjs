// Shared static presentation for HTML and the recovered React offer component.
const el = (tag, attrs, ...children) => ({ tag, attrs, children: children.flat() })
const icon = paths => el('svg', { viewBox: '0 0 24 24', fill: 'none', 'aria-hidden': 'true' },
  paths.map(d => el('path', { d })))
const bonuses = [
  { title: 'Guia de Preços', detail: 'Natal 2026', caption: 'Guia de Preços de Natal 2026',
    text: 'Mais segurança para cobrar', paths: ['M7 3h10a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Z', 'M8 7h8M8 11h2m4 0h2m-8 4h2m4 0h2m-8 3h2m4 0h2'] },
  { title: 'Kit de WhatsApp', detail: 'Encomendas de Natal', caption: 'Kit de WhatsApp para Encomendas de Natal',
    text: 'Mensagens para suas vendas', paths: ['M21 11.5a8.5 8.5 0 0 1-8.5 8.5H4l-2 2 1.5-6A8.5 8.5 0 1 1 21 11.5Z', 'M7 9h9M7 13h6'] },
  { title: 'Sobras que viram lucro', detail: 'Guia de aproveitamento', caption: 'Guia de aproveitamento: Sobras que viram lucro',
    text: 'Aproveite melhor os ingredientes', paths: ['M20 3c-8 0-14 3-14 9a6 6 0 0 0 6 6c6 0 9-7 8-15Z', 'M4 21 15 10'] },
]

export const offerMockup = el('div', { className: 'bundle bundle-digital' },
  el('figure', { className: 'offer-tablet' },
    el('div', { className: 'offer-tablet-frame' }, el('img', {
      src: '/sobremesas-de-travessa/assets/offer-tablet-screen.webp', width: 1009, height: 768,
      alt: 'Catálogo real do web app em um tablet, com as 30 receitas organizadas por categoria', loading: 'lazy', decoding: 'async',
    })),
    el('figcaption', {}, '30 RECEITAS NO SEU WEB APP')),
  el('p', { className: 'offer-bonus-label' }, el('span', {}, '+'), ' 3 BÔNUS PARA SUAS ENCOMENDAS'),
  el('div', { className: 'offer-bonus-phones', 'aria-label': 'Apresentação dos três bônus em celulares' },
    bonuses.map((bonus, index) => el('figure', { className: `offer-bonus-device offer-bonus-device-${index + 1}` },
      el('div', { className: 'offer-bonus-frame' },
        el('div', { className: 'offer-bonus-screen' },
          el('span', { className: 'offer-bonus-number' }, `BÔNUS ${String(index + 1).padStart(2, '0')}`),
          el('div', { className: 'offer-bonus-icon' }, icon(bonus.paths)),
          el('h4', {}, bonus.title),
          el('p', { className: 'offer-bonus-detail' }, bonus.detail),
          el('div', { className: 'offer-bonus-divider', 'aria-hidden': 'true' }),
          el('p', { className: 'offer-bonus-text' }, bonus.text))),
      el('figcaption', {}, bonus.caption)))),
  el('p', { className: 'offer-digital-summary' }, el('strong', {}, '30 receitas + 3 bônus'), el('span', {}, 'Tudo para suas encomendas')))

const escapeHtml = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c])
export function mockupHtml(node = offerMockup) {
  if (typeof node === 'string') return escapeHtml(node)
  const attrs = Object.entries(node.attrs).map(([key, value]) => ` ${key === 'className' ? 'class' : key}="${escapeHtml(value)}"`).join('')
  if (node.tag === 'img') return `<img${attrs}/>`
  return `<${node.tag}${attrs}>${node.children.map(mockupHtml).join('')}</${node.tag}>`
}
export function mockupReact(node = offerMockup) {
  if (typeof node === 'string') return JSON.stringify(node)
  const props = { ...node.attrs }
  const pairs = Object.entries(props).map(([key, value]) => `${JSON.stringify(key)}:${JSON.stringify(value)}`)
  if (node.children.length) pairs.push('children:' + (node.children.length === 1 ? mockupReact(node.children[0]) : '[' + node.children.map(mockupReact).join(',') + ']'))
  return `(0,D.${node.children.length > 1 ? 'jsxs' : 'jsx'})(${JSON.stringify(node.tag)},{${pairs.join(',')}})`
}

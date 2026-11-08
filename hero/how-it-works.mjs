// Shared content for server markup and the recovered React application.
const el = (tag, attrs, ...children) => ({ tag, attrs, children: children.flat() })
export const steps = [
  {
    title: 'Comece HOJE: abra o aplicativo e escolha suas receitas em até 1 dia',
    text: 'Acesse pelo celular, veja ingredientes e passo a passo, e decida AGORA quais sobremesas vão bombar neste Natal. Você tem 24 horas para definir seu cardápio — depois é correr atrás do prejuízo.',
  },
  {
    title: 'Divulgue seu cardápio e conquiste clientes em até 7 dias',
    text: 'No plano completo, você recebe modelos prontos para WhatsApp e Status. Adapte, poste e mostre suas sobremesas para quem pode comprar. Comece a divulgar HOJE e feche as primeiras encomendas até 15 de dezembro.',
  },
  {
    title: 'Transforme encomendas em renda extra até o Natal',
    text: 'Calcule custos, defina preços e organize a produção conforme os pedidos. Use sua cozinha e comece a vender HOJE. O prazo é curto: produza, entregue e lucre até 24 de dezembro. Quem se mexer agora fatura — quem enrolar fica de fora.',
  },
]
export const howItWorks = el('section', { className: 'section how-it-works', id: 'como-funciona', 'aria-labelledby': 'how-it-works-title' },
  el('div', { className: 'wrap' },
    el('header', { className: 'section-heading' },
      el('h2', { id: 'how-it-works-title' }, 'Como ', el('em', {}, 'funciona?'))),
    el('ol', { className: 'how-it-works-steps' }, steps.map((step, i) =>
      el('li', {},
        el('span', { className: 'how-it-works-number', 'aria-hidden': 'true' }, String(i + 1)),
        el('div', {}, el('h3', {}, step.title), el('p', {}, step.text))))),
    el('div', { className: 'how-it-works-action' },
      el('a', { className: 'btn', href: '#oferta' }, 'QUERO COMEÇAR HOJE',
        el('svg', { viewBox: '0 0 24 24', 'aria-hidden': 'true' },
          el('path', { d: 'm9 5 7 7-7 7' }))),
      el('p', { className: 'cta-access-note' }, 'Acesso ao material digital • 30 dias de garantia'))))

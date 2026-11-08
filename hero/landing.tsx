import { Hero10 } from '@/components/ui/hero-10'

const assets = '/sobremesas-de-travessa/assets/'
const benefits = [
  'Encante no Natal e conquiste motivos para seus clientes encomendarem de novo.',
  '30 sobremesas com passo a passo detalhado e montagem ilustrada.',
  'Receba o acesso por e-mail e consulte as receitas no aplicativo pelo celular.',
]
function ProductMockup() {
  return <div className="h10-product" aria-label="Aplicativo de receitas no celular, com Bombom de uva na travessa ao lado">
    <div className="h10-product-halo" aria-hidden="true" />
    <div className="h10-phone">
      <img src={`${assets}hero-webapp-screen.webp`} width="375" height="844" alt="Tela real do aplicativo: receita de Bombom de uva com ingredientes, preparo e opção de adicionar ao cardápio" fetchPriority="high" />
    </div>
    <img className="h10-dessert" src={`${assets}hero-bombom-recortado.webp`} width="1200" height="675" alt="Bombom de uva na travessa, com creme branco e cobertura de chocolate" fetchPriority="high" />
    <div className="h10-app-label"><span className="h10-app-dot" aria-hidden="true" />SUAS RECEITAS NO CELULAR</div>
    <div className="h10-product-count"><b>30</b><span>receitas para<br />consultar no app</span></div>
    <div className="h10-product-step"><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span>Passo a passo<br /><strong>com montagem ilustrada</strong></span></div>
  </div>
}
function CommercialDetails() {
  return <>
    <ul className="h10-benefits">
      {benefits.map(text => <li key={text}><svg viewBox="0 0 24 24" fill="none" aria-hidden="true"><path d="m5 12 4 4L19 6" /></svg><span>{text}</span></li>)}
    </ul>
    <div className="h10-people">
      <div className="h10-avatars" aria-hidden="true">{[1, 2, 3, 4].map(n => <span key={n}><img src={`${assets}hero-foto-${n}.webp`} alt="" width="44" height="44" /></span>)}</div>
      <p>Decidiram lucrar nesse Natal</p>
    </div>
  </>
}
export function HeroLanding() {
  return <Hero10
    eyebrow="RENDA EXTRA NO NATAL"
    title="DINHEIRO RÁPIDO NO NATAL:"
    highlightTitle
    titleHighlight=""
    titleSuffix=" Transforme sua cozinha em uma máquina de lucro com 30 sobremesas de travessa que vendem sozinhas!"
    description="O segredo para faturar uma renda extra pesada sem sair de casa: aprenda a preparar doces irrecusáveis, calcular o preço ideal e lotar seu WhatsApp de pedidos antes que o Natal chegue."
    images={[]}
    media={<ProductMockup />}
    animation="subtle"
    primaryCTA={{ ctaEnabled: true, text: 'QUERO COMEÇAR', link: '#oferta', variant: 'default', size: 'default' }}
    afterMedia={<CommercialDetails />}
  />
}

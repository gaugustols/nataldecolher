import { Hero10 } from '@/components/ui/hero-10'

const assets = '/sobremesas-de-travessa/assets/'
const benefits = [
  'Encante no Natal e conquiste motivos para seus clientes encomendarem de novo.',
  '30 sobremesas com passo a passo detalhado e montagem ilustrada.',
  'Receba por e-mail e consulte no celular, tablet ou impresso.',
]
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
    title="30 Receitas de sobremesas de travessa"
    titleHighlight="para vender neste Natal"
    description="Aproveite para lotar sua agenda de encomendas e lucrar nesse fim de ano com um produto de alta demanda."
    images={[`${assets}pagina-11-640.webp`, `${assets}capa-480.webp`, `${assets}pagina-126-640.webp`]}
    imageAlts={['Página real do livro: Bombom de uva na travessa', 'Capa do livro: 30 Receitas Sobremesas de Travessa para o Natal', 'Página real do livro: Cheesecake de colher com frutas vermelhas']}
    imageSrcSets={[
      `${assets}pagina-11-360.webp 360w, ${assets}pagina-11-640.webp 640w, ${assets}pagina-11-1063.webp 1063w`,
      `${assets}capa-320.webp 320w, ${assets}capa-400.webp 400w, ${assets}capa-480.webp 480w, ${assets}capa-800.webp 800w`,
      `${assets}pagina-126-360.webp 360w, ${assets}pagina-126-640.webp 640w, ${assets}pagina-126-1063.webp 1063w`,
    ]}
    animation="subtle"
    primaryCTA={{ ctaEnabled: false, text: 'QUERO AS RECEITAS', link: '#oferta', variant: 'default', size: 'default' }}
    mediaBadge={<div className="h10-quantity"><b>30</b><span>RECEITAS</span></div>}
    afterMedia={<CommercialDetails />}
  />
}

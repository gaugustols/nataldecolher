import { Button, type ButtonProps } from '@/components/ui/button'

export interface CtaProps {
  ctaEnabled: boolean
  text: string
  link: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}
export function Cta({ cta }: { cta: CtaProps }) {
  return <><Button asChild variant={cta.variant} size={cta.size} className="btn h10-cta"><a href={cta.link}>{cta.text}<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="m9 5 7 7-7 7" /></svg></a></Button><p className="cta-access-note">Acesso ao material digital • 30 dias de garantia</p></>
}

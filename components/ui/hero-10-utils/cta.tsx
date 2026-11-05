import { Button, type ButtonProps } from '@/components/ui/button'

export interface CtaProps {
  ctaEnabled: boolean
  text: string
  link: string
  variant?: ButtonProps['variant']
  size?: ButtonProps['size']
}
export function Cta({ cta }: { cta: CtaProps }) {
  return <Button asChild variant={cta.variant} size={cta.size} className="h10-cta rounded-full px-6"><a href={cta.link}>{cta.text}</a></Button>
}

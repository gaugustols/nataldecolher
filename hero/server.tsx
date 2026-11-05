import { renderToString } from 'react-dom/server'
import { HeroLanding } from './landing'

export function renderHero() { return renderToString(<HeroLanding />) }

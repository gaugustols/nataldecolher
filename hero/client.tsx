import { hydrateRoot } from 'react-dom/client'
import { HeroLanding } from './landing'
import { updateAuthor } from './author'

// Independent React root: never remove or rewrite children owned by the
// recovered application. Its original hero remains hidden, keeping hydration
// and the other sections' React state intact.
const target = document.getElementById('hero10-root')
if (target) hydrateRoot(target, <HeroLanding />)
updateAuthor()
